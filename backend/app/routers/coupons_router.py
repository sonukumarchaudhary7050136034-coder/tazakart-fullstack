from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/coupons", tags=["coupons"])


@router.get("", response_model=list[schemas.CouponOut])
def list_active_coupons(db: Session = Depends(get_db)):
    return db.query(models.Coupon).filter(models.Coupon.is_active == True).all()  # noqa: E712


@router.post("", response_model=schemas.CouponOut)
def create_coupon(
    payload: schemas.CouponCreate,
    db: Session = Depends(get_db),
    _admin: models.Admin = Depends(auth.get_current_admin),
):
    if db.query(models.Coupon).filter(models.Coupon.code == payload.code.upper()).first():
        raise HTTPException(status_code=400, detail="Coupon code already exists")
    coupon = models.Coupon(
        code=payload.code.upper(), discount_text=payload.discount_text, min_order=payload.min_order
    )
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon


@router.put("/{coupon_id}/toggle", response_model=schemas.CouponOut)
def toggle_coupon(
    coupon_id: int,
    db: Session = Depends(get_db),
    _admin: models.Admin = Depends(auth.get_current_admin),
):
    coupon = db.query(models.Coupon).filter(models.Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    coupon.is_active = not coupon.is_active
    db.commit()
    db.refresh(coupon)
    return coupon


@router.delete("/{coupon_id}")
def delete_coupon(
    coupon_id: int,
    db: Session = Depends(get_db),
    _admin: models.Admin = Depends(auth.get_current_admin),
):
    coupon = db.query(models.Coupon).filter(models.Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    db.delete(coupon)
    db.commit()
    return {"message": "Coupon deleted"}
