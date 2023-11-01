from flask import Blueprint, request
from app.models import db, GalleryFavorite
from flask_login import current_user

gallery_favorite_routes = Blueprint('galleries_favorites', __name__)

@gallery_favorite_routes.route('/')
def get_gallery_favorites():
    gallery_favorites = GalleryFavorite.query.all()
    response = [favorite.to_dict() for favorite in gallery_favorites]
    return {'galleries_favorites': response}
