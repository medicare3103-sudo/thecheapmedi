from . import schemas
from .database import get_next_id
import datetime

# Helper to strip MongoDB's non-serializable _id field
def _strip_id(doc):
    if doc is None:
        return None
    doc.pop("_id", None)
    return doc

def _strip_ids(docs):
    for doc in docs:
        doc.pop("_id", None)
    return docs

def get_product(db, product_id: int):
    return _strip_id(db.products.find_one({"id": product_id}))

def get_product_by_slug(db, slug: str):
    return _strip_id(db.products.find_one({"slug": slug}))

def get_products(
    db, 
    skip: int = 0, 
    limit: int = 100,
    search: str = None,
    category: str = None,
    brand: str = None,
    min_price: float = None,
    max_price: float = None,
    sort_by: str = None,
    list_only: bool = True
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
    
    if list_only:
        # Exclude large fields AND _id for fast list loading
        projection = {"_id": 0, "description": 0, "doctor_image_url": 0,
                      "doctor_advice": 0, "uses": 0, "dosage": 0,
                      "side_effects": 0, "faqs": 0}
        cursor = db.products.find(query, projection)
    else:
        cursor = db.products.find(query, {"_id": 0})
    
    if sort_fields:
        cursor = cursor.sort(sort_fields)
        
    raw_items = list(cursor.skip(skip).limit(limit))
    
    if list_only:
        # For list view: if image_url is a large base64 string, replace with a flag
        items = []
        for p in raw_items:
            img = p.get("image_url", "")
            if img and img.startswith("data:") and len(img) > 2000:
                p["image_url"] = "__has_image__"
            items.append(p)
    else:
        items = raw_items
    
    return {"items": items, "total": total}

def get_related_products(db, category: str, current_product_id: int, limit: int = 4):
    if not category:
        return []
    docs = list(db.products.find(
        {"category": category, "id": {"$ne": current_product_id}},
        {"_id": 0}
    ).limit(limit))
    return docs

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
    product_dict.pop("_id", None)  # Remove MongoDB-added _id
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
    product_dict.pop("_id", None)
    return product_dict

def delete_product(db, product_id):
    try:
        query_id = int(product_id)
    except (ValueError, TypeError):
        query_id = product_id

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
        existing.pop("_id", None)
    return existing

def get_category(db, category_id: int):
    return _strip_id(db.categories.find_one({"id": category_id}))

def get_categories(db, skip: int = 0, limit: int = 100):
    return _strip_ids(list(db.categories.find({}, {"_id": 0}).skip(skip).limit(limit)))

def create_category(db, category: schemas.CategoryCreate):
    category_dict = category.dict()
    category_dict["id"] = get_next_id("categories")
    db.categories.insert_one(category_dict)
    category_dict.pop("_id", None)
    return category_dict

def update_category(db, category_id: int, category: schemas.CategoryCreate):
    existing = db.categories.find_one({"id": category_id})
    if not existing:
        return None
    category_dict = category.dict()
    db.categories.update_one({"id": category_id}, {"$set": category_dict})
    category_dict["id"] = category_id
    category_dict.pop("_id", None)
    return category_dict

def delete_category(db, category_id: int):
    existing = db.categories.find_one({"id": category_id})
    if existing:
        db.categories.delete_one({"id": category_id})
        existing.pop("_id", None)
    return existing

def get_blogs(db, skip: int = 0, limit: int = 100):
    return _strip_ids(list(db.blogs.find({}, {"_id": 0}).skip(skip).limit(limit)))

def create_blog(db, blog: schemas.BlogCreate, author_id: int):
    blog_dict = blog.dict()
    blog_dict["id"] = get_next_id("blogs")
    blog_dict["author_id"] = author_id
    blog_dict["created_at"] = datetime.datetime.utcnow()
    db.blogs.insert_one(blog_dict)
    blog_dict.pop("_id", None)
    return blog_dict

def get_blog(db, blog_id: int):
    return _strip_id(db.blogs.find_one({"id": blog_id}))

def update_blog(db, blog_id: int, blog: schemas.BlogCreate):
    existing = db.blogs.find_one({"id": blog_id})
    if not existing:
        return None
    blog_dict = blog.dict()
    db.blogs.update_one({"id": blog_id}, {"$set": blog_dict})
    blog_dict["id"] = blog_id
    blog_dict["author_id"] = existing.get("author_id")
    blog_dict["created_at"] = existing.get("created_at")
    blog_dict.pop("_id", None)
    return blog_dict

def delete_blog(db, blog_id: int):
    existing = db.blogs.find_one({"id": blog_id})
    if existing:
        db.blogs.delete_one({"id": blog_id})
        existing.pop("_id", None)
    return existing

def get_orders(db, status: str = None, skip: int = 0, limit: int = 100):
    query = {}
    if status and status != "All":
        query["status"] = status
    return _strip_ids(list(db.orders.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit)))

