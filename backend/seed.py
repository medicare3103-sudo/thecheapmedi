import random
from .database import db, get_next_id
from .auth import get_password_hash

# Clear the database collections to start fresh
print("Clearing database collections...")
db.products.delete_many({})
db.categories.delete_many({})
db.blogs.delete_many({})
db.orders.delete_many({})
db.coupons.delete_many({})
db.users.delete_many({})
db.authors.delete_many({})
db.counters.delete_many({})

# Seed default admin user
print("Seeding admin user...")
admin_hashed_password = get_password_hash("admin")
admin_user = {
    "username": "admin",
    "email": "admin@medicare.com",
    "phone_number": "1234567890",
    "hashed_password": admin_hashed_password,
    "is_active": True,
    "id": get_next_id("users")
}
db.users.insert_one(admin_user)
print("Admin user seeded.")

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

def get_seed_active_ingredient(name):
    lowercaseName = name.lower()
    if 'glucophage' in lowercaseName or 'metformin' in lowercaseName: return 'Metformin HCl'
    if 'lantus' in lowercaseName or 'insulin' in lowercaseName: return 'Insulin Glargine'
    if 'diabeta' in lowercaseName or 'glyburide' in lowercaseName: return 'Glyburide'
    if 'viagra' in lowercaseName or 'sildenafil' in lowercaseName: return 'Sildenafil Citrate'
    if 'duodart' in lowercaseName: return 'Dutasteride / Tamsulosin'
    if 'propecia' in lowercaseName or 'finasteride' in lowercaseName: return 'Finasteride'
    if 'systane' in lowercaseName: return 'Polyethylene Glycol / Propylene Glycol'
    if 'lumigan' in lowercaseName or 'bimatoprost' in lowercaseName: return 'Bimatoprost'
    if 'alaway' in lowercaseName or 'ketotifen' in lowercaseName: return 'Ketotifen Fumarate'
    if 'ventolin' in lowercaseName or 'albuterol' in lowercaseName: return 'Albuterol Sulfate'
    if 'symbicort' in lowercaseName: return 'Budesonide / Formoterol Fumarate'
    if 'singulair' in lowercaseName or 'montelukast' in lowercaseName: return 'Montelukast Sodium'
    if 'cetaphil' in lowercaseName: return 'Moisturizing Base'
    if 'differin' in lowercaseName or 'adapalene' in lowercaseName: return 'Adapalene'
    if 'cicaplast' in lowercaseName: return 'Panthenol / Madecassoside'
    if 'cozaar' in lowercaseName or 'losartan' in lowercaseName: return 'Losartan Potassium'
    if 'diovan' in lowercaseName or 'valsartan' in lowercaseName: return 'Valsartan'
    if 'cardizem' in lowercaseName or 'diltiazem' in lowercaseName: return 'Diltiazem Hydrochloride'
    if 'premarin' in lowercaseName: return 'Conjugated Estrogens'
    if 'yaz' in lowercaseName: return 'Drospirenone / Ethinyl Estradiol'
    if 'caltrate' in lowercaseName: return 'Calcium Carbonate / Vitamin D3'
    if 'amoxil' in lowercaseName or 'amoxicillin' in lowercaseName: return 'Amoxicillin'
    if 'zithromax' in lowercaseName or 'azithromycin' in lowercaseName: return 'Azithromycin'
    if 'cipro' in lowercaseName or 'ciprofloxacin' in lowercaseName: return 'Ciprofloxacin'
    if 'iverheal' in lowercaseName or 'ivermectin' in lowercaseName or 'mectizan' in lowercaseName: return 'Ivermectin'
    if 'wormall' in lowercaseName or 'albendazole' in lowercaseName: return 'Albendazole'
    return 'Active Pharmaceutical Ingredient'

print("Seeding dummy products...")

