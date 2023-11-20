from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import DateTime
from sqlalchemy.sql import func


class Gallery(db.Model):
    __tablename__ = "galleries"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(1000), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    status = db.Column(db.Boolean)
    gallery_img = db.Column(db.String(255))
    created_at = db.Column(DateTime, default=func.now())
    updated_at = db.Column(DateTime, default=func.now(), onupdate=func.now())

    user = db.relationship(
        "User", back_populates="galleries"
    )

    favorited_by = db.relationship(
        'GalleryFavorite', back_populates='gallery', cascade='all, delete-orphan'
    )

    visited_by = db.relationship(
        'VisitedGallery', back_populates='gallery', cascade='all, delete-orphan'
    )

    def to_dict(self):
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "title": self.title,
            "description": self.description,
            "location": self.location,
            "status": self.status,
            "gallery_img": self.gallery_img,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
