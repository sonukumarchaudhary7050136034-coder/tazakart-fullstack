import hashlib
import os
import re
import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth
from app.email_service import send_otp_email, smtp_configured

router = APIRouter(prefix="/api/auth", tags=["auth"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
APP_ENV = os.getenv("APP_ENV", "dev")  # set APP_ENV=production to hide dev_otp

OTP_VALID_MINUTES = 5
OTP_RESEND_SECONDS = 30
OTP_MAX_ATTEMPTS = 5
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _hash_otp(email: str, otp: str) -> str:
    return hashlib.sha256(f"{email}:{otp}:{auth.SECRET_KEY}".encode()).hexdigest()


def _clean_email(email: str) -> str:
    email = email.strip().lower()
    if not EMAIL_RE.match(email):
        raise HTTPException(status_code=400, detail="Enter a valid email address")
    return email


# ---------------- Email OTP ----------------
@router.post("/email/send-otp")
def send_email_otp(
    payload: schemas.SendEmailOtpRequest,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
):
    email = _clean_email(payload.email)

    last = (
        db.query(models.EmailOtp)
        .filter(models.EmailOtp.email == email)
        .order_by(models.EmailOtp.created_at.desc())
        .first()
    )
    if last and (datetime.utcnow() - last.created_at).total_seconds() < OTP_RESEND_SECONDS:
        raise HTTPException(status_code=429, detail=f"Please wait {OTP_RESEND_SECONDS} seconds before requesting another code")

    otp = f"{secrets.randbelow(900000) + 100000}"  # 6-digit
    db.query(models.EmailOtp).filter(models.EmailOtp.email == email).delete()
    db.add(
        models.EmailOtp(
            email=email,
            otp_hash=_hash_otp(email, otp),
            expires_at=datetime.utcnow() + timedelta(minutes=OTP_VALID_MINUTES),
        )
    )
    db.commit()

    background.add_task(send_otp_email, email, otp)

    resp = {"message": "OTP sent to your email"}
    # Only expose OTP when SMTP isn't set up AND we're in dev — never in production.
    if APP_ENV != "production" and not smtp_configured():
        resp["dev_otp"] = otp
    return resp


@router.post("/email/verify-otp", response_model=schemas.Token)
def verify_email_otp(payload: schemas.VerifyEmailOtpRequest, db: Session = Depends(get_db)):
    email = _clean_email(payload.email)
    record = (
        db.query(models.EmailOtp)
        .filter(models.EmailOtp.email == email)
        .order_by(models.EmailOtp.created_at.desc())
        .first()
    )
    if not record or record.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP expired. Please request a new one")
    if record.attempts >= OTP_MAX_ATTEMPTS:
        raise HTTPException(status_code=429, detail="Too many wrong attempts. Request a new OTP")

    if not secrets.compare_digest(record.otp_hash, _hash_otp(email, payload.otp.strip())):
        record.attempts += 1
        db.commit()
        raise HTTPException(status_code=400, detail="Incorrect OTP")

    db.delete(record)

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        user = models.User(
            name=(payload.name or email.split("@")[0]).strip(),
            email=email,
            auth_provider="email",
            is_email_verified=True,
        )
        db.add(user)
    else:
        user.is_email_verified = True
    db.commit()
    db.refresh(user)

    if user.is_blocked:
        raise HTTPException(status_code=403, detail="This account has been blocked")

    token = auth.create_access_token({"sub": str(user.id), "role": "user"})
    return {"access_token": token, "role": "user"}


# ---------------- Google Login ----------------
@router.post("/google", response_model=schemas.Token)
def google_login(payload: schemas.GoogleLoginRequest, db: Session = Depends(get_db)):
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google login is not configured on the server (missing GOOGLE_CLIENT_ID)")

    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests

    try:
        info = id_token.verify_oauth2_token(payload.credential, google_requests.Request(), GOOGLE_CLIENT_ID)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google sign-in. Please try again")

    if not info.get("email_verified"):
        raise HTTPException(status_code=400, detail="Your Google email is not verified")

    google_id = info["sub"]
    email = info["email"].lower()
    name = info.get("name") or email.split("@")[0]

    user = db.query(models.User).filter(models.User.google_id == google_id).first()
    if not user:
        user = db.query(models.User).filter(models.User.email == email).first()
        if user:  # same email already used via Email OTP -> link accounts
            user.google_id = google_id
            user.is_email_verified = True
        else:
            user = models.User(
                name=name, email=email, google_id=google_id,
                auth_provider="google", is_email_verified=True,
            )
            db.add(user)
        db.commit()
        db.refresh(user)

    if user.is_blocked:
        raise HTTPException(status_code=403, detail="This account has been blocked")

    token = auth.create_access_token({"sub": str(user.id), "role": "user"})
    return {"access_token": token, "role": "user"}


@router.get("/config")
def public_auth_config():
    """Lets the frontend know which login methods are available."""
    return {"google_enabled": bool(GOOGLE_CLIENT_ID), "google_client_id": GOOGLE_CLIENT_ID or None}


# ---------------- Admin ----------------
@router.post("/admin/login", response_model=schemas.Token)
def admin_login(payload: schemas.AdminLoginRequest, db: Session = Depends(get_db)):
    admin = db.query(models.Admin).filter(models.Admin.email == payload.email).first()
    if not admin or not auth.verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    token = auth.create_access_token({"sub": str(admin.id), "role": "admin"})
    return {"access_token": token, "role": "admin"}


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
