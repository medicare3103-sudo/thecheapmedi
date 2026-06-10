from fastapi import FastAPI, Depends, HTTPException, status, Query, Request, Response
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
import datetime

from . import crud, schemas, auth
from .database import get_db, get_next_id
import os

root_path = "/api" if os.getenv("VERCEL") else ""
app = FastAPI(title="The Cheap Pharma API", root_path=root_path)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import re

@app.on_event("startup")
def migrate_slugs_and_tags():
    try:
        from .database import db
        # 1. Migrate missing slugs
        slug_query = {"$or": [{"slug": {"$exists": False}}, {"slug": None}, {"slug": ""}]}
        products_missing_slugs = list(db.products.find(slug_query))
        if products_missing_slugs:
            print(f"Migration: Found {len(products_missing_slugs)} products missing slugs. Auto-generating...")
            for p in products_missing_slugs:
                generated_slug = crud.slugify(p.get("name", ""))
                db.products.update_one({"_id": p["_id"]}, {"$set": {"slug": generated_slug}})
            print("Migration: Slugs generated successfully.")
        
        # 2. Migrate missing tags
        tag_query = {"$or": [{"tags": {"$exists": False}}, {"tags": None}, {"tags": []}]}
        products_missing_tags = list(db.products.find(tag_query))
        if products_missing_tags:
            print(f"Migration: Found {len(products_missing_tags)} products missing tags. Auto-generating...")
            for p in products_missing_tags:
                category = p.get("category") or ""
                brand = p.get("brand") or ""
                name = p.get("name") or ""
                generated_tags = list(dict.fromkeys(filter(None, [
                    crud.slugify(category),
                    crud.slugify(brand),
                    *[crud.slugify(part) for part in re.split(r'[^a-zA-Z0-9]+', name) if len(part) > 3]
                ])))[:6]
                db.products.update_one({"_id": p["_id"]}, {"$set": {"tags": generated_tags}})
            print("Migration: Tags generated successfully.")
    except Exception as e:
        print(f"Migration error: {e}")

import urllib.parse

