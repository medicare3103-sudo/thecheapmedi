from sqlalchemy.orm import Session
from . import models, schemas

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    search: str = None,
    category: str = None,
    brand: str = None,
    min_price: float = None,
    max_price: float = None,
    sort_by: str = None
):
    query = db.query(models.Product)
    
    if search:
        query = query.filter(models.Product.name.ilike(f"%{search}%"))
    if category:
        query = query.filter(models.Product.category == category)
    if brand:
        query = query.filter(models.Product.brand == brand)
    if min_price is not None:
        query = query.filter(models.Product.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Product.price <= max_price)
        
    if sort_by == "price_asc":
        query = query.order_by(models.Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(models.Product.price.desc())
    elif sort_by == "name_asc":
        query = query.order_by(models.Product.name.asc())
    elif sort_by == "name_desc":
        query = query.order_by(models.Product.name.desc())
        
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    
    return {"items": items, "total": total}

def get_related_products(db: Session, category: str, current_product_id: int, limit: int = 4):
    if not category:
        return []
    return db.query(models.Product).filter(
        models.Product.category == category,
        models.Product.id != current_product_id
    ).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: schemas.ProductCreate):
    db_product = get_product(db, product_id)
    if db_product:
        for key, value in product.dict().items():
            setattr(db_product, key, value)
        db.commit()
        db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if db_product:
        db.delete(db_product)
        db.commit()
    return db_product

def get_category(db: Session, category_id: int):
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).offset(skip).limit(limit).all()

def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(db: Session, category_id: int, category: schemas.CategoryCreate):
    db_category = get_category(db, category_id)
    if db_category:
        for key, value in category.dict().items():
            setattr(db_category, key, value)
        db.commit()
        db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: int):
    db_category = get_category(db, category_id)
    if db_category:
        db.delete(db_category)
        db.commit()
    return db_category

def get_blogs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Blog).offset(skip).limit(limit).all()

def get_blogs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Blog).offset(skip).limit(limit).all()

def create_blog(db: Session, blog: schemas.BlogCreate, author_id: int):
    db_blog = models.Blog(**blog.dict(), author_id=author_id)
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog

def get_orders(db: Session, status: str = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Order)
    if status and status != "All":
        query = query.filter(models.Order.status == status)
    return query.order_by(models.Order.created_at.desc()).offset(skip).limit(limit).all()

def update_order_status(db: Session, order_id: int, new_status: str):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order:
        db_order.status = new_status
        db.commit()
        db.refresh(db_order)
    return db_order

def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def update_user_status(db: Session, user_id: int, is_active: bool):
    db_user = get_user(db, user_id)
    if db_user:
        db_user.is_active = is_active
        db.commit()
        db.refresh(db_user)
    return db_user

def get_coupon(db: Session, coupon_id: int):
    return db.query(models.Coupon).filter(models.Coupon.id == coupon_id).first()

def get_coupons(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Coupon).offset(skip).limit(limit).all()

def create_coupon(db: Session, coupon: schemas.CouponCreate):
    db_coupon = models.Coupon(**coupon.dict())
    db.add(db_coupon)
    db.commit()
    db.refresh(db_coupon)
    return db_coupon

def update_coupon(db: Session, coupon_id: int, coupon: schemas.CouponCreate):
    db_coupon = get_coupon(db, coupon_id)
    if db_coupon:
        for key, value in coupon.dict().items():
            setattr(db_coupon, key, value)
        db.commit()
        db.refresh(db_coupon)
    return db_coupon

def delete_coupon(db: Session, coupon_id: int):
    db_coupon = get_coupon(db, coupon_id)
    if db_coupon:
        db.delete(db_coupon)
        db.commit()
    return db_coupon

def get_admin_analytics(db: Session):
    from sqlalchemy.sql import func
    
    # Base counts
    products_count = db.query(models.Product).count()
    customers_count = db.query(models.User).count()
    todays_orders = db.query(models.Order).count() # Simplified for mock
    
    # Revenue (sum of all order totals)
    total_revenue_result = db.query(func.sum(models.Order.total_price)).scalar()
    revenue = total_revenue_result if total_revenue_result else 0.0
    
    # Low stock
    low_stock_count = db.query(models.Product).filter(models.Product.stock < 10).count()
    
    return {
        "metrics": {
            "todays_orders": todays_orders,
            "revenue": revenue,
            "products_count": products_count,
            "customers_count": customers_count,
            "pending_prescriptions": 12, # Mocked metric
            "low_stock_count": low_stock_count
        },
        "charts": {
            "daily_sales": [
                {"day": "Mon", "sales": 120},
                {"day": "Tue", "sales": 150},
                {"day": "Wed", "sales": 110},
                {"day": "Thu", "sales": 180},
                {"day": "Fri", "sales": 250},
                {"day": "Sat", "sales": 320},
                {"day": "Sun", "sales": 290}
            ],
            "monthly_sales": [
                {"month": "Jan", "sales": 4000},
                {"month": "Feb", "sales": 3000},
                {"month": "Mar", "sales": 5000},
                {"month": "Apr", "sales": 4500},
                {"month": "May", "sales": 6000},
                {"month": "Jun", "sales": 8000}
            ],
            "top_products": [
                {"name": "Vitamin C", "value": 400},
                {"name": "Paracetamol", "value": 300},
                {"name": "Ibuprofen", "value": 300},
                {"name": "Band-Aids", "value": 200}
            ],
            "revenue_trend": [
                {"name": "Week 1", "revenue": 1200},
                {"name": "Week 2", "revenue": 1900},
                {"name": "Week 3", "revenue": 1500},
                {"name": "Week 4", "revenue": 2100}
            ]
        }
    }
