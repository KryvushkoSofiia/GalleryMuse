from flask import Blueprint, request
from app.models import db, GalleryFavorite
from flask_login import current_user, login_required

gallery_favorite_routes = Blueprint('galleries_favorites', __name__)

@gallery_favorite_routes.route('/')
# @login_required
def get_gallery_favorites():
    if current_user.is_authenticated:
        user_id = current_user.id
        print("************************user_id",user_id)
        gallery_favorites = GalleryFavorite.query.filter_by(user_id = user_id).all()
        response = [favorite.to_dict() for favorite in gallery_favorites]
    return {'galleries_favorites': response}
