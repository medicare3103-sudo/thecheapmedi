import os
from database import db, get_next_id

navbar_categories = [
    {
        "name": "Men's Health",
        "subcategories": ["Erectile Dysfunction", "Generic Levitra (vardenafil)", "Spedra (avanafil)", "Premature Ejaculation", "Sexual Wellness", "Female Generic Viagra"],
        "show_in_navbar": True
    },
    {
        "name": "Respiratory",
        "subcategories": ["Asthma", "COPD", "Inhalers"],
        "show_in_navbar": True
    },
    {
        "name": "Skin Care",
        "subcategories": ["Acne", "Wrinkle Cream", "Eyebrow Growth"],
        "show_in_navbar": True
    },
    {
        "name": "Ivermectin",
        "subcategories": [],
        "show_in_navbar": True
    },
    {
        "name": "Anti Worm",
        "subcategories": [],
        "show_in_navbar": True
    },
    {
        "name": "Herbal",
        "subcategories": [],
        "show_in_navbar": True
    },
    {
        "name": "Women's Health",
        "subcategories": ["Female Viagra", "Osteoporosis"],
        "show_in_navbar": True
    },
    {
        "name": "Eye Care",
        "subcategories": ["Eye Drop", "Eye Ointment & Gel", "Eye Care Capsules", "Eye Care Tablets", "Eye Injections"],
        "show_in_navbar": True
    },
    {
        "name": "Pain Relief",
        "subcategories": ["Arthritis", "Asthma", "Weight Loss"],
        "show_in_navbar": True
    }
]

def migrate():
    print("Starting category and subcategory database migration...")
    
    # 1. Update all existing categories to default show_in_navbar=False and subcategories=[]
    update_result = db.categories.update_many(
        {"show_in_navbar": {"$exists": False}},
        {"$set": {"show_in_navbar": False, "subcategories": []}}
    )
    print(f"Updated default values for {update_result.modified_count} existing categories.")
    
    # 2. Iterate and apply navbar settings for specified categories
    for nav_cat in navbar_categories:
        name = nav_cat["name"]
        subcats = nav_cat["subcategories"]
        show_nav = nav_cat["show_in_navbar"]
        
        # Check case-insensitively
        existing = db.categories.find_one({"name": {"$regex": f"^{name}$", "$options": "i"}})
        if existing:
            db.categories.update_one(
                {"_id": existing["_id"]},
                {"$set": {
                    "name": name, # normalize casing
                    "show_in_navbar": show_nav,
                    "subcategories": subcats
                }}
            )
            print(f"Updated existing category: '{name}' with {len(subcats)} subcategories.")
        else:
            new_id = get_next_id("categories")
            new_doc = {
                "id": new_id,
                "name": name,
                "description": f"Medicines and treatments related to {name}.",
                "show_in_navbar": show_nav,
                "subcategories": subcats
            }
            db.categories.insert_one(new_doc)
            print(f"Created new category: '{name}' (ID: {new_id}) with {len(subcats)} subcategories.")

    print("Category migration completed successfully.")

if __name__ == '__main__':
    migrate()
