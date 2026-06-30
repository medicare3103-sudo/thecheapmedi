"""
Migration script: Convert all existing base64-encoded images in MongoDB
(products, blogs, and authors) to WebP format.

Run from the project root:
  ./backend/venv/bin/python migrate_webp.py
"""

import sys
import os
import base64
import io

sys.path.insert(0, os.path.dirname(__file__))

try:
    from PIL import Image as PILImage
except ImportError:
    print("Pillow is required for this script. Installing Pillow...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image as PILImage


def convert_to_webp(base64_str, quality=80):
    """Convert a base64 image (PNG, JPEG, etc.) to base64 WebP format."""
    if not base64_str or not isinstance(base64_str, str):
        return None
        
    if not base64_str.startswith('data:'):
        return None

    try:
        # Split header and data
        if ',' in base64_str:
            header, data = base64_str.split(',', 1)
        else:
            data = base64_str
            header = 'data:image/jpeg;base64'

        # Skip if it is already WebP
        if 'image/webp' in header:
            return None

        img_bytes = base64.b64decode(data)
        img = PILImage.open(io.BytesIO(img_bytes))

        # Convert modes to preserve transparency if applicable
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            img = img.convert('RGBA')
        else:
            img = img.convert('RGB')

        output = io.BytesIO()
        img.save(output, format='WEBP', quality=quality)
        compressed_bytes = output.getvalue()

        result_b64 = base64.b64encode(compressed_bytes).decode('utf-8')
        return f'data:image/webp;base64,{result_b64}'
    except Exception as e:
        print(f"  ERROR converting image: {e}")
        return None


def run_migration():
    from backend.database import db

    print("==================================================")
    print("Starting WebP Image Format Migration...")
    print("==================================================")

    # 1. Migrate Products
    print("\n--- Processing Products Collection ---")
    products = list(db.products.find(
        {"$or": [
            {"image_url": {"$regex": "^data:image/(?!webp)"}},
            {"image_thumbnail": {"$regex": "^data:image/(?!webp)"}}
        ]},
        {"_id": 1, "id": 1, "name": 1, "image_url": 1, "image_thumbnail": 1}
    ))
    print(f"Found {len(products)} products needing WebP conversion.")
    
    prod_updated = 0
    for prod in products:
        name = prod.get("name", "Unknown Product")
        prod_id = prod.get("id")
        update_doc = {}

        # Convert image_url
        img_url = prod.get("image_url")
        if img_url and img_url.startswith("data:") and "image/webp" not in img_url:
            old_size = len(img_url) * 3 / 4 / 1024
            new_img = convert_to_webp(img_url)
            if new_img:
                new_size = len(new_img) * 3 / 4 / 1024
                print(f"  [Product {prod_id}] converted main image: {old_size:.1f} KB -> {new_size:.1f} KB")
                update_doc["image_url"] = new_img

        # Convert image_thumbnail
        thumb_url = prod.get("image_thumbnail")
        if thumb_url and thumb_url.startswith("data:") and "image/webp" not in thumb_url:
            old_size = len(thumb_url) * 3 / 4 / 1024
            new_thumb = convert_to_webp(thumb_url)
            if new_thumb:
                new_size = len(new_thumb) * 3 / 4 / 1024
                print(f"  [Product {prod_id}] converted thumbnail: {old_size:.1f} KB -> {new_size:.1f} KB")
                update_doc["image_thumbnail"] = new_thumb

        if update_doc:
            db.products.update_one({"_id": prod["_id"]}, {"$set": update_doc})
            prod_updated += 1

    print(f"Successfully converted {prod_updated} products to WebP.")

    # 2. Migrate Blogs
    print("\n--- Processing Blogs Collection ---")
    blogs = list(db.blogs.find(
        {"image": {"$regex": "^data:image/(?!webp)"}},
        {"_id": 1, "id": 1, "title": 1, "image": 1}
    ))
    print(f"Found {len(blogs)} blogs needing WebP conversion.")
    
    blogs_updated = 0
    for blog in blogs:
        title = blog.get("title", "Unknown Blog")[:40]
        blog_id = blog.get("id")
        img_url = blog.get("image")
        
        if img_url and img_url.startswith("data:"):
            old_size = len(img_url) * 3 / 4 / 1024
            new_img = convert_to_webp(img_url)
            if new_img:
                new_size = len(new_img) * 3 / 4 / 1024
                print(f"  [Blog {blog_id}] '{title}' image converted: {old_size:.1f} KB -> {new_size:.1f} KB")
                db.blogs.update_one({"_id": blog["_id"]}, {"$set": {"image": new_img}})
                blogs_updated += 1

    print(f"Successfully converted {blogs_updated} blogs to WebP.")

    # 3. Migrate Authors
    print("\n--- Processing Authors Collection ---")
    authors = list(db.authors.find(
        {"image": {"$regex": "^data:image/(?!webp)"}},
        {"_id": 1, "slug": 1, "name": 1, "image": 1}
    ))
    print(f"Found {len(authors)} authors needing WebP conversion.")
    
    authors_updated = 0
    for author in authors:
        name = author.get("name", "Unknown Author")
        slug = author.get("slug")
        img_url = author.get("image")
        
        if img_url and img_url.startswith("data:"):
            old_size = len(img_url) * 3 / 4 / 1024
            new_img = convert_to_webp(img_url)
            if new_img:
                new_size = len(new_img) * 3 / 4 / 1024
                print(f"  [Author {slug}] '{name}' image converted: {old_size:.1f} KB -> {new_size:.1f} KB")
                db.authors.update_one({"_id": author["_id"]}, {"$set": {"image": new_img}})
                authors_updated += 1

    print(f"Successfully converted {authors_updated} authors to WebP.")

    print("\n==================================================")
    print("Migration Complete!")
    print("==================================================")


if __name__ == "__main__":
    run_migration()
