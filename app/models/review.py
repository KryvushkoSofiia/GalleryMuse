from sqlalchemy import DateTime
from sqlalchemy.sql import func
from .db import db, environment, add_prefix_for_prod, SCHEMA


class Review(db.Model):
    __tablename__ = "reviews"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    gallery_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("galleries.id"))
    )
    review = db.Column(db.String(1000), nullable=False)
    star_rating = db.Column(db.Float(2, 1), nullable=False)
    created_at = db.Column(DateTime, default=func.now())
    updated_at = db.Column(DateTime, default=func.now(), onupdate=func.now())

    user = db.relationship("User", back_populates="reviews")

    gallery = db.relationship("Gallery", back_populates="gallery")

    def to_dict(self):
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "gallery_id": self.gallery_id,
            "review": self.review,
            "star_rating": self.star_rating,
            "created_at": self.created_at,
            "updated_at": self.updated_at   
        }
