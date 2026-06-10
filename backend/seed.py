import random
import re
from .database import db, get_next_id
from .auth import get_password_hash

def slugify(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = re.sub(r'(^-|-$)', '', text)
    return text


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
    "email": "admin@thecheappharma.com",
    "phone_number": "1234567890",
    "hashed_password": admin_hashed_password,
    "is_active": True,
    "id": get_next_id("users")
}
db.users.insert_one(admin_user)
print("Admin user seeded.")

products_data = [
    {
        "name": "Small Caltrops (Gokshura) + Cutch Tree (Puga) + Three-leaved Caper (Varuna)",
        "brand": "Himalaya Herbal",
        "category": "Herbal Products",
        "price": 19.99,
        "image_url": "https://images.unsplash.com/photo-1611079830811-865faf673641?auto=format&fit=crop&w=400&q=80",
        "description": "A natural herbal formulation designed to support prostate health, kidney function, and healthy urinary tract dynamics.",
        "dosage": "Take 1 tablet twice daily after meals, or as directed by your healthcare professional.",
        "side_effects": "Generally well tolerated. No common side effects reported when taken at recommended dosages.",
        "uses": "Supports benign prostatic hyperplasia (BPH) management and normal, healthy urinary tract function."
    },
    {
        "name": "A natural Moisturizer",
        "brand": "Organic Wellness",
        "category": "Beauty & Skin Care",
        "price": 14.50,
        "image_url": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=400&q=80",
        "description": "An organic, deeply hydrating lotion crafted with natural ingredients for smooth, radiant, and healthy-looking skin.",
        "dosage": "Apply gently over face and body morning and night, or as needed on dry areas.",
        "side_effects": "Extremely well tolerated. Rare cases of mild allergic skin reaction or irritation.",
        "uses": "Nourishes, hydrates, and protects dry, sensitive, or compromised skin barrier."
    },
    {
        "name": "Abacavir + Lamivudine",
        "brand": "Cipla",
        "category": "HIV & Herpes",
        "price": 125.00,
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
        "description": "A combination prescription antiretroviral drug used with other medications to control HIV-1 infection.",
        "dosage": "Take 1 tablet daily with or without food, exactly as prescribed by your HIV specialist.",
        "side_effects": "Hypersensitivity reaction, nausea, fatigue, headache, diarrhea, insomnia.",
        "uses": "Management of HIV-1 infection in combination with other antiretroviral agents."
    },
    {
        "name": "Abacavir Sulphate",
        "brand": "ViiV Healthcare",
        "category": "HIV & Herpes",
        "price": 90.00,
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
        "description": "Antiretroviral nucleoside reverse transcriptase inhibitor (NRTI) for the treatment of HIV-1.",
        "dosage": "Take 300mg twice daily or 600mg once daily, with or without food.",
        "side_effects": "Serious hypersensitivity reactions (check for HLA-B*5701 allele), lactic acidosis, severe hepatomegaly.",
        "uses": "Indicated in combination with other antiretroviral agents for the treatment of HIV-1 infection."
    },
    {
        "name": "Abatacept",
        "brand": "Bristol-Myers Squibb",
        "category": "Pain Relief",
        "price": 350.00,
        "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
        "description": "An injectable selective costimulation modulator that helps control joint damage and severe pain in arthritis.",
        "dosage": "Administered via weekly subcutaneous injection or monthly intravenous infusion under medical supervision.",
        "side_effects": "Headache, upper respiratory tract infections, nasopharyngitis, nausea, increased risk of serious infections.",
        "uses": "Reduces signs and symptoms of moderate to severe rheumatoid arthritis, psoriatic arthritis, and juvenile idiopathic arthritis."
    },
    {
        "name": "Abiraterone Acetate",
        "brand": "Janssen",
        "category": "Anti Cancer",
        "price": 299.99,
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
        "description": "Oral androgen biosynthesis inhibitor for treatment of prostate cancer in combination with prednisone.",
        "dosage": "Take 1,000mg (two 500mg tablets or four 250mg tablets) once daily on an empty stomach.",
        "side_effects": "Joint swelling or pain, hypokalemia, hypertension, hot flashes, diarrhea, edema.",
        "uses": "Treatment of metastatic castration-resistant prostate cancer (mCRPC) and metastatic high-risk castration-sensitive prostate cancer."
    },
    {
        "name": "Acamprosate",
        "brand": "Forest Pharma",
        "category": "Alcohol & Drug Treatment",
        "price": 48.00,
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
        "description": "A prescription medication designed to help maintain alcohol abstinence in patients with alcohol dependence.",
        "dosage": "Take 666mg (two 333mg tablets) three times daily with meals, or as directed.",
        "side_effects": "Diarrhea, flatulence, nausea, anxiety, itching, insomnia.",
        "uses": "Maintenance of abstinence from alcohol in patients with alcohol dependence who are abstinent at treatment initiation."
    },
    {
        "name": "Acarbose",
        "brand": "Bayer",
        "category": "Diabetes",
        "price": 24.90,
        "image_url": "https://images.unsplash.com/photo-1628595308585-6499bc7b26d8?auto=format&fit=crop&w=400&q=80",
        "description": "Oral alpha-glucosidase inhibitor that delays glucose absorption to lower post-meal blood sugar levels.",
        "dosage": "Take 50mg or 100mg three times daily with the first bite of each main meal.",
        "side_effects": "Flatulence, abdominal pain, diarrhea, elevated liver transaminases.",
        "uses": "Adjunct to diet and exercise to improve glycemic control in adults with type 2 diabetes mellitus."
    },
    {
        "name": "Acarbose + Metformin",
        "brand": "Abbott",
        "category": "Diabetes",
        "price": 38.50,
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
        "description": "Dual-action combination medication designed to manage fasting and post-meal blood sugar levels effectively.",
        "dosage": "Take 1 tablet twice daily with main meals as directed by your physician.",
        "side_effects": "Flatulence, diarrhea, abdominal discomfort, metallic taste, nausea.",
        "uses": "Improves glycemic control in adults with type 2 diabetes when single agents are insufficient."
    },
    {
        "name": "Acebrophylline",
        "brand": "Lupin",
        "category": "Asthma",
        "price": 21.00,
        "image_url": "https://images.unsplash.com/photo-1563486859-045b7c48fe5e?auto=format&fit=crop&w=400&q=80",
        "description": "An airway-dilating and mucus-regulating treatment that eases breathing in chronic lung disorders.",
        "dosage": "Take 100mg capsule twice daily after meals.",
        "side_effects": "Heartburn, abdominal discomfort, nausea, headache, dizziness.",
        "uses": "Bronchial asthma, chronic obstructive pulmonary disease (COPD), and bronchitis."
    },
    {
        "name": "Aceclofenac + Paracetamol / Acetaminophen",
        "brand": "Alkem",
        "category": "Pain Relief",
        "price": 15.50,
        "image_url": "https://images.unsplash.com/photo-1628595308585-6499bc7b26d8?auto=format&fit=crop&w=400&q=80",
        "description": "Highly effective analgesic and anti-inflammatory combination for treating severe joint and muscle pain.",
        "dosage": "Take 1 tablet twice daily after meals with a full glass of water.",
        "side_effects": "Indigestion, heartburn, stomach pain, nausea, dizziness.",
        "uses": "Relief of pain and inflammation in osteoarthritis, rheumatoid arthritis, and ankylosing spondylitis."
    },
    {
        "name": "Acetazolamide",
        "brand": "Pfizer",
        "category": "Eye Care",
        "price": 29.99,
        "image_url": "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=400&q=80",
        "description": "A carbonic anhydrase inhibitor that lowers fluid pressure inside the eyes of glaucoma patients.",
        "dosage": "Take 250mg to 1,000mg daily in divided doses, or as directed by your ophthalmologist.",
        "side_effects": "Numbness or tingling in limbs, increased urination, metallic taste, hearing changes.",
        "uses": "Reduction of intraocular pressure in open-angle, secondary, and acute angle-closure glaucoma."
    },
    {
        "name": "Acetylcysteine",
        "brand": "Zambon",
        "category": "Asthma",
        "price": 18.99,
        "image_url": "https://images.unsplash.com/photo-1563486859-045b7c48fe5e?auto=format&fit=crop&w=400&q=80",
        "description": "A powerful mucolytic drug that thins and loosens sticky mucus in bronchial chest congestion.",
        "dosage": "Dissolve 1 effervescent tablet (600mg) in a glass of water once daily, preferably in the morning.",
        "side_effects": "Nausea, vomiting, diarrhea, runny nose, rare allergic reactions.",
        "uses": "Adjuvant therapy in patients with abnormal, viscid, or inspissated mucus secretions in chronic bronchopulmonary disorders."
    },
    {
        "name": "Acitretin",
        "brand": "Stiefel",
        "category": "Acne",
        "price": 85.00,
        "image_url": "https://images.unsplash.com/photo-1626600983616-52c6f14bbad5?auto=format&fit=crop&w=400&q=80",
        "description": "Oral systemic retinoid used for severe, resistant forms of psoriasis and kerato-dermatological disorders.",
        "dosage": "Take 25mg daily with a main meal. Strictly monitor blood lipid and liver tests as directed.",
        "side_effects": "Extreme dry lips, skin peeling, hair thinning, muscle/joint pain, dry eyes, high birth defect risk.",
        "uses": "Treatment of severe psoriasis, including plaque, pustular, and erythrodermic psoriasis."
    },
    {
        "name": "Acyclovir",
        "brand": "Sandoz",
        "category": "HIV & Herpes",
        "price": 32.00,
        "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80",
        "description": "A synthetic nucleoside analogue antiviral drug used to treat infections caused by herpes simplex viruses.",
        "dosage": "Take 200mg to 800mg 3 to 5 times daily, depending on the infection, for 5 to 10 days.",
        "side_effects": "Nausea, headache, vomiting, diarrhea, abdominal pain.",
        "uses": "Treatment of herpes simplex infections (genital herpes, cold sores), shingles, and chickenpox."
    },
    {
        "name": "Acyclovir Topical",
        "brand": "Zovirax",
        "category": "HIV & Herpes",
        "price": 19.50,
        "image_url": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=400&q=80",
        "description": "Topical antiviral formulation designed to accelerate the healing of recurrent herpes cold sore lesions.",
        "dosage": "Apply a thin layer to the affected area 5 times daily for 4 to 10 days.",
        "side_effects": "Mild burning, stinging, dry lips, skin flaking.",
        "uses": "Treatment of recurrent herpes labialis (cold sores) in adults and adolescents."
    },
    {
        "name": "Adapalene",
        "brand": "Galderma",
        "category": "Acne",
        "price": 26.00,
        "image_url": "https://images.unsplash.com/photo-1626600983616-52c6f14bbad5?auto=format&fit=crop&w=400&q=80",
        "description": "A third-generation topical retinoid gel that unclogs pores, clears acne blemishes, and prevents breakouts.",
        "dosage": "Apply a thin film once daily to the entire affected area after washing at bedtime.",
        "side_effects": "Dryness, skin scaling, erythema, burning sensation, skin irritation.",
        "uses": "Topical treatment of acne vulgaris in patients 12 years of age and older."
    },
    {
        "name": "Adapalene Topical + Clindamycin Topical",
        "brand": "Glenmark",
        "category": "Acne",
        "price": 34.00,
        "image_url": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=400&q=80",
        "description": "Synergistic combination of a topical retinoid and lincosamide antibiotic to combat inflammatory acne.",
        "dosage": "Apply a thin layer once daily at night to clean, dry, affected skin.",
        "side_effects": "Scaling, dry skin, burning, redness, skin peeling.",
        "uses": "Treatment of acne vulgaris characterized by inflammatory papules, pustules, and comedones."
    },
    {
        "name": "Adefovir",
        "brand": "Gilead Sciences",
        "category": "HIV & Herpes",
        "price": 110.00,
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
        "description": "An orally active nucleotide analog reverse transcriptase inhibitor for chronic Hepatitis B treatment.",
        "dosage": "Take 10mg once daily with or without food. Monitor renal function closely.",
        "side_effects": "Asthenia, headache, abdominal pain, nausea, nephrotoxicity risk.",
        "uses": "Treatment of chronic hepatitis B in adults with evidence of active viral replication."
    },
    {
        "name": "Afatinib Dimaleate",
        "brand": "Boehringer Ingelheim",
        "category": "Anti Cancer",
        "price": 320.00,
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
        "description": "A targeted prescription kinase inhibitor used to treat metastatic non-small cell lung cancer with EGFR mutations.",
        "dosage": "Take 40mg once daily on an empty stomach (1 hour before or 2 hours after meals).",
        "side_effects": "Diarrhea, rash, dry skin, nail infections (paronychia), mouth sores.",
        "uses": "Treatment of patients with metastatic NSCLC whose tumors have non-resistant EGFR mutations."
    },
    {
        "name": "Albendazole",
        "brand": "GSK",
        "category": "Anthelmintic & Anti-worm",
        "price": 12.00,
        "image_url": "https://images.unsplash.com/photo-1628595308585-6499bc7b26d8?auto=format&fit=crop&w=400&q=80",
        "description": "Broad-spectrum anthelmintic agent that eradicates multiple types of intestinal and systemic parasitic worms.",
        "dosage": "Take a single dose of 400mg with a fatty meal. Chew the tablet completely before swallowing.",
        "side_effects": "Headache, elevated liver enzymes, abdominal pain, nausea, dizziness.",
        "uses": "Treatment of parenchymal neurocysticercosis, hydatid disease, pinworms, and roundworms."
    },
    {
        "name": "Alectinib",
        "brand": "Genentech",
        "category": "Anti Cancer",
        "price": 350.00,
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
        "description": "A highly selective target inhibitor used to treat ALK-positive metastatic non-small cell lung cancer.",
        "dosage": "Take 600mg (four 150mg capsules) twice daily with food. Swallow capsules whole.",
        "side_effects": "Constipation, edema, fatigue, muscle pain, anemia, elevated liver enzymes.",
        "uses": "First-line or subsequent treatment of patients with ALK-positive metastatic NSCLC."
    },
    {
        "name": "Alendronate Sodium",
        "brand": "Merck",
        "category": "Osteoporosis",
        "price": 42.00,
        "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80",
        "description": "A bisphosphonate bone resorption inhibitor that strengthens bone structure and prevents osteoporotic fractures.",
        "dosage": "Take 70mg once weekly with plain water immediately upon waking, at least 30 minutes before food/drink.",
        "side_effects": "Acid reflux, esophagus irritation, stomach pain, nausea, joint or muscle pain.",
        "uses": "Treatment and prevention of osteoporosis in postmenopausal women and to increase bone mass in men."
    },
    {
        "name": "Alfacalcidol",
        "brand": "Leo Pharma",
        "category": "Osteoporosis",
        "price": 31.00,
        "image_url": "https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?auto=format&fit=crop&w=400&q=80",
        "description": "An active Vitamin D analogue that regulates calcium metabolism, critical for bone mineralization and density.",
        "dosage": "Take 0.5mcg to 1mcg daily, or as directed. Regularly monitor blood calcium and phosphate levels.",
        "side_effects": "Hypercalcemia, headache, nausea, dry mouth, constipation, weakness.",
        "uses": "Treatment of osteoporosis, renal osteodystrophy, and hypoparathyroidism."
    },
    {
        "name": "Alfuzosin",
        "brand": "Sanofi",
        "category": "Bladder & Prostate",
        "price": 45.00,
        "image_url": "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=400&q=80",
        "description": "An alpha-1 blocker that relaxes prostate and bladder muscles, facilitating easier urination in men with BPH.",
        "dosage": "Take 10mg once daily immediately after dinner or the same meal each day.",
        "side_effects": "Dizziness, headache, fatigue, nasal congestion, respiratory tract infection.",
        "uses": "Treatment of moderate to severe symptoms of benign prostatic hyperplasia (BPH) in men."
    },
    {
        "name": "All Trans Retinoic Acid (Tretinoin)",
        "brand": "Roche",
        "category": "Acne",
        "price": 89.00,
        "image_url": "https://images.unsplash.com/photo-1626600983616-52c6f14bbad5?auto=format&fit=crop&w=400&q=80",
        "description": "Powerful retinoid formulation used topically for severe acne control and clinically proven skin rejuvenation.",
        "dosage": "Apply a small pea-sized amount to clean dry skin once daily at bedtime.",
        "side_effects": "Skin peeling, erythema, scaling, burning sensation, increased sun sensitivity.",
        "uses": "Topical treatment of acne vulgaris and reduction of fine facial wrinkles."
    }
]

