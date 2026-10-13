from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/orders", tags=["orders"])

DELIVERY_CHARGE = 25
HANDLING_CHARGE = 4
FREE_DELIVERY_ABOVE = 199


@router.post("", response_model=schemas.OrderOut)
def place_order(
    payload: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    cart_items = (
        db.query(models.CartItem)
        .options(joinedload(models.CartItem.product))
        .filter(models.CartItem.user_id == current_user.id)
        .all()
    )
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    address = (
        db.query(models.Address)
        .filter(models.Address.id == payload.address_id, models.Address.user_id == current_user.id)
        .first()
    )
    if not address:
        raise HTTPException(status_code=400, detail="Invalid delivery address")

    for item in cart_items:
        if item.product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"{item.product.name} is out of stock")

    items_total = sum(item.product.price * item.quantity for item in cart_items)
    delivery_charge = 0 if items_total >= FREE_DELIVERY_ABOVE else DELIVERY_CHARGE
    grand_total = items_total + delivery_charge + HANDLING_CHARGE

    order = models.Order(
        user_id=current_user.id,
        address_id=address.id,
        items_total=items_total,
        delivery_charge=delivery_charge,
        handling_charge=HANDLING_CHARGE,
        grand_total=grand_total,
        payment_method=payload.payment_method,
        status=models.OrderStatus.pending,
    )
    db.add(order)
    db.flush()

    for item in cart_items:
        db.add(
            models.OrderItem(
                order_id=order.id,
                product_id=item.product.id,
                product_name=item.product.name,
                price=item.product.price,
                quantity=item.quantity,
            )
        )
        item.product.stock -= item.quantity
        db.delete(item)

    db.commit()
    db.refresh(order)
    return order


@router.get("/my", response_model=list[schemas.OrderOut])
def my_orders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    return (
        db.query(models.Order)
        .options(joinedload(models.Order.items))
        .filter(models.Order.user_id == current_user.id)
        .order_by(models.Order.created_at.desc())
        .all()
    )


# ---------- Admin ----------
@router.get("", response_model=list[schemas.OrderOut])
def all_orders(
    db: Session = Depends(get_db),
    _admin: models.Admin = Depends(auth.get_current_admin),
):
    return (
        db.query(models.Order)
        .options(joinedload(models.Order.items))
        .order_by(models.Order.created_at.desc())
        .all()
    )


@router.put("/{order_id}/status", response_model=schemas.OrderOut)
def update_order_status(
    order_id: int,
    payload: schemas.OrderStatusUpdate,
    db: Session = Depends(get_db),
    _admin: models.Admin = Depends(auth.get_current_admin),
):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    valid_statuses = [s.value for s in models.OrderStatus]
    if payload.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of {valid_statuses}")
    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order