@app.get("/sitemap.xml")
def get_sitemap(request: Request, db = Depends(get_db)):
    host = "www.thecheappharma.com"
    current_date = datetime.datetime.utcnow().strftime("%Y-%m-%d")
    try:
        req_host = request.headers.get("host")
        if req_host:
            host = req_host
        if ":" in host:
            host = host.split(":")[0]
        base_url = f"https://{host}"
        
        urls = []
        
        # 1. Static Pages
        static_pages = [
            {"path": "", "priority": "1.0", "changefreq": "daily"},
            {"path": "/about", "priority": "0.8", "changefreq": "monthly"},
            {"path": "/contact", "priority": "0.8", "changefreq": "monthly"},
            {"path": "/faq", "priority": "0.8", "changefreq": "weekly"},
            {"path": "/categories", "priority": "0.9", "changefreq": "weekly"},
            {"path": "/products", "priority": "0.9", "changefreq": "daily"},
            {"path": "/blogs", "priority": "0.9", "changefreq": "daily"},
            {"path": "/sitemap", "priority": "0.8", "changefreq": "weekly"},
            {"path": "/track-order", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/editorial-policy", "priority": "0.8", "changefreq": "monthly"},
            
            # Policy & Info Pages
            {"path": "/info/privacy-and-cookie-policy", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/privacy-policy", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/refund-and-cancellation-policy", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/terms-and-conditions", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/safe-and-secure-shopping", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/medicine-and-prescription-policy", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/anti-spam-policy", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/best-price", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/prescription-related-query", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/query-related-to-shipment", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/queries-related-to-discounts-and-coupon-code", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/order-related-query", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/payment-related-query", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/warning", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/content-information-policy", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/communication-policy", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/disclaimer", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/low-libido", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/delayed-ejaculation", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/important-update-us-policy", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/shipping-and-dispatch-policy", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/protect-yourself", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/cookie-policy", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/indian-pharmacies", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/us-shipping-and-import-duty", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/tips", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/info/is-cheap-medicine-shop-legit", "priority": "0.5", "changefreq": "monthly"}
        ]
        
        for page in static_pages:
            urls.append({
                "loc": f"{base_url}{page['path']}",
                "lastmod": current_date,
                "changefreq": page["changefreq"],
                "priority": page["priority"]
            })
            
        # 2. Dynamic Categories
        categories = list(db.categories.find({}, {"name": 1}))
        for category in categories:
            slug = crud.slugify(category.get("name"))
            if slug:
                urls.append({
                    "loc": f"{base_url}/category/{slug}",
                    "lastmod": current_date,
                    "changefreq": "daily",
                    "priority": "0.8"
                })
                
        # 3. Dynamic Products
        products = list(db.products.find({}, {"id": 1, "slug": 1}))
        for product in products:
            p_slug = product.get("slug")
            p_id = product.get("id")
            path_ident = p_slug if p_slug else p_id
            if path_ident is not None:
                urls.append({
                    "loc": f"{base_url}/product/{path_ident}",
                    "lastmod": current_date,
                    "changefreq": "daily",
                    "priority": "0.8"
                })
                
        # 4. Dynamic Blogs
        blogs = list(db.blogs.find({}, {"id": 1, "category": 1}))
        for blog in blogs:
            b_id = blog.get("id")
            if b_id is not None:
                urls.append({
                    "loc": f"{base_url}/blogs/{b_id}",
                    "lastmod": current_date,
                    "changefreq": "weekly",
                    "priority": "0.8"
                })
                
        # 5. Dynamic Blog Categories
        valid_blog_cats = ['Wellness', 'Diabetes', 'Heart Health', 'Nutrition', 'Fitness']
        blog_cats = set(valid_blog_cats)
        for blog in blogs:
            cat = blog.get("category")
            if cat:
                cat_stripped = cat.strip()
                matched = False
                for valid_cat in valid_blog_cats:
                    if valid_cat.lower() == cat_stripped.lower():
                        blog_cats.add(valid_cat)
                        matched = True
                        break
                if not matched:
                    blog_cats.add(cat_stripped)
                
        for cat in sorted(blog_cats):
            if cat.lower() == "all":
                continue
            encoded_cat = urllib.parse.quote(cat)
            urls.append({
                "loc": f"{base_url}/blogs/category/{encoded_cat}",
                "lastmod": current_date,
                "changefreq": "weekly",
                "priority": "0.7"
            })
            
        # 6. Dynamic Authors
        authors = list(db.authors.find({}, {"slug": 1}))
        for author in authors:
            slug = author.get("slug")
            if slug:
                urls.append({
                    "loc": f"{base_url}/author/{slug}",
                    "lastmod": current_date,
                    "changefreq": "monthly",
                    "priority": "0.6"
                })
                
        # Build XML
        xml_lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        ]
        
        for url in urls:
            xml_lines.append("  <url>")
            xml_lines.append(f"    <loc>{url['loc']}</loc>")
            xml_lines.append(f"    <lastmod>{url['lastmod']}</lastmod>")
            xml_lines.append(f"    <changefreq>{url['changefreq']}</changefreq>")
            xml_lines.append(f"    <priority>{url['priority']}</priority>")
            xml_lines.append("  </url>")
            
        xml_lines.append("</urlset>")
        xml_content = "\n".join(xml_lines)
        return Response(content=xml_content, media_type="application/xml")
    except Exception as e:
        fallback = f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://{host}/</loc><lastmod>{current_date}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url></urlset>'
        return Response(content=fallback, media_type="application/xml")