# Real Categories to seed
categories_to_seed = [
    "Men's Health",
    "The Blue Pill (Sildenafil)",
    "Tadalafil",
    "Vardenafil",
    "Climax Spray",
    "Generic Viagra",
    "Vidalista",
    "Cenforce",
    "Tadarise",
    "Herbal Products",
    "Fildena",
    "Cernos",
    "ED-Jelly",
    "Kamagra",
    "Chewable",
    "Levitra",
    "Suhagra",
    "Malegra",
    "Filagra",
    "Zenegra",
    "Vigora",
    "Phallus Power",
    "Shilajit",
    "Anti Cancer",
    "Breast Cancer",
    "Women's Health",
    "Female Viagra",
    "Osteoporosis",
    "Eye Care",
    "Eye Drop",
    "Eye Ointment & Gel",
    "Eye Care Capsules",
    "Eye Care Tablets",
    "Eye Injections",
    "HIV & Herpes",
    "Shop all",
    "Acid reducers",
    "Acne",
    "Alcohol & Drug Treatment",
    "Allergy",
    "Alpha Blockers",
    "Alzheimers",
    "Antibiotics",
    "Anti Amebics",
    "Anti Convulsant",
    "Anti Coagulants",
    "Anti Emetic",
    "Anti Migraine",
    "Angina Pectoris Anti-Anginals",
    "Antifungal",
    "Anti Parkinsonian",
    "Anti Viral",
    "Anthelmintic & Anti-worm",
    "Birth Control",
    "Bladder & Prostate",
    "Beauty & Skin Care",
    "Diabetes",
    "Gastro Health",
    "Heart & Blood Pressure",
    "Hair Loss",
    "Herbal",
    "Lip Care",
    "Baby Care",
    "Immune Booster",
    "Infertility Therapy",
    "Others",
    "Pain Relief",
    "Arthritis",
    "Asthma",
    "Weight Loss",
    "Exclusive Products",
    "Bestseller Products",
    "Featured Products",
    "Joint pain"
]

