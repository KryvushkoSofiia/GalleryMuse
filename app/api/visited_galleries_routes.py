from flask import Blueprint
from app.models import db, Gallery, VisitedGallery
from flask_login import current_user, login_required

visited_galleries_routes = Blueprint('visited_galleries', __name__)

@visited_galleries_routes.route('/', methods=["GET"])

def get_visited_galleries():
    if current_user.is_authenticated:
        user_id = current_user.id
        visited_galleries = VisitedGallery.query.filter_by(user_id = user_id).all()
        response = [visited.to_dict() for visited in visited_galleries]
    return {'visited_galleries': response}


@visited_galleries_routes.route('/<int:gallery_id>', methods=['POST'])
@login_required
def add_gallery_to_visited(gallery_id):
    user_id = current_user.id

    existing_visited = VisitedGallery.query.filter_by(user_id=user_id, gallery_id=gallery_id).first()
    if existing_visited:
        return {'message': 'Gallery already in visited'}, 200
    else:
        new_visited = VisitedGallery(user_id=user_id, gallery_id=gallery_id)
        db.session.add(new_visited)
        db.session.commit()
        return {'message': 'Gallery added to visited'}, 201

@visited_galleries_routes.route('/<int:gallery_id>', methods=['DELETE'])
@login_required
def remove_gallery_from_visited(gallery_id):
    user_id = current_user.id

    # Check if the gallery is in the user's favorites
    existing_visited = VisitedGallery.query.filter_by(user_id=user_id, gallery_id=gallery_id).first()
    if existing_visited:
        # Gallery is in favorites, so remove it
        db.session.delete(existing_visited)
        db.session.commit()
        return {'message': 'Gallery removed from visited'}, 200
    else:
        return {'message': 'Gallery not in visited'}, 200


@visited_galleries_routes.route('/<int:favorite_id>', methods=['PUT'])
@login_required
def update_visited_status(favorite_id):
    user_id = current_user.id

    visited = VisitedGallery.query.filter_by(id=favorite_id, user_id=user_id).first()
    if visited:
        gallery_id = visited.gallery_id
        gallery = Gallery.query.get(gallery_id)

        if gallery:
            gallery.status = not gallery.status
            db.session.commit()
            return {'message': 'Gallery status updated successfully'}, 200
        else:
            return {'message': 'Gallery not found'}, 404
    else:
        return {'message': 'Gallery favorite not found'}, 404
