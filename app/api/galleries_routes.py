from flask import Blueprint, request
from app.models import db, Gallery
from flask_login import current_user

galleries_routes = Blueprint('galleries', __name__)


@galleries_routes.route('/')
def all_galleries():
    galleries = Gallery.query.all()
    response = [gallery.to_dict() for gallery in galleries]
    return {'galleries': response}
