from fastapi import FastAPI, Depends, HTTPException, status, Query
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
import datetime

from . import crud, schemas, auth
from .database import get_db, get_next_id
import os

root_path = "/api" if os.getenv("VERCEL") else ""
app = FastAPI(title="Medicare API", root_path=root_path)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Medicare API"}

@app.post("/auth/signup", response_model=schemas.User)
def signup(user: schemas.UserCreate, db = Depends(get_db)):
    db_user = db.users.find_one({"username": user.username})
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    try:
        hashed_password = auth.get_password_hash(user.password)
        db_user = {
            "username": user.username,
            "email": user.email,
            "phone_number": user.phone_number,
            "hashed_password": hashed_password,
            "is_active": True,
            "id": get_next_id("users")
        }
        db.users.insert_one(db_user)
        return db_user
    except Exception as e:
        import traceback
        error_msg = str(e) + "\n" + traceback.format_exc()
        raise HTTPException(status_code=400, detail=error_msg)

@app.post("/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(get_db)):
    user = db.users.find_one({"username": form_data.username})
    if not user or not auth.verify_password(form_data.password, user.get("hashed_password")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user["username"]})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": {
            "id": user["id"], 
            "username": user["username"], 
            "email": user.get("email")
        }
    }

@app.post("/auth/login/phone")
def login_phone(login_data: schemas.PhoneLogin, db = Depends(get_db)):
    user = db.users.find_one({"phone_number": login_data.phone_number})
    if not user:
        user = {
            "username": login_data.phone_number,
            "phone_number": login_data.phone_number,
            "is_active": True,
            "id": get_next_id("users")
        }
        db.users.insert_one(user)
    
    access_token = auth.create_access_token(data={"sub": user.get("username") or user.get("phone_number")})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": {
            "id": user["id"], 
            "username": user.get("username"), 
            "phone": user.get("phone_number")
        }
    }

@app.post("/auth/login/google")
def login_google(login_data: schemas.GoogleLogin, db = Depends(get_db)):
    mock_google_id = "google_" + login_data.token[:10]
    user = db.users.find_one({"google_id": mock_google_id})
    if not user:
        user = {
            "username": f"google_user_{login_data.token[:5]}",
            "google_id": mock_google_id,
            "email": f"{mock_google_id}@gmail.com",
            "is_active": True,
            "id": get_next_id("users")
        }
        db.users.insert_one(user)
    
    access_token = auth.create_access_token(data={"sub": user["username"]})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": {
            "id": user["id"], 
            "username": user["username"], 
            "email": user.get("email")
        }
    }

@app.post("/auth/forgot-password")
def forgot_password(data: schemas.ForgotPassword, db = Depends(get_db)):
    user = db.users.find_one({
        "$or": [
            {"email": data.contact},
            {"phone_number": data.contact},
            {"username": data.contact}
        ]
    })
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "OTP sent successfully"}

@app.post("/auth/verify-otp")
def verify_otp(data: schemas.VerifyOTP, db = Depends(get_db)):
    if data.otp != "123456" and len(data.otp) != 6:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    return {"message": "OTP verified successfully"}

@app.post("/auth/reset-password")
def reset_password(data: schemas.ResetPassword, db = Depends(get_db)):
    user = db.users.find_one({
        "$or": [
            {"email": data.contact},
            {"phone_number": data.contact},
            {"username": data.contact}
        ]
    })
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    hashed_password = auth.get_password_hash(data.new_password)
    db.users.update_one({"id": user["id"]}, {"$set": {"hashed_password": hashed_password}})
    return {"message": "Password reset successfully"}