print("Seeding categories...")
for cat_name in categories_to_seed:
    cat_doc = {
        "name": cat_name,
        "description": f"Medicines and treatments related to {cat_name}.",
        "id": get_next_id("categories")
    }
    db.categories.insert_one(cat_doc)
print(f"Seeded {len(categories_to_seed)} categories.")

def generate_pack_sizes(category, name, base_price):
    name_lower = name.lower()
    
    if category == "Beauty & Skin Care" or "cream" in name_lower or "gel" in name_lower or "lotion" in name_lower:
        unit = "Tube"
        quantities = [1, 2, 3]
    elif category == "Eye Care" or "Eye Drop" in category or "drops" in name_lower:
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
    if 'gokshura' in lowercaseName: return 'Gokshura / Puga / Varuna'
    if 'moisturizer' in lowercaseName: return 'Natural Emollients'
    if 'abacavir' in lowercaseName and 'lamivudine' in lowercaseName: return 'Abacavir / Lamivudine'
    if 'abacavir sulphate' in lowercaseName or 'abacavir' in lowercaseName: return 'Abacavir Sulfate'
    if 'abatacept' in lowercaseName: return 'Abatacept'
    if 'abiraterone' in lowercaseName: return 'Abiraterone Acetate'
    if 'acamprosate' in lowercaseName: return 'Acamprosate'
    if 'acarbose' in lowercaseName and 'metformin' in lowercaseName: return 'Acarbose / Metformin'
    if 'acarbose' in lowercaseName: return 'Acarbose'
    if 'acebrophylline' in lowercaseName: return 'Acebrophylline'
    if 'aceclofenac' in lowercaseName: return 'Aceclofenac / Paracetamol'
    if 'acetazolamide' in lowercaseName: return 'Acetazolamide'
    if 'acetylcysteine' in lowercaseName: return 'Acetylcysteine'
    if 'acitretin' in lowercaseName: return 'Acitretin'
    if 'acyclovir topical' in lowercaseName: return 'Acyclovir Topical'
    if 'acyclovir' in lowercaseName: return 'Acyclovir'
    if 'adapalene' in lowercaseName and 'clindamycin' in lowercaseName: return 'Adapalene / Clindamycin'
    if 'adapalene' in lowercaseName: return 'Adapalene'
    if 'adefovir' in lowercaseName: return 'Adefovir'
    if 'afatinib' in lowercaseName: return 'Afatinib Dimaleate'
    if 'albendazole' in lowercaseName: return 'Albendazole'
    if 'alectinib' in lowercaseName: return 'Alectinib'
    if 'alendronate' in lowercaseName: return 'Alendronate Sodium'
    if 'alfacalcidol' in lowercaseName: return 'Alfacalcidol'
    if 'alfuzosin' in lowercaseName: return 'Alfuzosin'
    if 'tretinoin' in lowercaseName or 'retinoic' in lowercaseName: return 'Tretinoin'
    return 'Active Pharmaceutical Ingredient'

