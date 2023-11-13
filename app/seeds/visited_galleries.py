from app.models import db, User, Gallery, VisitedGallery, environment, SCHEMA
from sqlalchemy.sql import text
import random

def seed_visited_galleries(num_visited=40):
    user_ids = [user.id for user in User.query.all()]
    gallery_ids = [gallery.id for gallery in Gallery.query.all()]

    for _ in range(num_visited):
        user_id = random.choice(user_ids)
        gallery_id = random.choice(gallery_ids)

        visited = VisitedGallery(user_id=user_id, gallery_id=gallery_id)
        db.session.add(visited)

    db.session.commit()

def undo_visited_galleries():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.visited_galleries RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM visited_galleries"))

    db.session.commit()