authors_data = [
    {
        "slug": "sarah-jenkins",
        "name": "Dr. Sarah Jenkins",
        "role": "Chief Medical Reviewer (MD, Pharm D)",
        "badge": "Medical Expert Board Member",
        "educationShort": "Doctor of Medicine (MD) - Harvard Medical School",
        "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400",
        "aboutSub": "Clinical Pharmacist (Pharm D)",
        "educationList": [
            "Doctor of Medicine (MD) – Harvard Medical School",
            "Biomedical Engineering – Massachusetts Institute of Technology (MIT)",
            "Postdoctoral Fellowship in Clinical Pharmacology - Johns Hopkins University"
        ],
        "bioParagraphs": [
            "Sarah Jenkins is a dedicated Clinical Pharmacologist and the Chief Medical Reviewer at The Cheap Pharma. With a Doctor of Pharmacy (Pharm D) and over 10 years of clinical experience at prestigious US institutions like the Mayo Clinic and Johns Hopkins Hospital, Sarah specializes in drug safety, digital healthcare accessibility, and pharmaceutical supply chain management.",
            "Armed with a deep understanding of US healthcare standards and consumer safety, she ensures that all medical information and product insights provided on the platform are scientifically accurate, up-to-date, and easy for American patients to understand. Her mission is to bridge the gap between quality medication and nationwide accessibility while maintaining the highest FDA regulatory standards."
        ],
        "research": "Graduate Research Assistant, Department of Cellular and Molecular Pathology, University of Pittsburgh, April 2009 – January 2011.",
        "grants": [
            "HRPF membership – National Cancer Institute",
            "Principal Investigator – Faculty Development Grant, Hampton University",
            "Co-Investigator – Faculty Development Grant, Hampton University"
        ],
        "interests": "Department of Pharmacy – Pharmacological Physiology",
        "affiliations": [
            "The Sigma Xi Research Company",
            "American Association of Colleges of Pharmacy"
        ],
        "service": "American Board of Clinical Pharmacology (ABCP)",
        "conclusion": "Dr. Sarah Jenkins is a helpful resource for patients and readers looking for trustworthy information on the use and safety of medications due to her significant experience and expertise in the field of clinical pharmacology.",
        "isDoctor": True
    },
    {
        "slug": "david-vance",
        "name": "David Vance",
        "role": "Senior Medical Writer (MS)",
        "badge": "Editorial Board Member",
        "educationShort": "Master of Science in Medical Writing - Johns Hopkins University",
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
        "aboutSub": "Healthcare Communications Specialist",
        "educationList": [
            "Master of Science (MS) in Medical Writing - Johns Hopkins University",
            "BS in Biochemistry - University of Michigan",
            "Member of the American Medical Writers Association (AMWA)"
        ],
        "bioParagraphs": [
            "David Vance is a veteran medical writer who specializes in translating complex clinical trials and pharmaceutical data into accessible, patient-friendly articles. His writing focuses on drug mechanisms, emerging treatments, and evidence-based wellness.",
            "He is committed to publishing high-quality, objective resources that help consumers make informed decisions about their healthcare journeys."
        ],
        "research": "Research Associate, Center for Health Literacy, University of Maryland, September 2012 – December 2014.",
        "grants": [
            "Fellowship Grant – American Medical Writers Association (AMWA)",
            "Co-Investigator – Public Health Communications Grant, Hampton University"
        ],
        "interests": "Department of Communication – Health Literacy & Patient Advocacy",
        "affiliations": [
            "American Medical Writers Association (AMWA)",
            "Association of Health Care Journalists (AHCJ)"
        ],
        "service": "National Health Council (NHC)",
        "conclusion": "David Vance is a highly dedicated science writer and communicator, focused on making drug safety and healthcare guidance clear and actionable for everyday readers.",
        "isDoctor": False
    },
    {
        "slug": "elena-rostova",
        "name": "Elena Rostova",
        "role": "Senior Medical Writer (PharmD)",
        "badge": "Editorial Board Member",
        "educationShort": "Doctor of Pharmacy (PharmD) - UCSF School of Pharmacy",
        "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400",
        "aboutSub": "Pharmacist & Drug Safety Expert",
        "educationList": [
            "Doctor of Pharmacy (PharmD) - University of California, San Francisco (UCSF)",
            "Clinical Pharmacy Residency - UCSF Medical Center",
            "BS in Chemistry - Boston University"
        ],
        "bioParagraphs": [
            "Elena Rostova is a clinical pharmacist and medical writer with a passion for drug safety and patient education. She has extensive experience in hospital pharmacy operations and clinical consulting across major US healthcare systems.",
            "At The Cheap Pharma, Elena writes detailed drug profiles, safety guides, and dosage recommendations, ensuring all information matches the latest guidelines from the FDA, CDC, and other major US regulatory bodies."
        ],
        "research": "Clinical Research Fellow, Department of Clinical Pharmacy, UCSF, June 2015 – August 2017.",
        "grants": [
            "Research Fellowship Grant – UCSF School of Pharmacy",
            "Principal Investigator – Community Health Outreach Grant, Hampton University"
        ],
        "interests": "Department of Clinical Pharmacy – Pharmacotherapy & Drug Information Systems",
        "affiliations": [
            "American Society of Health-System Pharmacists (ASHP)",
            "American College of Clinical Pharmacy (ACCP)"
        ],
        "service": "California State Board of Pharmacy",
        "conclusion": "Elena Rostova leverages her extensive clinical pharmacy background to review drug profiles and deliver trusted, scientifically backed guidance on medication safety and dosage guidelines.",
        "isDoctor": False
    }
]

