from . import schemas
from .database import get_next_id
import datetime

def get_product(db, product_id: int):
    return db.products.find_one({"id": product_id})

def get_products(
    db, 
    skip: int = 0, 
    limit: int = 100,
    search: str = None,
    category: str = None,
    brand: str = None,
    min_price: float = None,
    max_price: float = None,
    sort_by: str = None
):
    query = {}
    
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    if category:
        query["category"] = category
    if brand:
        query["brand"] = brand
    
    price_filter = {}
    if min_price is not None:
        price_filter["$gte"] = min_price
    if max_price is not None:
        price_filter["$lte"] = max_price
    if price_filter:
        query["price"] = price_filter
        
    sort_fields = []
    if sort_by == "price_asc":
        sort_fields.append(("price", 1))
    elif sort_by == "price_desc":
        sort_fields.append(("price", -1))
    elif sort_by == "name_asc":
        sort_fields.append(("name", 1))
    elif sort_by == "name_desc":
        sort_fields.append(("name", -1))
        
    total = db.products.count_documents(query)
    cursor = db.products.find(query)
    if sort_fields:
        cursor = cursor.sort(sort_fields)
        
    items = list(cursor.skip(skip).limit(limit))
    return {"items": items, "total": total}

def get_related_products(db, category: str, current_product_id: int, limit: int = 4):
    if not category:
        return []
    return list(db.products.find({
        "category": category,
        "id": {"$ne": current_product_id}
    }).limit(limit))

def create_product(db, product: schemas.ProductCreate):
    product_dict = product.dict()
    if product_dict.get("pack_sizes"):
        product_dict["pack_sizes"] = [ps.dict() if hasattr(ps, "dict") else ps for ps in product_dict["pack_sizes"]]
    product_dict["id"] = get_next_id("products")
    db.products.insert_one(product_dict)
    return product_dict

def update_product(db, product_id: int, product: schemas.ProductCreate):
    existing = db.products.find_one({"id": product_id})
    if not existing:
        return None
    product_dict = product.dict()
    if product_dict.get("pack_sizes"):
        product_dict["pack_sizes"] = [ps.dict() if hasattr(ps, "dict") else ps for ps in product_dict["pack_sizes"]]
    db.products.update_one({"id": product_id}, {"$set": product_dict})
    product_dict["id"] = product_id
    return product_dict

def delete_product(db, product_id: int):
    existing = db.products.find_one({"id": product_id})
    if existing:
        db.products.delete_one({"id": product_id})
    return existing

def get_category(db, category_id: int):
    return db.categories.find_one({"id": category_id})

def get_categories(db, skip: int = 0, limit: int = 100):
    return list(db.categories.find().skip(skip).limit(limit))

def create_category(db, category: schemas.CategoryCreate):
    category_dict = category.dict()
    category_dict["id"] = get_next_id("categories")
    db.categories.insert_one(category_dict)
    return category_dict

def update_category(db, category_id: int, category: schemas.CategoryCreate):
    existing = db.categories.find_one({"id": category_id})
    if not existing:
        return None
    category_dict = category.dict()
    db.categories.update_one({"id": category_id}, {"$set": category_dict})
    category_dict["id"] = category_id
    return category_dict

def delete_category(db, category_id: int):
    existing = db.categories.find_one({"id": category_id})
    if existing:
        db.categories.delete_one({"id": category_id})
    return existing

def get_blogs(db, skip: int = 0, limit: int = 100):
    return list(db.blogs.find().skip(skip).limit(limit))

def create_blog(db, blog: schemas.BlogCreate, author_id: int):
    blog_dict = blog.dict()
    blog_dict["id"] = get_next_id("blogs")
    blog_dict["author_id"] = author_id
    blog_dict["created_at"] = datetime.datetime.utcnow()
    db.blogs.insert_one(blog_dict)
    return blog_dict

def get_orders(db, status: str = None, skip: int = 0, limit: int = 100):
    query = {}
    if status and status != "All":
        query["status"] = status
    return list(db.orders.find(query).sort("created_at", -1).skip(skip).limit(limit))

def update_order_status(db, order_id: int, new_status: str):
    existing = db.orders.find_one({"id": order_id})
    if not existing:
        return None
    db.orders.update_one({"id": order_id}, {"$set": {"status": new_status}})
    existing["status"] = new_status
    return existing

def get_all_users(db, skip: int = 0, limit: int = 100):
    return list(db.users.find().skip(skip).limit(limit))

def get_user(db, user_id: int):
    return db.users.find_one({"id": user_id})

def update_user_status(db, user_id: int, is_active: bool):
    existing = db.users.find_one({"id": user_id})
    if not existing:
        return None
    db.users.update_one({"id": user_id}, {"$set": {"is_active": is_active}})
    existing["is_active"] = is_active
    return existing

def get_coupon(db, coupon_id: int):
    return db.coupons.find_one({"id": coupon_id})

def get_coupons(db, skip: int = 0, limit: int = 100):
    return list(db.coupons.find().skip(skip).limit(limit))

def create_coupon(db, coupon: schemas.CouponCreate):
    coupon_dict = coupon.dict()
    coupon_dict["id"] = get_next_id("coupons")
    db.coupons.insert_one(coupon_dict)
    return coupon_dict

def update_coupon(db, coupon_id: int, coupon: schemas.CouponCreate):
    existing = db.coupons.find_one({"id": coupon_id})
    if not existing:
        return None
    coupon_dict = coupon.dict()
    db.coupons.update_one({"id": coupon_id}, {"$set": coupon_dict})
    coupon_dict["id"] = coupon_id
    return coupon_dict

def delete_coupon(db, coupon_id: int):
    existing = db.coupons.find_one({"id": coupon_id})
    if existing:
        db.coupons.delete_one({"id": coupon_id})
    return existing

def get_admin_analytics(db):
    products_count = db.products.count_documents({})
    customers_count = db.users.count_documents({})
    todays_orders = db.orders.count_documents({})
    
    # Revenue (sum of all order totals)
    pipeline = [{"$group": {"_id": None, "total": {"$sum": "$total_price"}}}]
    result = list(db.orders.aggregate(pipeline))
    revenue = result[0]["total"] if result else 0.0
    
    low_stock_count = db.products.count_documents({"stock": {"$lt": 10}})
    
    return {
        "metrics": {
            "todays_orders": todays_orders,
            "revenue": revenue,
            "products_count": products_count,
            "customers_count": customers_count,
            "pending_prescriptions": 12,
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
