from pydantic import BaseModel
from typing import List, Optional
import datetime

class PackSize(BaseModel):
    size: str
    price: float

class FAQItem(BaseModel):
    question: str
    answer: str


class ProductBase(BaseModel):
    name: str
    slug: Optional[str] = None
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
    active_ingredient: Optional[str] = None
    indication: Optional[str] = None
    packaging: Optional[str] = None
    strength: Optional[str] = None
    delivery_time: Optional[str] = None
    rx_required: Optional[bool] = False
    referred_by_doctor: Optional[str] = None
    doctor_title: Optional[str] = None
    doctor_institution: Optional[str] = None
    doctor_image_url: Optional[str] = None
    doctor_advice: Optional[str] = None
    reviewer_slug: Optional[str] = None
    writer_slug: Optional[str] = None
    tags: Optional[List[str]] = None
    is_featured: Optional[bool] = False
    is_trending: Optional[bool] = False
    is_bestselling: Optional[bool] = False
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    focus_keyword: Optional[str] = None
    faqs: Optional[List[FAQItem]] = None



class ProductCreate(ProductBase):
    pass

class AuthorBase(BaseModel):
    slug: str
    name: str
    role: str
    badge: Optional[str] = None
    educationShort: Optional[str] = None
    image: Optional[str] = None
    aboutSub: Optional[str] = None
    educationList: Optional[List[str]] = None
    bioParagraphs: Optional[List[str]] = None
    research: Optional[str] = None
    grants: Optional[List[str]] = None
    interests: Optional[str] = None
    affiliations: Optional[List[str]] = None
    service: Optional[str] = None
    conclusion: Optional[str] = None
    isDoctor: Optional[bool] = True

class AuthorCreate(AuthorBase):
    pass

class Author(AuthorBase):
    id: int

    class Config:
        from_attributes = True

class Product(ProductBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True

class ProductListItem(BaseModel):
    """Lightweight product schema for list views - excludes large text/image fields."""
    id: int
    name: Optional[str] = None
    slug: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    stock: int = 0
    category: Optional[str] = None
    brand: Optional[str] = None
    manufacturer: Optional[str] = None
    active_ingredient: Optional[str] = None
    indication: Optional[str] = None
    packaging: Optional[str] = None
    strength: Optional[str] = None
    delivery_time: Optional[str] = None
    rx_required: Optional[bool] = False
    tags: Optional[List[str]] = None
    is_featured: Optional[bool] = False
    is_trending: Optional[bool] = False
    is_bestselling: Optional[bool] = False
    pack_sizes: Optional[List[PackSize]] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    focus_keyword: Optional[str] = None
    reviewer_slug: Optional[str] = None
    writer_slug: Optional[str] = None
    referred_by_doctor: Optional[str] = None
    doctor_title: Optional[str] = None
    doctor_institution: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True

class ProductResponse(BaseModel):
    items: List[ProductListItem]
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
    excerpt: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None
    author: Optional[str] = None
    date: Optional[str] = None

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
    role: Optional[str] = "customer"

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

class OrderItem(BaseModel):
    id: Optional[int] = None
    name: str
    price: float
    quantity: int
    packSize: Optional[str] = None
    image_url: Optional[str] = None
    slug: Optional[str] = None

class OrderBase(BaseModel):
    customer_email: str
    total_price: float
    status: str = "Pending"
    items: Optional[List[OrderItem]] = None
    shipping_details: Optional[dict] = None
    billing_details: Optional[dict] = None
    estimated_delivery: Optional[str] = None
    courier: Optional[str] = None
    tracking_number: Optional[str] = None

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    status: str
    estimated_delivery: Optional[str] = None
    courier: Optional[str] = None
    tracking_number: Optional[str] = None

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


class EmailOTPRequest(BaseModel):
    email: str


class EmailOTPVerify(BaseModel):
    email: str
    otp: str


class SEOSettings(BaseModel):
    homepage_meta_title: Optional[str] = ""
    homepage_meta_description: Optional[str] = ""
    homepage_focus_keyword: Optional[str] = ""