print("Seeding dummy products...")

authors_data = [
    {
        "slug": "sarah-jenkins",
        "name": "Dr. Sarah Jenkins",
        "role": "Chief Clinical Officer & Medical Review Board Chair (MD, PhD, FACP)",
        "badge": "Medical Expert Board Chair",
        "educationShort": "Doctor of Medicine (MD) - Harvard Medical School, PhD in Pharmacology - MIT",
        "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400",
        "aboutSub": "Certified Clinical Pharmacologist & Internal Medicine Specialist",
        "educationList": [
            "Doctor of Medicine (MD) with Honors – Harvard Medical School",
            "PhD in Molecular Pharmacology – Massachusetts Institute of Technology (MIT)",
            "Residency in Internal Medicine – Brigham and Women's Hospital",
            "Fellowship in Clinical Pharmacology & Therapeutics – Johns Hopkins University School of Medicine"
        ],
        "bioParagraphs": [
            "Dr. Sarah Jenkins is a board-certified internist, clinical pharmacologist, and the chair of the Medical Review Board at Medicare. With over 15 years of experience in academic medicine and clinical research, Dr. Jenkins oversaw drug safety monitoring, clinical trial protocols, and evidence-based pharmaceutical evaluations at Brigham and Women's Hospital and Johns Hopkins Medicine.",
            "Her clinical expertise focuses on cardiovascular pharmacology, geriatric pharmacotherapy, and drug-drug interaction safety. At Medicare, Dr. Jenkins directs the clinical review process, ensuring that every product description, safety warning, and medical recommendation is rigorously vetted against the latest FDA approvals, peer-reviewed clinical guidelines, and standard prescribing practices. Her mission is to ensure that patients have access to transparent, medically accurate information to make safe, informed choices about their prescription and over-the-counter care."
        ],
        "research": "Lead Investigator, Clinical Trial on Cardiovascular Outcomes of Novel Antihypertensive Regimens, Johns Hopkins Division of Clinical Pharmacology, 2014 – 2018.",
        "grants": [
            "R01 Research Grant – National Heart, Lung, and Blood Institute (NHLBI)",
            "Clinical Investigator Development Award – National Institutes of Health (NIH)",
            "Independent Research Fellowship Grant – American Heart Association"
        ],
        "interests": "Precision Medicine, Cardiorenal Pharmacology, and Pharmacogenomic Applications in Primary Care.",
        "affiliations": [
            "Fellow of the American College of Physicians (FACP)",
            "American Society for Clinical Pharmacology and Therapeutics (ASCPT)",
            "American Medical Association (AMA)"
        ],
        "service": "Advisor, FDA Advisory Committee on Cardiovascular and Renal Drugs; Member of the USP (United States Pharmacopeia) Expert Committee.",
        "conclusion": "Dr. Sarah Jenkins utilizes her extensive clinical background in medicine and molecular pharmacology to ensure that Medicare's products and medical guides reflect the highest standards of safety, quality, and clinical integrity.",
        "isDoctor": True
    },
    {
        "slug": "david-vance",
        "name": "David Vance",
        "role": "Senior Medical Writer & Science Communicator (MS)",
        "badge": "Editorial Review Board Member",
        "educationShort": "MS in Science Writing - Johns Hopkins University, BS in Biochemistry",
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
        "aboutSub": "Healthcare Communications Specialist & Medical Editor",
        "educationList": [
            "Master of Science (MS) in Science & Medical Writing – Johns Hopkins University",
            "Bachelor of Science (BS) in Biochemistry – University of Michigan, Ann Arbor",
            "Active Member – American Medical Writers Association (AMWA)"
        ],
        "bioParagraphs": [
            "David Vance is a dedicated medical writer and editor with over 8 years of experience in translating clinical datasets, peer-reviewed medical journals, and regulatory documents into clear, patient-centric educational content. His work bridges the gap between complex pharmaceutical research and consumer health literacy.",
            "Prior to joining the Medicare editorial team, David served as a communications specialist for health systems and health technology platforms, creating evidence-based articles on chronic disease management, immunology, and preventive medicine. At Medicare, he ensures that all wellness articles, lifestyle guides, and medication guides are easy to understand, scientifically grounded, and free of medical jargon, empowering readers to take control of their health journeys."
        ],
        "research": "Contributing Researcher, Longitudinal Study on Digital Health Interventions for Patient Education and Adherence, University of Michigan Health System, 2016 – 2018.",
        "grants": [
            "Educational Grant – American Medical Writers Association (AMWA)",
            "Digital Health Literacy Project Fund – National Library of Medicine (NLM)"
        ],
        "interests": "Patient Health Literacy, Health Communication Strategies, and Digital Patient Engagement.",
        "affiliations": [
            "American Medical Writers Association (AMWA)",
            "Association of Health Care Journalists (AHCJ)"
        ],
        "service": "Volunteer Advisor, National Health Council (NHC) Committee on Health Literacy; Editor, AMWA Journal Review Board.",
        "conclusion": "David Vance is committed to translating complex clinical data into reliable, actionable, and easy-to-understand wellness content for Medicare's patients and readers.",
        "isDoctor": False
    },
    {
        "slug": "elena-rostova",
        "name": "Elena Rostova",
        "role": "Senior Clinical Pharmacist & Drug Safety Specialist (PharmD)",
        "badge": "Medical Review Board Member",
        "educationShort": "Doctor of Pharmacy (PharmD) - UCSF School of Pharmacy",
        "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400",
        "aboutSub": "Board-Certified Pharmacotherapy Specialist (BCPS)",
        "educationList": [
            "Doctor of Pharmacy (PharmD) – University of California, San Francisco (UCSF)",
            "Clinical Pharmacy Residency – UCSF Medical Center",
            "Bachelor of Science (BS) in Chemistry – Boston University"
        ],
        "bioParagraphs": [
            "Dr. Elena Rostova is a licensed pharmacist and drug safety expert with extensive experience in inpatient pharmacy management, clinical counseling, and therapeutic drug monitoring. She is a Board-Certified Pharmacotherapy Specialist (BCPS) and has practiced in several major medical centers across California.",
            "At Medicare, Dr. Rostova is responsible for verifying the accuracy of drug profiles, dosage guidelines, drug interaction profiles, and warning labels. She reviews clinical data to ensure that all information matches the latest guidelines from the FDA, CDC, and other major US medical boards. Her passion is helping patients understand their medication regimens, manage potential side effects, and optimize their treatment outcomes."
        ],
        "research": "Co-Investigator, Impact of Pharmacist-Led Medication Reconciliation on Hospital Readmission Rates, UCSF Medical Center, 2018 – 2020.",
        "grants": [
            "Clinical Practice Pharmacy Advancement Grant – California Society of Health-System Pharmacists (CSHP)",
            "Patient Safety Research Initiative Grant – American Society of Health-System Pharmacists (ASHP)"
        ],
        "interests": "Pharmacotherapy Optimization, Medication Safety and Error Prevention, and Patient Education.",
        "affiliations": [
            "American Society of Health-System Pharmacists (ASHP)",
            "American College of Clinical Pharmacy (ACCP)",
            "California Society of Health-System Pharmacists (CSHP)"
        ],
        "service": "Member, CSHP Professional Practice Committee; Clinical Preceptor, UCSF School of Pharmacy.",
        "conclusion": "Dr. Elena Rostova applies her comprehensive clinical pharmacy experience to review medication profiles and provide patients with safe, evidence-based guidelines on drug safety.",
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
        "slug": slugify(item["name"]),
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
        "rx_required": item["category"] in ['Antibiotics', 'Diabetes', 'Asthma', 'Blood Pressure', 'Men\'s Health', 'Women\'s Health', 'Anti Cancer', 'HIV & Herpes', 'Pain Relief'],
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
