from app.models import db, User, Gallery, GalleryFavorite, environment, SCHEMA
from sqlalchemy.sql import text
import random

def seed_galleries_favorites(num_favorites=50):
    # Get a list of all user and gallery IDs to randomly select from
    user_ids = [user.id for user in User.query.all()]
    gallery_ids = [gallery.id for gallery in Gallery.query.all()]

    for _ in range(num_favorites):
        user_id = random.choice(user_ids)
        gallery_id = random.choice(gallery_ids)

        favorite = GalleryFavorite(user_id=user_id, gallery_id=gallery_id)
        db.session.add(favorite)

    db.session.commit()

def undo_galleries_favorites():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.galleries_favorites RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM galleries_favorites"))

    db.session.commit()
