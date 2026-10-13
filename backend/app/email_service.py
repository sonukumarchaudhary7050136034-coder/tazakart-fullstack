import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME", "TazaKart")


def smtp_configured() -> bool:
    return bool(SMTP_USER and SMTP_PASSWORD)


def send_otp_email(to_email: str, otp: str) -> None:
    """Send the OTP mail. If SMTP isn't configured, print to server log (dev mode)."""
    if not smtp_configured():
        print(f"[DEV] SMTP not configured. OTP for {to_email}: {otp}")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"{otp} is your {MAIL_FROM_NAME} login code"
    msg["From"] = f"{MAIL_FROM_NAME} <{SMTP_USER}>"
    msg["To"] = to_email
    html = f"""
    <div style="font-family:Segoe UI,Arial,sans-serif;max-width:420px;margin:auto;padding:24px">
      <h2 style="color:#1B7A43;margin:0 0 8px">{MAIL_FROM_NAME}</h2>
      <p>Your one-time login code is:</p>
      <p style="font-size:32px;font-weight:700;letter-spacing:8px;margin:16px 0">{otp}</p>
      <p style="color:#6B7568;font-size:13px">This code expires in 5 minutes. If you didn't request it, ignore this email.</p>
    </div>
    """
    msg.attach(MIMEText(f"Your {MAIL_FROM_NAME} login code is {otp}. It expires in 5 minutes.", "plain"))
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, [to_email], msg.as_string())
