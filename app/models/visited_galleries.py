from .db import db, environment, SCHEMA, add_prefix_for_prod

class VisitedGallery(db.Model):
    __tablename__='visited_galleries'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    gallery_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('galleries.id')))

    user = db.relationship('User', back_populates='visited_galleries')
    
    gallery = db.relationship('Gallery', back_populates='visited_by')


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'gallery_id': self.gallery_id
        }
