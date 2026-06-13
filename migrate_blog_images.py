"""
Migration script: Compress existing blog images to proper dimensions.
Resizes to 800x500 (landscape blog card ratio) and compresses to ~40-80KB.

Run from the project root:
  ./backend/venv/bin/python migrate_blog_images.py
"""

import sys
import os
import base64
import io

sys.path.insert(0, os.path.dirname(__file__))

from PIL import Image as PILImage


def compress_blog_image(base64_str, max_width=800, max_height=500, quality=65):
    """Compress a base64 image to proper blog card dimensions using Pillow."""
    try:
        if ',' in base64_str:
            header, data = base64_str.split(',', 1)
        else:
            data = base64_str

        img_bytes = base64.b64decode(data)
        img = PILImage.open(io.BytesIO(img_bytes))

        # Convert to RGB
        if img.mode in ('RGBA', 'P', 'LA'):
            bg = PILImage.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            if img.mode in ('RGBA', 'LA'):
                bg.paste(img, mask=img.split()[-1])
            else:
                bg.paste(img)
            img = bg
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        # Resize keeping aspect ratio within bounds
        img.thumbnail((max_width, max_height), PILImage.LANCZOS)

        output = io.BytesIO()
        img.save(output, format='JPEG', quality=quality, optimize=True)
        compressed_bytes = output.getvalue()

        result_b64 = base64.b64encode(compressed_bytes).decode('utf-8')
        return f'data:image/jpeg;base64,{result_b64}'
    except Exception as e:
        print(f"  ERROR: {e}")
        return None


def run_migration():
    from backend.database import db

    print("Starting blog image compression migration...")
    blogs = list(db.blogs.find(
        {"image": {"$regex": "^data:"}},
        {"_id": 1, "id": 1, "title": 1, "image": 1}
    ))

    print(f"Found {len(blogs)} blogs with base64 images.")

    updated = 0
    skipped = 0

    for blog in blogs:
        blog_id = blog.get("id")
        title = blog.get("title", "Unknown")[:50]
        image = blog.get("image", "")

        original_size_kb = len(image) * 3 / 4 / 1024
        print(f"  Processing: '{title}' (id={blog_id}) - ~{original_size_kb:.1f} KB")

        if original_size_kb < 30:
            print(f"    [SKIP] Already small enough ({original_size_kb:.1f} KB)")
            skipped += 1
            continue

        compressed = compress_blog_image(image, max_width=800, max_height=500, quality=65)
        if compressed:
            new_size_kb = len(compressed) * 3 / 4 / 1024
            print(f"    ✓ Compressed: {original_size_kb:.1f} KB → {new_size_kb:.1f} KB")
            db.blogs.update_one(
                {"_id": blog["_id"]},
                {"$set": {"image": compressed}}
            )
            updated += 1
        else:
            print(f"    ✗ Failed to compress")
            skipped += 1

    print(f"\nDone: {updated} blog images compressed, {skipped} skipped.")


if __name__ == "__main__":
    run_migration()
