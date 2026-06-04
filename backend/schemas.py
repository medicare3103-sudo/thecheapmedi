from pydantic import BaseModel
from typing import List, Optional
import datetime

class PackSize(BaseModel):
    size: str
    price: float

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    stock: int = 0
    category: Optional[str] = None
    brand: Optional[str] = None
    dosage: Optional[str] = None
    side_effects: Optional[str] = None
    uses: Optional[str] = None
    manufacturer: Optional[str] = None
    pack_sizes: Optional[List[PackSize]] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True

class ProductResponse(BaseModel):
    items: List[Product]
    total: int

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True

class BlogBase(BaseModel):
    title: str
    content: str

class BlogCreate(BlogBase):
    pass

class Blog(BlogBase):
    id: int
    author_id: int
    created_at: datetime.datetime

    class Config:
        orm_mode = True
        from_attributes = True

class UserBase(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    google_id: Optional[str] = None

class UserCreate(UserBase):
    password: Optional[str] = None

class PhoneLogin(BaseModel):
    phone_number: str
    otp: str

class GoogleLogin(BaseModel):
    token: str

class ForgotPassword(BaseModel):
    contact: str  # email or phone

class VerifyOTP(BaseModel):
    contact: str
    otp: str

class ResetPassword(BaseModel):
    contact: str
    otp: str
    new_password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True
        from_attributes = True

class UserStatusUpdate(BaseModel):
    is_active: bool

class OrderBase(BaseModel):
    customer_email: str
    total_price: float
    status: str = "Pending"

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    status: str

class Order(OrderBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class CouponBase(BaseModel):
    code: str
    discount_type: str
    discount_value: float
    min_purchase: Optional[float] = None
    expiry_date: Optional[datetime.datetime] = None
    is_active: bool = True

class CouponCreate(CouponBase):
    pass

class Coupon(CouponBase):
    id: int

    class Config:
        from_attributes = True