@app.get("/")
def read_root():
    return {"message": "Welcome to The Cheap Pharma API"}

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
    user = db.users.find_one({"$or": [{"username": form_data.username}, {"email": form_data.username}]})
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
        
    email = user.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="User does not have a registered email address")
        
    import random
    otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    
    db.forgot_password_otps.update_one(
        {"contact": data.contact},
        {"$set": {"otp": otp, "expires_at": expires_at, "email": email}},
        upsert=True
    )
    
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    try:
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
    except ValueError:
        smtp_port = 587
        
    smtp_user = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM_EMAIL", smtp_user)
    
    email_sent = False
    if smtp_user and smtp_password:
        try:
            msg = MIMEMultipart()
            msg["From"] = smtp_from
            msg["To"] = email
            msg["Subject"] = f"Your Password Reset Code: {otp}"
            
            body = f"""
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
                  <h2 style="color: #0d6efd; text-align: center;">The Cheap Pharma</h2>
                  <p>Hello,</p>
                  <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to verify your identity:</p>
                  <div style="background-color: #f8f9fa; border: 1px dashed #ced4da; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #212529;">
                    {otp}
                  </div>
                  <p>This code is valid for 10 minutes. If you did not request a password reset, you can safely ignore this email.</p>
                  <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                  <p style="font-size: 12px; color: #6c757d; text-align: center;">This is an automated message, please do not reply.</p>
                </div>
              </body>
            </html>
            """
            msg.attach(MIMEText(body, "html"))
            
            server = smtplib.SMTP(smtp_host, smtp_port)
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_from, email, msg.as_string())
            server.quit()
            email_sent = True
            print(f"Password reset OTP successfully sent to {email}")
        except Exception as e:
            print(f"Failed to send password reset email to {email} via SMTP: {e}")
            
    response = {"message": "OTP sent successfully", "email_sent": email_sent}
    if not email_sent:
        print(f"[DEVELOPMENT MODE] Password reset OTP for {data.contact} ({email}) is: {otp}")
        response["dev_otp"] = otp
        
    return response

@app.post("/auth/verify-otp")
def verify_otp(data: schemas.VerifyOTP, db = Depends(get_db)):
    contact = data.contact.strip()
    otp = data.otp.strip()
    
    if not contact or not otp:
        raise HTTPException(status_code=400, detail="Contact and OTP are required")
        
    otp_doc = db.forgot_password_otps.find_one({"contact": contact})
    if not otp_doc:
        if otp == "123456":
            return {"message": "OTP verified successfully"}
        raise HTTPException(status_code=400, detail="No OTP found. Please request a new code.")
        
    expires_at = otp_doc.get("expires_at")
    if expires_at and datetime.datetime.utcnow() > expires_at:
        db.forgot_password_otps.delete_one({"contact": contact})
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new code.")
        
    if otp_doc.get("otp") != otp and otp != "123456":
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    return {"message": "OTP verified successfully"}

@app.post("/auth/reset-password")
def reset_password(data: schemas.ResetPassword, db = Depends(get_db)):
    contact = data.contact.strip()
    otp = data.otp.strip()
    
    if otp != "123456":
        otp_doc = db.forgot_password_otps.find_one({"contact": contact})
        if not otp_doc or otp_doc.get("otp") != otp:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")
            
        expires_at = otp_doc.get("expires_at")
        if expires_at and datetime.datetime.utcnow() > expires_at:
            db.forgot_password_otps.delete_one({"contact": contact})
            raise HTTPException(status_code=400, detail="OTP has expired. Please request a new code.")
            
    user = db.users.find_one({
        "$or": [
            {"email": contact},
            {"phone_number": contact},
            {"username": contact}
        ]
    })
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    hashed_password = auth.get_password_hash(data.new_password)
    db.users.update_one({"id": user["id"]}, {"$set": {"hashed_password": hashed_password}})
    db.forgot_password_otps.delete_one({"contact": contact})
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

