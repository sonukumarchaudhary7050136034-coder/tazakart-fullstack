"""
Seed the database with categories, subcategories, sample products, and a default admin.
Run: python seed.py
"""
from app.database import SessionLocal, engine, Base
from app import models, auth

Base.metadata.create_all(bind=engine)
db = SessionLocal()

CATEGORY_DATA = [
    ("dairy-bread-eggs", "Dairy, Bread & Eggs", "🥛", ["Milk", "Bread & Pav", "Eggs", "Flakes & Kids Cereals", "Muesli & Granola", "Oats"]),
    ("paan-corner", "Paan Corner", "🍃", ["Paan", "Mouth Freshener"]),
    ("fruits-vegetables", "Fruits & Vegetables", "🥦", ["Fresh Fruits", "Fresh Vegetables"]),
    ("cold-drinks-juices", "Cold Drinks & Juices", "🥤", ["Soft Drinks", "Juices"]),
    ("snacks-munchies", "Snacks & Munchies", "🍿", ["Chips & Crisps", "Namkeen"]),
    ("breakfast-instant-food", "Breakfast & Instant Food", "🍳", ["Noodles", "Ready to Eat"]),
    ("sweet-tooth", "Sweet Tooth", "🍫", ["Chocolates", "Ice Cream"]),
    ("bakery-biscuits", "Bakery & Biscuits", "🍪", ["Biscuits", "Cakes & Rolls"]),
    ("tea-coffee-milk-drinks", "Tea, Coffee & Milk Drinks", "☕", ["Tea", "Coffee"]),
    ("atta-rice-dal", "Atta, Rice & Dal", "🌾", ["Atta & Flours", "Rice", "Dal & Pulses"]),
    ("masala-oil", "Masala, Oil & More", "🧂", ["Masala & Spices", "Edible Oil & Ghee"]),
    ("personal-care", "Personal Care", "🧴", ["Skin Care", "Hair Care"]),
]

PRODUCTS_FOR_DAIRY = [
    ("Fresh Toned Milk", "500 ml", 30, 32, "milk-1.svg", "Milk", 100),
    ("Full Cream Milk", "500 ml", 36, 38, "milk-2.svg", "Milk", 80),
    ("Lactose Free Milk", "250 ml", 26, 28, "milk-3.svg", "Milk", 45),
    ("A2 Cow Milk", "1 ltr", 77, 82, "milk-4.svg", "Milk", 0),
    ("Toned Milk Pouch", "500 ml", 30, 30, "milk-5.svg", "Milk", 60),
    ("Buffalo Milk", "500 ml", 40, 42, "milk-6.svg", "Milk", 25),
    ("Brown Bread", "400 g", 45, 48, "bread-1.svg", "Bread & Pav", 30),
    ("White Bread", "400 g", 40, 42, "bread-2.svg", "Bread & Pav", 30),
    ("Pav Buns", "6 pcs", 35, 38, "bread-3.svg", "Bread & Pav", 20),
    ("White Eggs", "6 pcs", 42, 45, "eggs-1.svg", "Eggs", 50),
    ("Brown Eggs", "12 pcs", 84, 90, "eggs-2.svg", "Eggs", 35),
    ("Corn Flakes", "475 g", 199, 220, "cereal-1.svg", "Flakes & Kids Cereals", 15),
    ("Chocolate Flakes", "250 g", 149, 160, "cereal-2.svg", "Flakes & Kids Cereals", 18),
    ("Fruit Muesli", "400 g", 249, 270, "muesli-1.svg", "Muesli & Granola", 12),
    ("Rolled Oats", "1 kg", 159, 175, "oats-1.svg", "Oats", 40),
]


def seed():
    if db.query(models.Category).count() > 0:
        print("Categories already seeded, skipping category/product seed.")
    else:
        for slug, name, icon, subs in CATEGORY_DATA:
            cat = models.Category(slug=slug, name=name, icon=icon)
            db.add(cat)
            db.flush()
            for sub_name in subs:
                sub_slug = sub_name.lower().replace(" & ", "-").replace(" ", "-")
                db.add(models.SubCategory(slug=sub_slug, name=sub_name, category_id=cat.id))
            db.flush()

            if slug == "dairy-bread-eggs":
                subs_map = {
                    s.name: s.id
                    for s in db.query(models.SubCategory).filter(models.SubCategory.category_id == cat.id).all()
                }
                for name_, unit, price, mrp, image, sub_name, stock in PRODUCTS_FOR_DAIRY:
                    db.add(
                        models.Product(
                            name=name_,
                            unit=unit,
                            price=price,
                            mrp=mrp,
                            image=f"/products/{image}",
                            stock=stock,
                            category_id=cat.id,
                            subcategory_id=subs_map.get(sub_name),
                        )
                    )
        db.commit()
        print(f"Seeded {len(CATEGORY_DATA)} categories and {len(PRODUCTS_FOR_DAIRY)} products.")

    if not db.query(models.Admin).filter(models.Admin.email == "admin@tazakart.com").first():
        db.add(
            models.Admin(
                name="TazaKart Admin",
                email="admin@tazakart.com",
                password_hash=auth.hash_password("Admin@123"),
            )
        )
        db.commit()
        print("Default admin created -> email: admin@tazakart.com | password: Admin@123")
    else:
        print("Default admin already exists.")


if __name__ == "__main__":
    seed()
    db.close()
