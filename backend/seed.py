import random
from .database import db, get_next_id

# Clear the database collections to start fresh
print("Clearing database collections...")
db.products.delete_many({})
db.categories.delete_many({})
db.blogs.delete_many({})
db.orders.delete_many({})
db.coupons.delete_many({})
db.users.delete_many({})
db.counters.delete_many({})

products_data = [
    # Diabetes
    {
        "name": "Glucophage XR 500mg",
        "brand": "AstraZeneca",
        "category": "Diabetes",
        "price": 24.99,
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
        "description": "Metformin extended-release oral diabetes medicine to help control blood sugar levels in type 2 diabetes.",
        "dosage": "Take 1 tablet daily with the evening meal. Do not crush or chew.",
        "side_effects": "May cause diarrhea, nausea, stomach upset, or metallic taste.",
        "uses": "Indicated as an adjunct to diet and exercise to improve glycemic control in adults with type 2 diabetes mellitus."
    },
    {
        "name": "Lantus Solostar Insulin Pen",
        "brand": "Sanofi",
        "category": "Diabetes",
        "price": 89.99,
        "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
        "description": "Long-acting insulin glargine injection in a pre-filled disposable pen used to improve blood sugar control.",
        "dosage": "Inject subcutaneously once daily at any time of day, at the same time every day.",
        "side_effects": "Low blood sugar (hypoglycemia), injection site reactions, weight gain.",
        "uses": "Indicated to improve glycemic control in adults and pediatric patients with type 1 diabetes mellitus and adults with type 2 diabetes mellitus."
    },
    {
        "name": "Diabeta 5mg Tablets",
        "brand": "Pfizer",
        "category": "Diabetes",
        "price": 18.50,
        "image_url": "https://images.unsplash.com/photo-1628595308585-6499bc7b26d8?auto=format&fit=crop&w=400&q=80",
        "description": "Glyburide oral medication that helps the pancreas produce insulin more efficiently to manage blood sugar.",
        "dosage": "Take 1 tablet with breakfast or the first main meal of the day.",
        "side_effects": "Hypoglycemia, nausea, heartburn, mild skin rash.",
        "uses": "Used to treat high blood sugar levels caused by type 2 diabetes."
    },
    
    # Men's Health
    {
        "name": "Viagra 100mg Tablets",
        "brand": "Pfizer",
        "category": "Men's Health",
        "price": 65.00,
        "image_url": "https://images.unsplash.com/photo-1611079830811-865faf673641?auto=format&fit=crop&w=400&q=80",
        "description": "Sildenafil prescription medicine used for the treatment of erectile dysfunction in men.",
        "dosage": "Take 1 tablet approximately 1 hour before sexual activity. Do not take more than once daily.",
        "side_effects": "Headache, flushing, indigestion, nasal congestion, dizziness.",
        "uses": "Treatment of erectile dysfunction (ED) in male adults."
    },
    {
        "name": "Duodart 0.5mg/0.4mg Capsules",
        "brand": "GSK",
        "category": "Men's Health",
        "price": 42.00,
        "image_url": "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=400&q=80",
        "description": "Dutasteride and tamsulosin hydrochloride combined therapy to treat symptoms of an enlarged prostate.",
        "dosage": "Take 1 capsule daily, approximately 30 minutes after the same meal.",
        "side_effects": "Impotence, decreased libido, dizziness, ejaculation disorders.",
        "uses": "Treatment of moderate to severe symptoms of benign prostatic hyperplasia (BPH) to reduce the risk of acute urinary retention."
    },
    {
        "name": "Propecia 1mg Hair Loss Tablets",
        "brand": "Merck",
        "category": "Men's Health",
        "price": 35.90,
        "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80",
        "description": "Finasteride oral treatment clinically proven to treat male pattern hair loss on the vertex and middle scalp.",
        "dosage": "Take 1 tablet daily, with or without food.",
        "side_effects": "Decreased libido, erectile dysfunction, ejaculation volume decrease.",
        "uses": "Treatment of male pattern hair loss (androgenetic alopecia) in men only."
    },

    # Eye Care
    {
        "name": "Systane Ultra Lubricant Drops",
        "brand": "Novartis",
        "category": "Eye Care",
        "price": 12.50,
        "image_url": "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=400&q=80",
        "description": "High-performance lubricant eye drops designed to provide dry eye relief and lasting protection.",
        "dosage": "Instill 1 or 2 drops in the affected eye(s) as needed.",
        "side_effects": "Temporary blurred vision, mild eye irritation, eye redness.",
        "uses": "Temporary relief of burning and irritation due to dryness of the eye."
    },
    {
        "name": "Lumigan 0.01% Eye Drops",
        "brand": "Allergan",
        "category": "Eye Care",
        "price": 54.00,
        "image_url": "https://images.unsplash.com/photo-1547853760-18eb856c8ad7?auto=format&fit=crop&w=400&q=80",
        "description": "Bimatoprost ophthalmic solution used to lower high intraocular pressure in patients with open-angle glaucoma.",
        "dosage": "Instill 1 drop in the affected eye(s) once daily in the evening.",
        "side_effects": "Eye redness, eyelash growth, itchy eyes, darkened iris color.",
        "uses": "Indicated for the reduction of elevated intraocular pressure in patients with open-angle glaucoma or ocular hypertension."
    },
    {
        "name": "Alaway Antihistamine Drops",
        "brand": "Bausch & Lomb",
        "category": "Eye Care",
        "price": 14.99,
        "image_url": "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=400&q=80",
        "description": "Ketotifen fumarate ophthalmic solution for fast, temporary eye itch relief that lasts up to 12 hours.",
        "dosage": "Instill 1 drop in the affected eye(s) twice daily, every 8 to 12 hours.",
        "side_effects": "Mild burning or stinging, pupil dilation, dry eyes.",
        "uses": "Temporarily relieves itchy eyes due to pollen, ragweed, grass, animal hair, and dander."
    },

    # Asthma
    {
        "name": "Ventolin HFA Albuterol Inhaler",
        "brand": "GSK",
        "category": "Asthma",
        "price": 38.00,
        "image_url": "https://images.unsplash.com/photo-1563486859-045b7c48fe5e?auto=format&fit=crop&w=400&q=80",
        "description": "Albuterol sulfate inhalation aerosol for the prevention and treatment of bronchospasm in patients with asthma.",
        "dosage": "Inhale 2 puffs every 4 to 6 hours as needed for bronchospasm or chest tightness.",
        "side_effects": "Tremor, nervousness, headache, throat irritation, rapid heartbeat.",
        "uses": "Treatment and prevention of bronchospasm in adults and children 4 years of age and older with reversible obstructive airway disease."
    },
    {
        "name": "Symbicort 160/4.5 Inhaler",
        "brand": "AstraZeneca",
        "category": "Asthma",
        "price": 78.00,
        "image_url": "https://images.unsplash.com/photo-1563486859-045b7c48fe5e?auto=format&fit=crop&w=400&q=80",
        "description": "Budesonide and formoterol fumarate dihydrate combination inhaler to control and prevent asthma symptoms.",
        "dosage": "Inhale 2 puffs twice daily (morning and evening). Rinse mouth with water after use.",
        "side_effects": "Oral thrush, throat irritation, headache, upper respiratory tract infection.",
        "uses": "Long-term maintenance treatment of asthma in patients 6 years of age and older, and maintenance of COPD symptoms."
    },
    {
        "name": "Singulair 10mg Tablets",
        "brand": "Merck",
        "category": "Asthma",
        "price": 22.50,
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
        "description": "Montelukast sodium oral tablet to prevent asthma symptoms and control seasonal allergies.",
        "dosage": "Take 1 tablet daily in the evening, with or without food.",
        "side_effects": "Headache, stomach pain, cough, nasal congestion, mood changes.",
        "uses": "Prophylaxis and chronic treatment of asthma in adults and pediatric patients 12 months of age and older."
    },

    # Skin Care
    {
        "name": "Cetaphil Moisturizing Cream",
        "brand": "Novartis",
        "category": "Skin Care",
        "price": 15.99,
        "image_url": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=400&q=80",
        "description": "Rich moisturizing cream clinically proven to provide intense and lasting 48-hour hydration for dry, sensitive skin.",
        "dosage": "Apply liberally to clean skin daily or as needed.",
        "side_effects": "Rarely, mild skin irritation, redness, or burning.",
        "uses": "Moisturizes and protects dry, sensitive, or compromised skin barrier."
    },
    {
        "name": "Differin 0.1% Acne Gel",
        "brand": "Pfizer",
        "category": "Skin Care",
        "price": 29.99,
        "image_url": "https://images.unsplash.com/photo-1626600983616-52c6f14bbad5?auto=format&fit=crop&w=400&q=80",
        "description": "Adapalene topical retinoid acne gel that treats and prevents breakouts, restores skin tone, and texture.",
        "dosage": "Apply a thin layer to clean, dry skin once daily, preferably at bedtime.",
        "side_effects": "Dryness, redness, skin peeling, mild burning sensation during initial weeks.",
        "uses": "Topical treatment of acne vulgaris in patients 12 years of age and older."
    },
    {
        "name": "Cicaplast Baume B5 Soothing Cream",
        "brand": "GSK",
        "category": "Skin Care",
        "price": 19.50,
        "image_url": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=400&q=80",
        "description": "Multi-purpose soothing skin protectant cream formulated with panthenol and madecassoside to comfort dry, irritated skin.",
        "dosage": "Apply twice daily to clean, dry skin on body, face, or lips.",
        "side_effects": "Extremely well tolerated; rare cases of contact allergy.",
        "uses": "Soothes skin irritations, chapped skin, dry patches, and minor cuts."
    },

    # Blood Pressure
    {
        "name": "Cozaar 50mg Tablets",
        "brand": "Merck",
        "category": "Blood Pressure",
        "price": 19.99,
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
        "description": "Losartan potassium oral tablets used to treat high blood pressure (hypertension) and protect kidneys in diabetic patients.",
        "dosage": "Take 1 tablet daily, with or without food. Monitor blood pressure regularly.",
        "side_effects": "Dizziness, upper respiratory infection, nasal congestion, back pain.",
        "uses": "Indicated to treat hypertension, reduce stroke risk in hypertensive patients, and treat diabetic nephropathy."
    },
    {
        "name": "Diovan 160mg Tablets",
        "brand": "Novartis",
        "category": "Blood Pressure",
        "price": 34.50,
        "image_url": "https://images.unsplash.com/photo-1628595308585-6499bc7b26d8?auto=format&fit=crop&w=400&q=80",
        "description": "Valsartan oral blood pressure medication to manage hypertension, heart failure, and improve post-heart attack survival.",
        "dosage": "Take 1 tablet daily, at the same time every day.",
        "side_effects": "Headache, dizziness, fatigue, high blood potassium, kidney function changes.",
        "uses": "Treatment of hypertension to lower blood pressure, treatment of heart failure, and post-myocardial infarction."
    },
    {
        "name": "Cardizem CD 120mg Capsules",
        "brand": "Sanofi",
        "category": "Blood Pressure",
        "price": 28.00,
        "image_url": "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=400&q=80",
        "description": "Diltiazem extended-release capsule used to lower blood pressure, treat chest pain (angina), and regulate heart rhythm.",
        "dosage": "Take 1 capsule daily in the morning, swallowed whole.",
        "side_effects": "Swelling of ankles/feet, headache, dizziness, nausea, slow heart rate.",
        "uses": "Treatment of hypertension, chronic stable angina, and angina due to coronary artery spasm."
    },

    # Women's Health
    {
        "name": "Premarin 0.625mg Tablets",
        "brand": "Pfizer",
        "category": "Women's Health",
        "price": 48.00,
        "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80",
        "description": "Conjugated estrogens tablets used to treat moderate to severe hot flashes and symptoms of menopause.",
        "dosage": "Take 1 tablet daily. Follow a cyclical or continuous schedule as directed by your doctor.",
        "side_effects": "Breast tenderness, headache, nausea, water retention, bloating.",
        "uses": "Treatment of moderate to severe vasomotor symptoms and vulvovaginal atrophy due to menopause."
    },
    {
        "name": "Yaz Birth Control Tablets",
        "brand": "Bayer",
        "category": "Women's Health",
        "price": 32.00,
        "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
        "description": "Drospirenone and ethinyl estradiol birth control pill used to prevent pregnancy, treat PMDD, and moderate acne.",
        "dosage": "Take 1 tablet daily at the same time for 28 consecutive days.",
        "side_effects": "Nausea, breast tenderness, headache, irregular bleeding, mood swings.",
        "uses": "Oral contraceptive for pregnancy prevention, treatment of symptoms of premenstrual dysphoric disorder (PMDD)."
    },
    {
        "name": "Caltrate 600+D3 Calcium",
        "brand": "GSK",
        "category": "Women's Health",
        "price": 14.99,
        "image_url": "https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?auto=format&fit=crop&w=400&q=80",
        "description": "High-potency calcium carbonate with Vitamin D3 supplement for bone health, density, and strength.",
        "dosage": "Take 1 tablet twice daily with food or as directed by a healthcare professional.",
        "side_effects": "Constipation, gas, bloating (rare when taken with adequate water).",
        "uses": "Helps support healthy bones and teeth, reduces the risk of osteoporosis when combined with exercise and healthy diet."
    },

    # Antibiotics
    {
        "name": "Amoxil 500mg Capsules",
        "brand": "GSK",
        "category": "Antibiotics",
        "price": 16.00,
        "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80",
        "description": "Amoxicillin broad-spectrum penicillin antibiotic used to treat bacterial infections of the ear, nose, throat, or skin.",
        "dosage": "Take 1 capsule every 8 hours, or as prescribed. Complete the full course even if feeling better.",
        "side_effects": "Diarrhea, nausea, vomiting, skin rash, yeast infection.",
        "uses": "Treatment of infections due to susceptible strains of bacterial pathogens."
    },
    {
        "name": "Zithromax 250mg Tablets",
        "brand": "Pfizer",
        "category": "Antibiotics",
        "price": 29.99,
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
        "description": "Azithromycin macrolide antibiotic in a convenient 5-day dose pack for treating respiratory, ear, or skin infections.",
        "dosage": "Day 1: Take 2 tablets (500mg) once. Days 2-5: Take 1 tablet (250mg) daily.",
        "side_effects": "Diarrhea, nausea, abdominal pain, temporary changes in hearing.",
        "uses": "Treatment of mild to moderate infections caused by susceptible bacterial strains."
    },
    {
        "name": "Cipro 500mg Tablets",
        "brand": "Sanofi",
        "category": "Antibiotics",
        "price": 21.50,
        "image_url": "https://images.unsplash.com/photo-1628595308585-6499bc7b26d8?auto=format&fit=crop&w=400&q=80",
        "description": "Ciprofloxacin fluoroquinolone antibiotic used to treat bacterial urinary tract, prostate, or bone infections.",
        "dosage": "Take 1 tablet every 12 hours with a full glass of water. Avoid taking with dairy products.",
        "side_effects": "Nausea, diarrhea, headache, muscle soreness/tendonitis risk.",
        "uses": "Treatment of urinary tract infections, chronic bacterial prostatitis, and lower respiratory tract infections."
    },
    # Ivermectin
    {
        "name": "Iverheal 3 Mg",
        "brand": "Healing Pharma",
        "category": "Ivermectin",
        "price": 14.99,
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
        "description": "Iverheal 3 contains Ivermectin 3mg, which is used for treatment of various parasitic infections.",
        "dosage": "Take on an empty stomach with a full glass of water.",
        "side_effects": "Dizziness, loss of appetite, nausea, vomiting, stomach pain.",
        "uses": "Treatment of strongyloidiasis, onchocerciasis, and other parasitic roundworm infections."
    },
    {
        "name": "Iverheal 6 Mg",
        "brand": "Healing Pharma",
        "category": "Ivermectin",
        "price": 19.99,
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
        "description": "Iverheal 6 contains Ivermectin 6mg, a potent antiparasitic formulation.",
        "dosage": "As directed by physician. Usually single dose on empty stomach.",
        "side_effects": "Mild fever, skin itch, joint pain, headache.",
        "uses": "Antiparasitic treatment against roundworms and scabies."
    },
    {
        "name": "Ivermectin 12 Mg",
        "brand": "Taj Pharma",
        "category": "Ivermectin",
        "price": 29.99,
        "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
        "description": "Ivermectin 12mg tablets provide high-strength antiparasitic action.",
        "dosage": "Take as single dose on an empty stomach.",
        "side_effects": "Fatigue, abdominal pain, skin rash, dizziness.",
        "uses": "Treats scabies, pediculosis, and roundworm infections."
    },
    {
        "name": "Ivermectin 24 Mg Tablet USA",
        "brand": "Pfizer",
        "category": "Ivermectin",
        "price": 49.99,
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
        "description": "Ivermectin 24mg formulation optimized for advanced antiparasitic requirements.",
        "dosage": "Take with water on empty stomach.",
        "side_effects": "Nausea, diarrhea, swelling, itchiness.",
        "uses": "Advanced treatment for lymphatic filariasis and scabies."
    },
    {
        "name": "Ivermectin 40 Mg USA",
        "brand": "GSK",
        "category": "Ivermectin",
        "price": 69.99,
        "image_url": "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=400&q=80",
        "description": "Ivermectin 40mg high-potency antiparasitic treatment.",
        "dosage": "Take as directed by doctor.",
        "side_effects": "Dizziness, nausea, headache, joint pain.",
        "uses": "Anti-worm and antiparasitic therapy."
    },
    {
        "name": "Ivermectin 80 Mg Tablet USA",
        "brand": "Sanofi",
        "category": "Ivermectin",
        "price": 119.99,
        "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80",
        "description": "Extra-strength Ivermectin 80mg tablets.",
        "dosage": "Under strict medical supervision.",
        "side_effects": "Drowsiness, vomiting, hives, vision changes.",
        "uses": "Treatment of severe parasitic infections."
    },
    {
        "name": "Ivermectin Lotion 1.0% w/v (Ivrea)",
        "brand": "Abbott",
        "category": "Ivermectin",
        "price": 24.99,
        "image_url": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=400&q=80",
        "description": "Ivrea Ivermectin Lotion 1% is a topical treatment for rosacea and head lice.",
        "dosage": "Apply thin layer to affected skin area once daily.",
        "side_effects": "Skin burning sensation, dry skin, skin irritation.",
        "uses": "Topical treatment of inflammatory lesions of rosacea and head lice."
    },
    # Anti Worm
    {
        "name": "Mectizan 3 Mg",
        "brand": "Merck",
        "category": "Anti Worm",
        "price": 18.99,
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
        "description": "Mectizan 3mg contains Ivermectin and is primarily used to treat river blindness.",
        "dosage": "Take once a year or as directed by program.",
        "side_effects": "Fever, headache, itching, joint pain.",
        "uses": "Treatment of onchocerciasis (river blindness)."
    },
    {
        "name": "Wormall 400mg",
        "brand": "Cipla",
        "category": "Anti Worm",
        "price": 9.99,
        "image_url": "https://images.unsplash.com/photo-1628595308585-6499bc7b26d8?auto=format&fit=crop&w=400&q=80",
        "description": "Wormall Albendazole 400mg chewable tablets for complete worm eradication.",
        "dosage": "Chew the tablet completely before swallowing.",
        "side_effects": "Stomach pain, headache, temporary hair loss, dizziness.",
        "uses": "Broad-spectrum anthelmintic against tapeworms, roundworms, and hookworms."
    }
]

