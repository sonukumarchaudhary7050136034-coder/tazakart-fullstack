from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=list[schemas.UserOut])
def list_users(
    db: Session = Depends(get_db),
    _admin: models.Admin = Depends(auth.get_current_admin),
):
    return db.query(models.User).all()


@router.put("/{user_id}/block", response_model=schemas.UserOut)
def toggle_block(
    user_id: int,
    db: Session = Depends(get_db),
    _admin: models.Admin = Depends(auth.get_current_admin),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_blocked = not user.is_blocked
    db.commit()
    db.refresh(user)
    return user
