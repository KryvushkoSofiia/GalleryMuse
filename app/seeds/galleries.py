from app.models import db, Gallery, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
import random
from app.api.aws_helpers import upload_file_to_s3

fake = Faker()

real_image_urls = [
    "https://d1nn9x4fgzyvn4.cloudfront.net/migration-slide-image/SC270875.jpg",
    "https://d1nn9x4fgzyvn4.cloudfront.net/migration-slide-image/SC270875.jpg",
]

def seed_galleries(num_galleries=20):
    for _ in range(num_galleries):
        owner_id = random.randint(1, 20)
        title = fake.sentence()[:50]
        description = fake.paragraph()
        location = fake.city()
        status = bool(random.choice([True, False]))

        # Choose a real image URL for seeding
        gallery_img = random.choice(real_image_urls)

        gallery = Gallery(
            owner_id=owner_id,
            title=title,
            description=description,
            location=location,
            status=status,
            gallery_img=gallery_img,
        )
        db.session.add(gallery)

    db.session.commit()

def undo_galleries():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.galleries RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM galleries"))

    db.session.commit()