def update_order_status(db, order_id: int, order_update: schemas.OrderUpdate):
    existing = db.orders.find_one({"id": order_id})
    if not existing:
        return None
    
    update_data = {
        "status": order_update.status,
        "estimated_delivery": order_update.estimated_delivery,
        "courier": order_update.courier,
        "tracking_number": order_update.tracking_number
    }
    db.orders.update_one({"id": order_id}, {"$set": update_data})
    for k, v in update_data.items():
        existing[k] = v
    existing.pop("_id", None)
    return existing

def create_order(db, order: schemas.OrderCreate):
    order_dict = order.dict()
    order_dict["id"] = get_next_id("orders")
    order_dict["created_at"] = datetime.datetime.utcnow()
    db.orders.insert_one(order_dict)
    order_dict.pop("_id", None)
    return order_dict

def get_all_users(db, skip: int = 0, limit: int = 100):
    return _strip_ids(list(db.users.find({}, {"_id": 0}).skip(skip).limit(limit)))

def get_user(db, user_id: int):
    return _strip_id(db.users.find_one({"id": user_id}))

def update_user_status(db, user_id: int, is_active: bool):
    existing = db.users.find_one({"id": user_id})
    if not existing:
        return None
    db.users.update_one({"id": user_id}, {"$set": {"is_active": is_active}})
    existing["is_active"] = is_active
    existing.pop("_id", None)
    return existing

def get_coupon(db, coupon_id: int):
    return _strip_id(db.coupons.find_one({"id": coupon_id}))

def get_coupons(db, skip: int = 0, limit: int = 100):
    return _strip_ids(list(db.coupons.find({}, {"_id": 0}).skip(skip).limit(limit)))

def create_coupon(db, coupon: schemas.CouponCreate):
    coupon_dict = coupon.dict()
    coupon_dict["id"] = get_next_id("coupons")
    db.coupons.insert_one(coupon_dict)
    coupon_dict.pop("_id", None)
    return coupon_dict

def update_coupon(db, coupon_id: int, coupon: schemas.CouponCreate):
    existing = db.coupons.find_one({"id": coupon_id})
    if not existing:
        return None
    coupon_dict = coupon.dict()
    db.coupons.update_one({"id": coupon_id}, {"$set": coupon_dict})
    coupon_dict["id"] = coupon_id
    coupon_dict.pop("_id", None)
    return coupon_dict

def delete_coupon(db, coupon_id: int):
    existing = db.coupons.find_one({"id": coupon_id})
    if existing:
        db.coupons.delete_one({"id": coupon_id})
        existing.pop("_id", None)
    return existing