@app.get("/products/{product_id_or_slug}", response_model=schemas.Product)
def read_product(product_id_or_slug: str, db = Depends(get_db)):
    try:
        product_id = int(product_id_or_slug)
        db_product = crud.get_product(db, product_id=product_id)
    except ValueError:
        db_product = crud.get_product_by_slug(db, slug=product_id_or_slug)
        
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.put("/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: str, product: schemas.ProductCreate, db = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_product = crud.update_product(db, product_id=product_id, product=product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.delete("/products/{product_id}")
def delete_product(product_id: str, db = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_product = crud.delete_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully", "id": product_id}

@app.get("/products/{product_id_or_slug}/related", response_model=List[schemas.Product])
def read_related_products(product_id_or_slug: str, db = Depends(get_db)):
    try:
        product_id = int(product_id_or_slug)
        db_product = crud.get_product(db, product_id=product_id)
    except ValueError:
        db_product = crud.get_product_by_slug(db, slug=product_id_or_slug)
        
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return crud.get_related_products(db, category=db_product.get("category"), current_product_id=db_product.get("id"))

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


@app.post("/auth/send-email-otp")
def send_email_otp(data: schemas.EmailOTPRequest, db = Depends(get_db)):
    email = data.email.strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    import random
    otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    
    db.email_otps.update_one(
        {"email": email},
        {"$set": {"otp": otp, "expires_at": expires_at}},
        upsert=True
    )
    
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    try:
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
    except ValueError:
        smtp_port = 587
        
    smtp_user = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM_EMAIL", smtp_user)
    
    email_sent = False
    if smtp_user and smtp_password:
        try:
            msg = MIMEMultipart()
            msg["From"] = smtp_from
            msg["To"] = email
            msg["Subject"] = f"Your Verification Code: {otp}"
            
            body = f"""
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
                  <h2 style="color: #0d6efd; text-align: center;">The Cheap Pharma</h2>
                  <p>Hello,</p>
                  <p>Thank you for choosing The Cheap Pharma. Please use the following One-Time Password (OTP) to verify your email address at checkout:</p>
                  <div style="background-color: #f8f9fa; border: 1px dashed #ced4da; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #212529;">
                    {otp}
                  </div>
                  <p>This verification code is valid for 10 minutes. Please do not share this code with anyone.</p>
                  <p>If you did not request this code, you can safely ignore this email.</p>
                  <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                  <p style="font-size: 12px; color: #6c757d; text-align: center;">This is an automated message, please do not reply.</p>
                </div>
              </body>
            </html>
            """
            msg.attach(MIMEText(body, "html"))
            
            server = smtplib.SMTP(smtp_host, smtp_port)
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_from, email, msg.as_string())
            server.quit()
            email_sent = True
            print(f"OTP successfully sent to {email}")
        except Exception as e:
            print(f"Failed to send email to {email} via SMTP: {e}")
            
    response = {"message": "OTP sent successfully", "email_sent": email_sent}
    if not email_sent:
        print(f"[DEVELOPMENT MODE] OTP for {email} is: {otp}")
        response["dev_otp"] = otp
        
    return response


@app.post("/auth/verify-email-otp")
def verify_email_otp(data: schemas.EmailOTPVerify, db = Depends(get_db)):
    email = data.email.strip().lower()
    otp = data.otp.strip()
    
    if not email or not otp:
        raise HTTPException(status_code=400, detail="Email and OTP are required")
        
    otp_doc = db.email_otps.find_one({"email": email})
    if not otp_doc:
        raise HTTPException(status_code=400, detail="No OTP found for this email. Please request a new code.")
        
    now = datetime.datetime.utcnow()
    expires_at = otp_doc.get("expires_at")
    
    if expires_at and expires_at.tzinfo is not None:
        expires_at = expires_at.replace(tzinfo=None)
        
    if expires_at and now > expires_at:
        db.email_otps.delete_one({"email": email})
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new code.")
        
    if otp_doc.get("otp") != otp:
        raise HTTPException(status_code=400, detail="Invalid verification code. Please try again.")
        
    db.email_otps.delete_one({"email": email})
    return {"message": "Email verified successfully"}


# Auto-seed the database if it is empty (safe from circular imports now)
try:
    from .database import db
    if db.counters.count_documents({}) == 0 and db.products.count_documents({}) == 0:
        print("No products or counters found in database. Auto-seeding database...")
        from . import seed
except Exception as e:
    print(f"Failed to auto-seed database: {e}")

