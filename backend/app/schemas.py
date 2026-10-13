from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


# ---------- Auth ----------
class SendEmailOtpRequest(BaseModel):
    email: str


class VerifyEmailOtpRequest(BaseModel):
    email: str
    otp: str
    name: Optional[str] = None


class GoogleLoginRequest(BaseModel):
    credential: str  # Google ID token from "Continue with Google"


class AdminLoginRequest(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str


# ---------- User ----------
class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: Optional[str] = None
    mobile: Optional[str] = None
    auth_provider: Optional[str] = None
    is_blocked: bool


# ---------- Category ----------
class SubCategoryCreate(BaseModel):
    slug: str
    name: str


class SubCategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str
    name: str


class CategoryCreate(BaseModel):
    slug: str
    name: str
    icon: str = "🛍️"


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str
    name: str
    icon: str
    subcategories: List[SubCategoryOut] = []


# ---------- Product ----------
class ProductCreate(BaseModel):
    name: str
    unit: str
    price: float
    mrp: float
    image: Optional[str] = "/products/placeholder.svg"
    stock: int = 0
    delivery_time: str = "10 MINS"
    category_id: int
    subcategory_id: Optional[int] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    unit: Optional[str] = None
    price: Optional[float] = None
    mrp: Optional[float] = None
    image: Optional[str] = None
    stock: Optional[int] = None
    category_id: Optional[int] = None
    subcategory_id: Optional[int] = None


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    unit: str
    price: float
    mrp: float
    image: str
    stock: int
    delivery_time: str
    category_id: int
    subcategory_id: Optional[int] = None


# ---------- Address ----------
class AddressCreate(BaseModel):
    label: str = "Home"
    house: str
    area: str
    city: str
    pincode: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class AddressOut(AddressCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------- Cart ----------
class CartAddRequest(BaseModel):
    product_id: int
    quantity: int = 1


class CartItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    product: ProductOut
    quantity: int


# ---------- Orders ----------
class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    product_name: str
    price: float
    quantity: int


class OrderCreate(BaseModel):
    address_id: int
    payment_method: str = "cod"


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    items_total: float
    delivery_charge: float
    handling_charge: float
    grand_total: float
    payment_method: str
    status: str
    created_at: datetime
    items: List[OrderItemOut] = []


class OrderStatusUpdate(BaseModel):
    status: str


# ---------- Coupon ----------
class CouponCreate(BaseModel):
    code: str
    discount_text: str
    min_order: float = 0


class CouponOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    code: str
    discount_text: str
    min_order: float
    is_active: bool
