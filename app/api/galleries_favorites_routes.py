from flask import Blueprint, request
from app.models import db, GalleryFavorite
from flask_login import current_user, login_required

gallery_favorite_routes = Blueprint('galleries_favorites', __name__)

@gallery_favorite_routes.route('/', methods=['GET'])
# @login_required
def get_gallery_favorites():
    if current_user.is_authenticated:
        user_id = current_user.id
        print("************************user_id",user_id)
        gallery_favorites = GalleryFavorite.query.filter_by(user_id = user_id).all()
        response = [favorite.to_dict() for favorite in gallery_favorites]
    return {'galleries_favorites': response}
    
@gallery_favorite_routes.route('/<int:gallery_id>', methods=['POST'])
@login_required
def add_gallery_to_favorites(gallery_id):
    user_id = current_user.id

    # Check if the gallery is not already in the user's favorites
    existing_favorite = GalleryFavorite.query.filter_by(user_id=user_id, gallery_id=gallery_id).first()
    if existing_favorite:
        # Gallery is already in favorites, so remove it
        db.session.delete(existing_favorite)
        db.session.commit()
        return {'message': 'Gallery removed from favorites'}, 200
    else:
        # Gallery is not in favorites, add it
        new_favorite = GalleryFavorite(user_id=user_id, gallery_id=gallery_id)
        db.session.add(new_favorite)
        db.session.commit()
        return {'message': 'Gallery added to favorites'}, 201