def get_admin_analytics(db):
    products_count = db.products.count_documents({})
    customers_count = db.users.count_documents({})
    
    today = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    todays_orders = db.orders.count_documents({"created_at": {"$gte": today}})
    
    pipeline = [{"$group": {"_id": None, "total": {"$sum": "$total_price"}}}]
    result = list(db.orders.aggregate(pipeline))
    revenue = result[0]["total"] if result else 0.0
    
    low_stock_count = db.products.count_documents({"stock": {"$lt": 10}})
    
    day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    daily_sales = []
    for i in range(6, -1, -1):
        day_start = today - datetime.timedelta(days=i)
        day_end = day_start + datetime.timedelta(days=1)
        day_orders = list(db.orders.find({"created_at": {"$gte": day_start, "$lt": day_end}}, {"_id": 0}))
        total_sales = sum(o.get("total_price", 0.0) for o in day_orders)
        daily_sales.append({"day": day_names[day_start.weekday()], "sales": round(total_sales, 2)})
        
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
        month_end = datetime.datetime(y + 1, 1, 1) if m == 12 else datetime.datetime(y, m + 1, 1)
        month_orders = list(db.orders.find({"created_at": {"$gte": month_start, "$lt": month_end}}, {"_id": 0}))
        total_sales = sum(o.get("total_price", 0.0) for o in month_orders)
        monthly_sales.append({"month": month_names[m - 1], "sales": round(total_sales, 2)})
        
    revenue_trend = []
    for i in range(3, -1, -1):
        week_start = today - datetime.timedelta(days=(i+1)*7)
        week_end = today - datetime.timedelta(days=i*7)
        week_orders = list(db.orders.find({"created_at": {"$gte": week_start, "$lt": week_end}}, {"_id": 0}))
        total_revenue = sum(o.get("total_price", 0.0) for o in week_orders)
        revenue_trend.append({"name": f"Week {4-i}", "revenue": round(total_revenue, 2)})
        
    pending_orders = list(db.orders.find({"status": {"$in": ["Pending", "Processing"]}}, {"_id": 0}))
    pending_prescriptions = 0
    for order in pending_orders:
        has_rx_item = False
        for item in order.get("items", []):
            if item.get("rx_required"):
                has_rx_item = True
                break
            prod_name = item.get("name")
            if prod_name:
                prod = db.products.find_one({"name": prod_name}, {"_id": 0})
                if prod and prod.get("rx_required"):
                    has_rx_item = True
                    break
        if has_rx_item:
            pending_prescriptions += 1
            
    product_sales = {}
    for order in db.orders.find({}, {"_id": 0}):
        for item in order.get("items", []):
            name = item.get("name", "Product")
            qty = item.get("quantity", 0)
            product_sales[name] = product_sales.get(name, 0) + qty
            
    sorted_sales = sorted(product_sales.items(), key=lambda x: x[1], reverse=True)[:4]
    top_products = [{"name": name, "value": qty} for name, qty in sorted_sales]
        
    if not top_products:
        db_products = list(db.products.find({}, {"_id": 0}).limit(4))
        for p in db_products:
            top_products.append({"name": p.get("name", "Product"), "value": 0})
            
    return {
        "metrics": {
            "todays_orders": todays_orders,
            "revenue": round(revenue, 2),
            "products_count": products_count,
            "customers_count": customers_count,
            "pending_prescriptions": pending_prescriptions,
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
    return _strip_id(db.authors.find_one({"slug": slug}))

def get_authors(db):
    return _strip_ids(list(db.authors.find({}, {"_id": 0})))

def create_author(db, author: schemas.AuthorCreate):
    author_dict = author.dict()
    author_dict["id"] = get_next_id("authors")
    db.authors.insert_one(author_dict)
    author_dict.pop("_id", None)
    return author_dict

def update_author(db, slug: str, author: schemas.AuthorCreate):
    existing = db.authors.find_one({"slug": slug})
    if not existing:
        return None
    author_dict = author.dict()
    db.authors.update_one({"slug": slug}, {"$set": author_dict})
    author_dict["id"] = existing["id"]
    author_dict.pop("_id", None)
    return author_dict

def delete_author(db, slug: str):
    existing = db.authors.find_one({"slug": slug})
    if existing:
        db.authors.delete_one({"slug": slug})
        existing.pop("_id", None)
    return existing