# Extract unique categories
categories = list(set(item["category"] for item in products_data))

print("Seeding categories...")
for cat_name in categories:
    cat_doc = {
        "name": cat_name,
        "description": f"Medicines and treatments related to {cat_name}.",
        "id": get_next_id("categories")
    }
    db.categories.insert_one(cat_doc)
print(f"Seeded {len(categories)} categories.")

def generate_pack_sizes(category, name, base_price):
    name_lower = name.lower()
    
    if category == "Skin Care" or "cream" in name_lower or "gel" in name_lower or "lotion" in name_lower:
        unit = "Tube"
        quantities = [1, 2, 3]
    elif category == "Eye Care" or "drops" in name_lower:
        unit = "Bottle"
        quantities = [1, 2, 3]
    elif "inhaler" in name_lower:
        unit = "Inhaler"
        quantities = [1, 2, 3]
    elif "pen" in name_lower or "injection" in name_lower or "vial" in name_lower:
        unit = "Pen" if "pen" in name_lower else ("Vial" if "vial" in name_lower else "Injection")
        quantities = [1, 2, 3]
    elif "capsule" in name_lower:
        unit = "Capsules"
        quantities = [30, 60, 90]
    else:
        unit = "Tablets"
        quantities = [30, 60, 90]

    pack_sizes = []
    for qty in quantities:
        if qty in [30, 1]:
            discount = 1.0
        elif qty in [60, 2]:
            discount = 0.90 # 10% discount
        else:
            discount = 0.80 # 20% discount
            
        if unit in ["Tablets", "Capsules"]:
            multiplier = qty / 30
            price = round(base_price * multiplier * discount, 2)
        else:
            price = round(base_price * qty * discount, 2)
            
        pack_sizes.append({
            "size": f"{qty} {unit}",
            "price": price
        })
        
    return pack_sizes

print("Seeding dummy products...")
for i, item in enumerate(products_data, 1):
    product = {
        "name": item["name"],
        "brand": item["brand"],
        "category": item["category"],
        "price": item["price"],
        "image_url": item["image_url"],
        "description": item["description"],
        "dosage": item["dosage"],
        "side_effects": item["side_effects"],
        "uses": item["uses"],
        "stock": random.randint(10, 100),
        "manufacturer": f"{item['brand']} Pharmaceuticals Ltd.",
        "pack_sizes": generate_pack_sizes(item["category"], item["name"], item["price"]),
        "id": get_next_id("products")
    }
    db.products.insert_one(product)

print(f"Seeding complete! Loaded {len(products_data)} products.")