@app.post("/products/", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    return crud.create_product(db=db, product=product)

@app.get("/products/", response_model=schemas.ProductResponse)
def read_products(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = None,
    db = Depends(get_db)
):
    result = crud.get_products(
        db, skip=skip, limit=limit, search=search, 
        category=category, brand=brand, 
        min_price=min_price, max_price=max_price, sort_by=sort_by
    )
    return result

@app.get("/products/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db = Depends(get_db)):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.put("/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product: schemas.ProductCreate, db = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_product = crud.update_product(db, product_id=product_id, product=product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.delete("/products/{product_id}", response_model=schemas.Product)
def delete_product(product_id: int, db = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_product = crud.delete_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.get("/products/{product_id}/related", response_model=List[schemas.Product])
def read_related_products(product_id: int, db = Depends(get_db)):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return crud.get_related_products(db, category=db_product.get("category"), current_product_id=product_id)

@app.post("/categories/", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    return crud.create_category(db=db, category=category)

@app.get("/categories/", response_model=List[schemas.Category])
def read_categories(skip: int = 0, limit: int = 100, db = Depends(get_db)):
    return crud.get_categories(db, skip=skip, limit=limit)

@app.put("/categories/{category_id}", response_model=schemas.Category)
def update_category(category_id: int, category: schemas.CategoryCreate, db = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_category = crud.update_category(db, category_id=category_id, category=category)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@app.delete("/categories/{category_id}", response_model=schemas.Category)
def delete_category(category_id: int, db = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_category = crud.delete_category(db, category_id=category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@app.post("/blogs/", response_model=schemas.Blog)
def create_blog(blog: schemas.BlogCreate, db = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    return crud.create_blog(db=db, blog=blog, author_id=current_user.id)

@app.get("/blogs/", response_model=List[schemas.Blog])
def read_blogs(skip: int = 0, limit: int = 100, db = Depends(get_db)):
    blogs = crud.get_blogs(db, skip=skip, limit=limit)
    return blogs

@app.get("/blogs/{blog_id}", response_model=schemas.Blog)
def read_blog(blog_id: int, db = Depends(get_db)):
    db_blog = crud.get_blog(db, blog_id=blog_id)
    if db_blog is None:
        raise HTTPException(status_code=404, detail="Blog article not found")
    return db_blog

@app.put("/blogs/{blog_id}", response_model=schemas.Blog)
def update_blog(blog_id: int, blog: schemas.BlogCreate, db = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_blog = crud.update_blog(db, blog_id=blog_id, blog=blog)
    if db_blog is None:
        raise HTTPException(status_code=404, detail="Blog article not found")
    return db_blog

@app.delete("/blogs/{blog_id}", response_model=schemas.Blog)
def delete_blog(blog_id: int, db = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_blog = crud.delete_blog(db, blog_id=blog_id)
    if db_blog is None:
        raise HTTPException(status_code=404, detail="Blog article not found")
    return db_blog

@app.post("/orders/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db = Depends(get_db)):
    return crud.create_order(db=db, order=order)

@app.get("/orders/", response_model=List[schemas.Order])
def read_orders(status: Optional[str] = None, skip: int = 0, limit: int = 100, db = Depends(get_db)):
    if db.orders.count_documents({}) == 0:
        mock_orders = [
            {"customer_email": "john@example.com", "total_price": 145.20, "status": "Pending", "created_at": datetime.datetime.utcnow(), "id": get_next_id("orders")},
            {"customer_email": "sarah@example.com", "total_price": 55.00, "status": "Shipped", "created_at": datetime.datetime.utcnow(), "id": get_next_id("orders")},
            {"customer_email": "mike@example.com", "total_price": 89.99, "status": "Delivered", "created_at": datetime.datetime.utcnow(), "id": get_next_id("orders")},
            {"customer_email": "emily@example.com", "total_price": 210.50, "status": "Pending", "created_at": datetime.datetime.utcnow(), "id": get_next_id("orders")},
            {"customer_email": "alex@example.com", "total_price": 32.15, "status": "Delivered", "created_at": datetime.datetime.utcnow(), "id": get_next_id("orders")},
            {"customer_email": "david@example.com", "total_price": 120.00, "status": "Cancelled", "created_at": datetime.datetime.utcnow(), "id": get_next_id("orders")},
        ]
        db.orders.insert_many(mock_orders)
        
    return crud.get_orders(db, status=status, skip=skip, limit=limit)

@app.put("/orders/{order_id}/status", response_model=schemas.Order)
def update_order_status(order_id: int, order_update: schemas.OrderUpdate, db = Depends(get_db)):
    db_order = crud.update_order_status(db, order_id=order_id, new_status=order_update.status)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db = Depends(get_db)):
    return crud.get_all_users(db, skip=skip, limit=limit)

@app.put("/users/{user_id}/status", response_model=schemas.User)
def update_user_status(user_id: int, status_update: schemas.UserStatusUpdate, db = Depends(get_db)):
    db_user = crud.update_user_status(db, user_id=user_id, is_active=status_update.is_active)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.get("/coupons/", response_model=List[schemas.Coupon])
def read_coupons(skip: int = 0, limit: int = 100, db = Depends(get_db)):
    return crud.get_coupons(db, skip=skip, limit=limit)

@app.post("/coupons/", response_model=schemas.Coupon)
def create_coupon(coupon: schemas.CouponCreate, db = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    return crud.create_coupon(db=db, coupon=coupon)

@app.put("/coupons/{coupon_id}", response_model=schemas.Coupon)
def update_coupon(coupon_id: int, coupon: schemas.CouponCreate, db = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_coupon = crud.update_coupon(db, coupon_id=coupon_id, coupon=coupon)
    if db_coupon is None:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return db_coupon

@app.delete("/coupons/{coupon_id}", response_model=schemas.Coupon)
def delete_coupon(coupon_id: int, db = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_coupon = crud.delete_coupon(db, coupon_id=coupon_id)
    if db_coupon is None:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return db_coupon

@app.get("/authors/", response_model=List[schemas.Author])
def read_authors(db = Depends(get_db)):
    return crud.get_authors(db)

@app.get("/authors/{slug}", response_model=schemas.Author)
def read_author(slug: str, db = Depends(get_db)):
    db_author = crud.get_author(db, slug=slug)
    if db_author is None:
        raise HTTPException(status_code=404, detail="Author profile not found")
    return db_author

@app.post("/authors/", response_model=schemas.Author)
def create_author(author: schemas.AuthorCreate, db = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    return crud.create_author(db=db, author=author)

@app.put("/authors/{slug}", response_model=schemas.Author)
def update_author(slug: str, author: schemas.AuthorCreate, db = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_author = crud.update_author(db, slug=slug, author=author)
    if db_author is None:
        raise HTTPException(status_code=404, detail="Author profile not found")
    return db_author

@app.delete("/authors/{slug}", response_model=schemas.Author)
def delete_author(slug: str, db = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_author = crud.delete_author(db, slug=slug)
    if db_author is None:
        raise HTTPException(status_code=404, detail="Author profile not found")
    return db_author

@app.get("/admin/analytics")
def get_analytics(db = Depends(get_db)):
    return crud.get_admin_analytics(db)

# Auto-seed the database if it is empty (safe from circular imports now)
try:
    from .database import db
    if db.counters.count_documents({}) == 0 and db.products.count_documents({}) == 0:
        print("No products or counters found in database. Auto-seeding database...")
        from . import seed
except Exception as e:
    print(f"Failed to auto-seed database: {e}")
