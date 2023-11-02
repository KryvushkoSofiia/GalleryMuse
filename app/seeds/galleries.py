from app.models import db, Gallery, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
import random

fake = Faker()

def seed_galleries(num_galleries=20):
    for _ in range(num_galleries):
        owner_id = random.randint(1, 20)
        title = fake.sentence()[:50]
        description = fake.paragraph()
        location = fake.city()
        status = random.choice([True, False]) 
        gallery_img = f'https://example.com/gallery/{random.randint(1, 100)}.jpg' 

        gallery = Gallery(
            owner_id=owner_id,
            title=title,
            description=description,
            location=location,
            status=status,
            gallery_img=gallery_img
        )
        db.session.add(gallery)

    db.session.commit()

def undo_galleries():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.galleries RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM galleries"))
        
    db.session.commit()
