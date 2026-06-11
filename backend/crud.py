from . import schemas
from .database import get_next_id
import datetime

def get_product(db, product_id: int):
    return db.products.find_one({"id": product_id})

def get_product_by_slug(db, slug: str):
    return db.products.find_one({"slug": slug})

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

import re

def slugify(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = re.sub(r'(^-|-$)', '', text)
    return text

def create_product(db, product: schemas.ProductCreate):
    product_dict = product.dict()
    if product_dict.get("pack_sizes"):
        product_dict["pack_sizes"] = [ps.dict() if hasattr(ps, "dict") else ps for ps in product_dict["pack_sizes"]]
    if product_dict.get("faqs"):
        product_dict["faqs"] = [faq.dict() if hasattr(faq, "dict") else faq for faq in product_dict["faqs"]]
    if not product_dict.get("slug"):
        product_dict["slug"] = slugify(product_dict.get("name", ""))
    product_dict["id"] = get_next_id("products")
    db.products.insert_one(product_dict)
    return product_dict

def update_product(db, product_id, product: schemas.ProductCreate):
    try:
        query_id = int(product_id)
    except (ValueError, TypeError):
        query_id = product_id

    existing = db.products.find_one({"id": query_id})
    if not existing:
        return None
    product_dict = product.dict()
    if product_dict.get("pack_sizes"):
        product_dict["pack_sizes"] = [ps.dict() if hasattr(ps, "dict") else ps for ps in product_dict["pack_sizes"]]
    if product_dict.get("faqs"):
        product_dict["faqs"] = [faq.dict() if hasattr(faq, "dict") else faq for faq in product_dict["faqs"]]
    if not product_dict.get("slug"):
        product_dict["slug"] = slugify(product_dict.get("name", ""))
    db.products.update_one({"id": query_id}, {"$set": product_dict})
    product_dict["id"] = query_id
    return product_dict

def delete_product(db, product_id):
    try:
        query_id = int(product_id)
    except (ValueError, TypeError):
        query_id = product_id

    # Try to find by integer/string id, slug, or MongoDB ObjectId
    query = {"$or": [{"id": query_id}, {"slug": str(product_id)}]}
    
    from bson.objectid import ObjectId
    try:
        if isinstance(product_id, str) and ObjectId.is_valid(product_id):
            query["$or"].append({"_id": ObjectId(product_id)})
    except Exception:
        pass

    existing = db.products.find_one(query)
    if existing:
        db.products.delete_one({"_id": existing["_id"]})
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

def get_blog(db, blog_id: int):
    return db.blogs.find_one({"id": blog_id})

def update_blog(db, blog_id: int, blog: schemas.BlogCreate):
    existing = db.blogs.find_one({"id": blog_id})
    if not existing:
        return None
    blog_dict = blog.dict()
    db.blogs.update_one({"id": blog_id}, {"$set": blog_dict})
    blog_dict["id"] = blog_id
    blog_dict["author_id"] = existing.get("author_id")
    blog_dict["created_at"] = existing.get("created_at")
    return blog_dict

def delete_blog(db, blog_id: int):
    existing = db.blogs.find_one({"id": blog_id})
    if existing:
        db.blogs.delete_one({"id": blog_id})
    return existing

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

def create_order(db, order: schemas.OrderCreate):
    order_dict = order.dict()
    order_dict["id"] = get_next_id("orders")
    order_dict["created_at"] = datetime.datetime.utcnow()
    db.orders.insert_one(order_dict)
    return order_dict

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
    
    # Calculate today's orders count dynamically based on the current UTC date
    today = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    todays_orders = db.orders.count_documents({"created_at": {"$gte": today}})
    
    # Revenue (sum of all order totals)
    pipeline = [{"$group": {"_id": None, "total": {"$sum": "$total_price"}}}]
    result = list(db.orders.aggregate(pipeline))
    revenue = result[0]["total"] if result else 0.0
    
    low_stock_count = db.products.count_documents({"stock": {"$lt": 10}})
    
    # Calculate daily sales for the last 7 days
    day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    daily_sales = []
    for i in range(6, -1, -1):
        day_start = today - datetime.timedelta(days=i)
        day_end = day_start + datetime.timedelta(days=1)
        day_orders = list(db.orders.find({"created_at": {"$gte": day_start, "$lt": day_end}}))
        total_sales = sum(o.get("total_price", 0.0) for o in day_orders)
        daily_sales.append({
            "day": day_names[day_start.weekday()],
            "sales": round(total_sales, 2)
        })
        
    # Calculate monthly sales for the last 6 months
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    monthly_sales = []
    current_year = today.year
    current_month = today.month
    for i in range(5, -1, -1):
        m = current_month - i
        y = current_year
        if m <= 0:
            m += 12
            y -= 1
        month_start = datetime.datetime(y, m, 1)
        if m == 12:
            month_end = datetime.datetime(y + 1, 1, 1)
        else:
            month_end = datetime.datetime(y, m + 1, 1)
        month_orders = list(db.orders.find({"created_at": {"$gte": month_start, "$lt": month_end}}))
        total_sales = sum(o.get("total_price", 0.0) for o in month_orders)
        monthly_sales.append({
            "month": month_names[m - 1],
            "sales": round(total_sales, 2)
        })
        
    # Calculate revenue trend for the last 4 weeks
    revenue_trend = []
    for i in range(3, -1, -1):
        week_start = today - datetime.timedelta(days=(i+1)*7)
        week_end = today - datetime.timedelta(days=i*7)
        week_orders = list(db.orders.find({"created_at": {"$gte": week_start, "$lt": week_end}}))
        total_revenue = sum(o.get("total_price", 0.0) for o in week_orders)
        revenue_trend.append({
            "name": f"Week {4-i}",
            "revenue": round(total_revenue, 2)
        })
        
    # Dynamically query products to populate top products
    db_products = list(db.products.find().limit(4))
    top_products = []
    if not db_products:
        top_products = [
            {"name": "Vitamin C", "value": 400},
            {"name": "Paracetamol", "value": 300},
            {"name": "Ibuprofen", "value": 300},
            {"name": "Band-Aids", "value": 200}
        ]
    else:
        values = [400, 300, 250, 150]
        for idx, p in enumerate(db_products):
            val = values[idx] if idx < len(values) else 100
            top_products.append({
                "name": p.get("name", "Product"),
                "value": val
            })
            
    return {
        "metrics": {
            "todays_orders": todays_orders,
            "revenue": round(revenue, 2),
            "products_count": products_count,
            "customers_count": customers_count,
            "pending_prescriptions": 12,
            "low_stock_count": low_stock_count
        },
        "charts": {
            "daily_sales": daily_sales,
            "monthly_sales": monthly_sales,
            "top_products": top_products,
            "revenue_trend": revenue_trend
        }
    }

def get_author(db, slug: str):
    return db.authors.find_one({"slug": slug})

def get_authors(db):
    return list(db.authors.find())

def create_author(db, author: schemas.AuthorCreate):
    author_dict = author.dict()
    author_dict["id"] = get_next_id("authors")
    db.authors.insert_one(author_dict)
    return author_dict

def update_author(db, slug: str, author: schemas.AuthorCreate):
    existing = db.authors.find_one({"slug": slug})
    if not existing:
        return None
    author_dict = author.dict()
    db.authors.update_one({"slug": slug}, {"$set": author_dict})
    author_dict["id"] = existing["id"]
    return author_dict

def delete_author(db, slug: str):
    existing = db.authors.find_one({"slug": slug})
    if existing:
        db.authors.delete_one({"slug": slug})
    return existing
