"""
Migration script: Generate image_thumbnail for all existing products
that have a base64 image_url but no image_thumbnail yet.

Run from the project root:
  ./backend/venv/bin/python migrate_thumbnails.py
"""

import sys
import os
import base64
import io

sys.path.insert(0, os.path.dirname(__file__))

from PIL import Image as PILImage

def compress_to_thumbnail(base64_str, max_size=200, quality=45):
    """Compress a base64 image to a small thumbnail using Pillow."""
    try:
        # Strip the data URL prefix
        if ',' in base64_str:
            header, data = base64_str.split(',', 1)
        else:
            data = base64_str
            header = 'data:image/jpeg;base64'

        img_bytes = base64.b64decode(data)
        img = PILImage.open(io.BytesIO(img_bytes))

        # Convert to RGB (in case of RGBA/P mode)
        if img.mode in ('RGBA', 'P', 'LA'):
            bg = PILImage.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            bg.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
            img = bg
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        # Resize preserving aspect ratio
        img.thumbnail((max_size, max_size), PILImage.LANCZOS)

        # Compress to JPEG bytes
        output = io.BytesIO()
        img.save(output, format='JPEG', quality=quality, optimize=True)
        compressed_bytes = output.getvalue()

        thumbnail_b64 = base64.b64encode(compressed_bytes).decode('utf-8')
        return f'data:image/jpeg;base64,{thumbnail_b64}'
    except Exception as e:
        print(f"  ERROR compressing image: {e}")
        return None


def run_migration():
    from backend.database import db

    print("Starting thumbnail migration...")
    products = list(db.products.find(
        {"image_url": {"$regex": "^data:"}},
        {"_id": 1, "id": 1, "name": 1, "image_url": 1, "image_thumbnail": 1}
    ))
    
    print(f"Found {len(products)} products with base64 images.")
    
    updated = 0
    skipped = 0
    
    for product in products:
        product_id = product.get("id")
        name = product.get("name", "Unknown")
        
        # Skip if thumbnail already exists and is valid
        existing_thumb = product.get("image_thumbnail", "")
        if existing_thumb and existing_thumb.startswith("data:") and len(existing_thumb) > 100:
            print(f"  [SKIP] {name} (id={product_id}) - thumbnail already exists")
            skipped += 1
            continue
        
        image_url = product.get("image_url", "")
        if not image_url or not image_url.startswith("data:"):
            print(f"  [SKIP] {name} (id={product_id}) - no base64 image_url")
            skipped += 1
            continue
        
        original_size_kb = len(image_url) * 3 / 4 / 1024
        print(f"  Processing: {name} (id={product_id}) - original ~{original_size_kb:.1f} KB")
        
        thumbnail = compress_to_thumbnail(image_url, max_size=200, quality=45)
        if thumbnail:
            thumb_size_kb = len(thumbnail) * 3 / 4 / 1024
            print(f"    ✓ Thumbnail created: ~{thumb_size_kb:.1f} KB (was {original_size_kb:.1f} KB)")
            
            db.products.update_one(
                {"_id": product["_id"]},
                {"$set": {"image_thumbnail": thumbnail}}
            )
            updated += 1
        else:
            print(f"    ✗ Failed to create thumbnail")
            skipped += 1
    
    print(f"\nMigration complete: {updated} thumbnails created, {skipped} skipped.")


if __name__ == "__main__":
    run_migration()
