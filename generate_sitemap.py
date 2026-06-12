#!/usr/bin/env python3
import os
import re
import sys
import urllib.parse
from datetime import datetime

# Define base URL
BASE_URL = "https://thecheappharma.com"

# Setup script directory and python paths to support loading env and backend modules if needed
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

# Try loading environment variables from .env
def load_env():
    env_path = os.path.join(SCRIPT_DIR, ".env")
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    if "=" in line:
                        key, val = line.split("=", 1)
                        val = val.strip().strip('"').strip("'")
                        os.environ[key] = val
        print("Loaded environment variables from .env")
    else:
        print(".env file not found. Relying on existing system env variables.")

load_env()

# Slugify function matching frontend logic:
# text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
def slugify(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = re.sub(r'(^-|-$)', '', text)
    return text

def get_fallback_data():
    print("Preparing fallback data for sitemap generation...")
    # Hardcoded values mirroring seed.py data
    categories = [
        {"name": "Diabetes"},
        {"name": "Men's Health"},
        {"name": "Eye Care"},
        {"name": "Asthma"},
        {"name": "Skin Care"},
        {"name": "Blood Pressure"},
        {"name": "Women's Health"},
        {"name": "Antibiotics"},
        {"name": "Ivermectin"},
        {"name": "Anti Worm"}
    ]
    
    # Products (ids 1 to 23 based on seed.py)
    products = [{"id": i} for i in range(1, 24)]
    
    # Blogs (ids 1 to 6)
    blogs = [
        {"id": 1, "category": "Wellness"},
        {"id": 2, "category": "Wellness"},
        {"id": 3, "category": "Wellness"},
        {"id": 4, "category": "Diabetes"},
        {"id": 5, "category": "Wellness"},
        {"id": 6, "category": "Wellness"}
    ]
    
    # Authors
    authors = [
        {"slug": "sarah-jenkins"},
        {"slug": "david-vance"},
        {"slug": "elena-rostova"}
    ]
    
    return {
        "categories": categories,
        "products": products,
        "blogs": blogs,
        "authors": authors
    }

def get_database_data():
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        print("MONGODB_URI is not set.")
        return get_fallback_data()

    try:
        from pymongo import MongoClient
        import certifi
        
        print("Connecting to MongoDB...")
        client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=3000, tlsCAFile=certifi.where())
        # Ping the admin database to verify connection
        client.admin.command('ping')
        
        db = client.get_database("medicare")
        print("Connected successfully to database. Fetching collections...")
        
        # Fetch categories
        categories = list(db.categories.find({}, {"name": 1}))
        if not categories:
            print("Categories collection is empty. Falling back to default list.")
            categories = get_fallback_data()["categories"]
            
        # Fetch products
        products = list(db.products.find({}, {"id": 1, "slug": 1}))
        if not products:
            print("Products collection is empty. Falling back to default list.")
            products = get_fallback_data()["products"]
            
        # Fetch blogs
        blogs = list(db.blogs.find({}, {"id": 1, "category": 1}))
        if not blogs:
            print("Blogs collection is empty. Falling back to default list.")
            blogs = get_fallback_data()["blogs"]
            
        # Fetch authors
        authors = list(db.authors.find({}, {"slug": 1}))
        if not authors:
            print("Authors collection is empty. Falling back to default list.")
            authors = get_fallback_data()["authors"]
            
        return {
            "categories": categories,
            "products": products,
            "blogs": blogs,
            "authors": authors
        }
    except Exception as e:
        print(f"Error connecting or fetching from MongoDB: {e}")
        return get_fallback_data()

def generate_sitemap():
    data = get_database_data()
    
    # Get current date in ISO format
    current_date = datetime.utcnow().strftime("%Y-%m-%d")
    
    urls = []
    
    # 1. Static Public Pages
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
        
        # Policy & Information Pages (The 29 pages)
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
            "loc": f"{BASE_URL}{page['path']}",
            "lastmod": current_date,
            "changefreq": page["changefreq"],
            "priority": page["priority"]
        })
        
    # 2. Dynamic Categories
    for category in data["categories"]:
        slug = slugify(category.get("name"))
        if slug:
            urls.append({
                "loc": f"{BASE_URL}/category/{slug}",
                "lastmod": current_date,
                "changefreq": "daily",
                "priority": "0.8"
            })
            
    # 3. Dynamic Products
    for product in data["products"]:
        p_slug = product.get("slug")
        p_id = product.get("id")
        path_ident = p_slug if p_slug else p_id
        if path_ident is not None:
            urls.append({
                "loc": f"{BASE_URL}/product/{path_ident}",
                "lastmod": current_date,
                "changefreq": "daily",
                "priority": "0.8"
            })
            
    # 4. Dynamic Blogs
    for blog in data["blogs"]:
        b_id = blog.get("id")
        if b_id is not None:
            urls.append({
                "loc": f"{BASE_URL}/blogs/{b_id}",
                "lastmod": current_date,
                "changefreq": "weekly",
                "priority": "0.8"
            })
            
    # 5. Dynamic Blog Categories (Unique blog categories matching the exact casing expected by the frontend)
    # The frontend only accepts case-sensitive matching for: 'Wellness', 'Diabetes', 'Heart Health', 'Nutrition', 'Fitness'
    valid_blog_cats = ['Wellness', 'Diabetes', 'Heart Health', 'Nutrition', 'Fitness']
    blog_cats = set(valid_blog_cats)
    for blog in data["blogs"]:
        cat = blog.get("category")
        if cat:
            cat_stripped = cat.strip()
            # Normalize casing if it matches one of the expected categories
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
            "loc": f"{BASE_URL}/blogs/category/{encoded_cat}",
            "lastmod": current_date,
            "changefreq": "weekly",
            "priority": "0.7"
        })
        
    # 6. Dynamic Authors
    for author in data["authors"]:
        slug = author.get("slug")
        if slug:
            urls.append({
                "loc": f"{BASE_URL}/author/{slug}",
                "lastmod": current_date,
                "changefreq": "monthly",
                "priority": "0.6"
            })
            
    # Build XML String
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
    
    # Ensure public folder exists
    public_dir = os.path.join(SCRIPT_DIR, "frontend", "public")
    os.makedirs(public_dir, exist_ok=True)
    
    sitemap_path = os.path.join(public_dir, "sitemap.xml")
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write(xml_content)
        
    print(f"Successfully generated sitemap with {len(urls)} entries at: {sitemap_path}")
    return sitemap_path

if __name__ == "__main__":
    generate_sitemap()
