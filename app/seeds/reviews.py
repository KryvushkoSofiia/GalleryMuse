from app.models import db, environment, SCHEMA, User, Gallery, Review
from sqlalchemy.sql import text
from random import randint
import random

from faker import Faker

fake = Faker()


def seed_reviews(num_reviews=100):
    user_ids = [user.id for user in User.query.all()]
    gallery_ids = [gallery.id for gallery in Gallery.query.all()]

    for _ in range(num_reviews):
        user_id = random.choice(user_ids)
        gallery_id = random.choice(gallery_ids)
        review = fake.paragraph()
        star_rating = randint(1, 5)

        review = Review(
            owner_id=user_id,
            gallery_id=gallery_id,
            review=review,
            star_rating=star_rating,
        )

        db.session.add(review)
    db.session.commit()


def undo_reviews():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM review"))

    db.session.commit()
