from .db import db, environment, SCHEMA, add_prefix_for_prod

class GalleryFavorite(db.Model):
    __tablename__='galleries_favorites'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    gallery_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('galleries.id')))

    user = db.relationship('User', back_populates='favorite_galleries')
    gallery = db.relationship('Gallery', back_populates='favorited_by')


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'gallery_id': self.gallery_id
        }
