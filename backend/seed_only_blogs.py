import datetime
from backend.database import db, get_next_id

# Clear the blogs collection
print("Clearing blogs collection...")
db.blogs.delete_many({})

# Reset counters for blogs to 0 or delete it to let it start from 1
db.counters.delete_one({"_id": "blogs"})

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
print(f"Seeded {len(blogs_data)} blogs successfully into MongoDB.")