print("Seeding authors...")
for author in authors_data:
    author["id"] = get_next_id("authors")
    db.authors.insert_one(author)
print(f"Seeded {len(authors_data)} authors.")

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
        "active_ingredient": get_seed_active_ingredient(item["name"]),
        "rx_required": item["category"] in ['Antibiotics', 'Diabetes', 'Asthma', 'Blood Pressure', 'Men\'s Health', 'Women\'s Health'],
        "referred_by_doctor": "Dr. Sarah Jenkins",
        "doctor_title": "MD, PharmD",
        "doctor_institution": "Harvard Medical School",
        "doctor_image_url": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100",
        "doctor_advice": "As a clinical pharmacologist licensed in the United States, I advise taking this medication exactly as directed by your US-licensed healthcare provider. Ensure you discuss any other ongoing prescriptions or potential allergies before starting treatment. All medications on The Cheap Pharma are FDA-approved.",
        "reviewer_slug": "sarah-jenkins",
        "writer_slug": "david-vance" if i % 2 == 0 else "elena-rostova",
        "id": get_next_id("products")
    }
    db.products.insert_one(product)

import datetime
blogs_data = [
    {
        "title": "Generic Vs Branded Chewable ED Pills: Which to Choose?",
        "excerpt": "Understand the key differences between generic and brand-name chewable erectile dysfunction medications to make an informed choice.",
        "category": "Wellness",
        "image": "https://images.unsplash.com/photo-1611079830811-865faf673641?auto=format&fit=crop&w=800&q=80",
        "date": "June 4, 2026",
        "author": "Dr. Sarah Jenkins",
        "content": """
        <p class="lead text-muted mb-4">Understand the key differences between generic and brand-name chewable erectile dysfunction medications to choose the right option.</p>
        <p>Chewable Erectile Dysfunction (ED) pills have become increasingly popular due to their convenience, faster onset of action, and ease of consumption. However, patients often face a critical question: should they choose generic versions or branded options?</p>
        <h4 class="mt-4 mb-3 fw-bold">Active Ingredients Are Identical</h4>
        <p>Both generic and branded chewable ED medications contain the exact same active therapeutic ingredients (such as Sildenafil, Tadalafil, or Vardenafil). As a result, they offer the same level of efficacy, safety, and duration of action inside the human body.</p>
        <h4 class="mt-4 mb-3 fw-bold">Price and Affordability</h4>
        <p>The primary advantage of generic chewable pills is cost. Branded drugs undergo expensive research, development, and marketing campaigns, which drives up their retail price. Generic manufacturers bypass these initial costs, passing the savings directly to the consumers.</p>
        <h4 class="mt-4 mb-3 fw-bold">Onset and Efficacy</h4>
        <p>Chewable formulations usually dissolve in the mouth and enter the bloodstream quicker than standard pills. This provides a faster onset of action, typically within 15 to 30 minutes, regardless of whether you choose the generic or branded variant.</p>
        """
    },
    {
        "title": "Fenbendazole Dosage For Human Parasitic Infections",
        "excerpt": "A comprehensive guide to Fenbendazole dosages, safety guidelines, and its clinical applications in human parasitic infections.",
        "category": "Wellness",
        "image": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80",
        "date": "May 28, 2026",
        "author": "David Vance",
        "content": """
        <p class="lead text-muted mb-4">A comprehensive guide to Fenbendazole dosages, safety guidelines, and its clinical applications in human parasitic infections.</p>
        <p>Fenbendazole is a broad-spectrum anthelmintic agent primarily utilized to treat intestinal parasites. While historically a veterinary treatment, modern research and off-label usage have highlighted its efficacy in managing human parasitic infections under strict medical supervision.</p>
        <h4 class="mt-4 mb-3 fw-bold">Dosage Guidelines</h4>
        <p>Proper dosage is critical to ensure efficacy and minimize potential side effects. Standard off-label regimens often involve daily doses ranging from 100mg to 222mg, taken in cycles (e.g., three days on, four days off). Always consult a healthcare professional to determine the exact dosage tailored to your medical history.</p>
        <h4 class="mt-4 mb-3 fw-bold">Safety and Precautions</h4>
        <p>Fenbendazole is generally well-tolerated, but proper liver function monitoring is recommended during prolonged use. Common mild side effects include digestive discomfort or temporary fatigue. Avoid self-treatment and prioritize professional medical advice.</p>
        """
    },
    {
        "title": "Can You Take Viagra And Cialis Together?",
        "excerpt": "Combining Sildenafil and Tadalafil is a common inquiry. Discover the medical guidelines, potential risks, and drug interactions.",
        "category": "Wellness",
        "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "date": "May 21, 2026",
        "author": "Dr. Alan Peterson",
        "content": """
        <p class="lead text-muted mb-4">Combining Sildenafil and Tadalafil is a common inquiry. Discover the medical guidelines, potential risks, and drug interactions.</p>
        <p>Viagra (Sildenafil) and Cialis (Tadalafil) are both FDA-approved phosphodiesterase-5 (PDE5) inhibitors used to treat erectile dysfunction. While they function similarly, taking them together is generally not recommended by medical professionals.</p>
        <h4 class="mt-4 mb-3 fw-bold">Increased Risk of Side Effects</h4>
        <p>Combining these medications does not double their efficacy; rather, it exponentially increases the risk of severe side effects. The most dangerous side effect is a critical drop in blood pressure (hypotension), which can cause dizziness, fainting, or even heart failure.</p>
        <h4 class="mt-4 mb-3 fw-bold">Different Durations of Action</h4>
        <p>Viagra is designed for short-term use, lasting 4-6 hours, whereas Cialis is a long-acting drug that remains in the system for up to 36 hours. Because of Tadalafil's long half-life, adding Sildenafil can cause a build-up in the system, putting unnecessary strain on the cardiovascular system.</p>
        """
    },
    {
        "title": "5 Essential Tips for Managing Type 2 Diabetes",
        "excerpt": "Discover actionable strategies to maintain healthy blood sugar levels and improve your daily quality of life.",
        "category": "Diabetes",
        "image": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "date": "June 1, 2026",
        "author": "Elena Rostova",
        "content": """
        <p class="lead text-muted mb-4">Discover actionable strategies to maintain healthy blood sugar levels and improve your daily quality of life.</p>
        <p>Managing Type 2 Diabetes can seem daunting, but with the right lifestyle adjustments, it is entirely possible to lead a healthy, active, and fulfilling life. Here are five essential tips to help you stay on track.</p>
        <h4 class="mt-4 mb-3 fw-bold">1. Eat a Balanced, Nutrient-Dense Diet</h4>
        <p>Focus on incorporating a variety of whole foods into your meals. Prioritize lean proteins, healthy fats, and complex carbohydrates like whole grains, legumes, and non-starchy vegetables. These foods have a lower glycemic index, meaning they cause a slower, more gradual rise in blood sugar levels.</p>
        <h4 class="mt-4 mb-3 fw-bold">2. Stay Physically Active</h4>
        <p>Regular physical activity helps your body use insulin more efficiently. Aim for at least 150 minutes of moderate-intensity aerobic exercise per week, such as brisk walking, swimming, or cycling. Additionally, incorporate strength training exercises a few times a week to build muscle mass, which further aids in glucose metabolism.</p>
        <h4 class="mt-4 mb-3 fw-bold">3. Monitor Blood Sugar Levels</h4>
        <p>Keeping a close eye on your glucose readings helps you understand how different foods, exercises, and medications affect your blood sugar. Track your results to share with your medical team for tailored health adjustments.</p>
        <h4 class="mt-4 mb-3 fw-bold">4. Manage Stress Effectively</h4>
        <p>Chronic stress can trigger hormones that elevate blood sugar levels. Incorporate stress-reduction techniques into your daily life, such as mindfulness meditation, deep breathing exercises, or engaging in hobbies you enjoy.</p>
        <h4 class="mt-4 mb-3 fw-bold">5. Get Adequate Sleep</h4>
        <p>Poor sleep quality can disrupt hormones related to appetite and insulin sensitivity. Aim for 7-9 hours of restful sleep each night. Establish a consistent sleep schedule and create a relaxing bedtime routine to improve your overall sleep hygiene.</p>
        """
    },
    {
        "title": "The Hidden Benefits of Daily Hydration",
        "excerpt": "Water does more than just quench your thirst. Learn how proper hydration impacts your immune system and skin health.",
        "category": "Wellness",
        "image": "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "date": "May 28, 2026",
        "author": "Mark Rutherford",
        "content": """
        <p class="lead text-muted mb-4">Water does more than just quench your thirst. Learn how proper hydration impacts your immune system and skin health.</p>
        <p>We all know we should drink more water, but understanding exactly why can provide the motivation needed to stay consistently hydrated. Beyond simple thirst quenching, water is the lifeblood of nearly every bodily function.</p>
        <h4 class="mt-4 mb-3 fw-bold">Boosts Cognitive Function</h4>
        <p>Even mild dehydration can impair cognitive performance, leading to difficulties with concentration, memory, and mood regulation. Staying hydrated keeps your brain functioning optimally, improving focus and mental clarity throughout the day.</p>
        <h4 class="mt-4 mb-3 fw-bold">Enhances Skin Health</h4>
        <p>Your skin is an organ, and like any other organ, it requires water to function properly. Adequate hydration helps maintain skin elasticity, reduces the appearance of fine lines, and promotes a healthy, radiant complexion by flushing out toxins.</p>
        <h4 class="mt-4 mb-3 fw-bold">Supports Digestive Efficiency</h4>
        <p>Water is essential for healthy digestion. It helps break down food, allowing your body to absorb nutrients effectively. Moreover, it prevents constipation by softening stools and keeping the digestive tract running smoothly.</p>
        """
    },
    {
        "title": "Heart-Healthy Superfoods You Need in Your Pantry",
        "excerpt": "Boost your cardiovascular health by incorporating these 10 delicious superfoods into your daily diet.",
        "category": "Heart Health",
        "image": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "date": "May 25, 2026",
        "author": "Emily Chen, RD",
        "content": """
        <p class="lead text-muted mb-4">Boost your cardiovascular health by incorporating these delicious superfoods into your daily diet.</p>
        <p>Cardiovascular disease remains a leading health concern globally, but your diet plays a massive role in protecting your heart. Adding nutrient-rich superfoods to your pantry can help lower blood pressure, reduce bad cholesterol, and prevent inflammation.</p>
        <h4 class="mt-4 mb-3 fw-bold">1. Leafy Green Vegetables</h4>
        <p>Spinach, kale, and collard greens are famous for their high concentration of vitamins, minerals, and antioxidants. They are a rich source of vitamin K, which helps protect your arteries and promote proper blood clotting.</p>
        <h4 class="mt-4 mb-3 fw-bold">2. Berries</h4>
        <p>Strawberries, blueberries, blackberries, and raspberries are packed with important nutrients that play a central role in heart health. Berries are also rich in antioxidants like anthocyanins, which protect against the oxidative stress and inflammation that contribute to heart disease.</p>
        """
    },
    {
        "title": "Demystifying Vitamins: What Do You Actually Need?",
        "excerpt": "With so many supplements on the market, it is hard to know what works. We break down the essential vitamins.",
        "category": "Nutrition",
        "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "date": "May 20, 2026",
        "author": "Dr. Alan Peterson",
        "content": """
        <p class="lead text-muted mb-4">With so many supplements on the market, it is hard to know what works. We break down the essential vitamins.</p>
        <p>Walk down any pharmacy aisle, and you'll find hundreds of vitamins, minerals, and dietary supplements. But does the average person actually need them? Understanding the core micronutrients can help you focus on what is essential.</p>
        <h4 class="mt-4 mb-3 fw-bold">Focus on Whole Foods First</h4>
        <p>The human body absorbs vitamins and minerals most efficiently from whole food sources. A well-rounded diet containing fruits, vegetables, grains, and proteins generally provides all the essential vitamins you need without any supplements.</p>
        <h4 class="mt-4 mb-3 fw-bold">Key Supplements Worth Considering</h4>
        <p>Some populations may benefit from targeted supplements. For example, Vitamin D is commonly recommended for individuals living in areas with limited sunlight, while Vitamin B12 is essential for strict vegans and vegetarians since it is primarily found in animal products.</p>
        """
    },
    {
        "title": "Safe Exercising Guidelines for Seniors",
        "excerpt": "Staying active is crucial as we age. Here is a comprehensive guide to safe, low-impact workouts.",
        "category": "Fitness",
        "image": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "date": "May 15, 2026",
        "author": "Coach Miller",
        "content": """
        <p class="lead text-muted mb-4">Staying active is crucial as we age. Here is a comprehensive guide to safe, low-impact workouts.</p>
        <p>Physical activity is a vital component of healthy aging. Regular exercise helps maintain muscle mass, increases flexibility, improves balance to prevent falls, and boosts cardiovascular endurance.</p>
        <h4 class="mt-4 mb-3 fw-bold">Low-Impact Cardiovascular Workouts</h4>
        <p>Activities such as brisk walking, swimming, and water aerobics are excellent for senior health. They provide cardiovascular conditioning while minimizing impact stress on the joints, reducing the risk of arthritis flare-ups or skeletal injuries.</p>
        <h4 class="mt-4 mb-3 fw-bold">Importance of Strength and Balance Training</h4>
        <p>Incorporating light resistance training with bands or light weights helps maintain bone density and muscle mass. Gentle balance exercises (like Tai Chi or heel-to-toe walking) are critical to building core stability and prevent accidental slips.</p>
        """
    },
    {
        "title": "Understanding Sleep Hygiene for Better Mental Health",
        "excerpt": "Your sleep quality directly affects your mood. Learn how to optimize your bedroom environment for deep sleep.",
        "category": "Wellness",
        "image": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "date": "May 10, 2026",
        "author": "Dr. Sarah Jenkins",
        "content": """
        <p class="lead text-muted mb-4">Your sleep quality directly affects your mood. Learn how to optimize your bedroom environment for deep sleep.</p>
        <p>Sleep hygiene refers to healthy sleep habits that improve your ability to fall asleep and stay asleep. Since sleep quality is directly tied to cognitive function, mood stability, and immune defense, practicing good sleep hygiene is a cornerstone of mental wellness.</p>
        <h4 class="mt-4 mb-3 fw-bold">Establish a Consistent Sleep Schedule</h4>
        <p>Go to bed and wake up at the same time every day, even on weekends. Consistency reinforces your body's natural sleep-wake cycle (circadian rhythm), making it easier to fall asleep and wake up naturally.</p>
        <h4 class="mt-4 mb-3 fw-bold">Optimize Your Sleeping Environment</h4>
        <p>Keep your bedroom dark, quiet, and cool (ideally around 65°F or 18°C). Limit exposure to electronic devices, screens, and blue light for at least an hour before bedtime, as this light suppresses the production of melatonin, the sleep hormone.</p>
        """
    }
]

print("Seeding blogs...")
for idx, blog in enumerate(blogs_data, 1):
    blog["id"] = get_next_id("blogs")
    blog["author_id"] = 1
    blog["created_at"] = datetime.datetime.utcnow()
    db.blogs.insert_one(blog)
print(f"Seeded {len(blogs_data)} blogs.")

print(f"Seeding complete! Loaded {len(products_data)} products.")
