from flask import Blueprint, request
from app.models import db, Gallery
from app.forms.gallery_form import GalleryForm
from flask_login import current_user, login_required

galleries_routes = Blueprint('galleries', __name__)


@galleries_routes.route('/')
def all_galleries():
    galleries = Gallery.query.all()
    response = [gallery.to_dict() for gallery in galleries]
    return {'galleries': response}


@galleries_routes.route('/<int:galleryId>')
def single_gallery(galleryId):
    gallery = Gallery.query.get(galleryId).to_dict()

    if gallery is None:
        return {"error": "Gallery not found"}, 404
    
    return {'gallery': gallery}


@galleries_routes.route('/new', methods=['POST'])
@login_required
def create_gallery():
    form = GalleryForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        gallery = Gallery(
            owner_id=current_user.id,
            title=form.data['title'],
            description=form.data['description'],
            location=form.data['location'],
            status=form.data['status'],
            gallery_img=form.data['gallery_img'],
        )
        db.session.add(gallery)
        db.session.commit()
        print(gallery)
        return gallery.to_dict(), 201
    else:
        return {"Errors": form.errors}

@galleries_routes.route('/update/<int:galleryId>', methods=['PUT'])
# @login_required
def update_gallery(galleryId):
    form = GalleryForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        print("Form is valid.")
        gallery_to_update = Gallery.query.get(galleryId)

        # gallery_to_update.owner_id = int(current_user.id),
        print("*******CuRRent User*************",current_user.id) 
        gallery_to_update.title=form.data['title']
        gallery_to_update.description=form.data['description']
        gallery_to_update.location=form.data['location']
        gallery_to_update.status=form.data['status']
        gallery_to_update.gallery_img=form.data['gallery_img']

        db.session.commit()
        print("Gallery updated successfully.")
        return gallery_to_update.to_dict(), 201
    else:
        print("Form validation failed.")
        print(form.errors)
        return {"Errors": form.errors}
    

@galleries_routes.route('/<int:galleryId>', methods=['DELETE'])
# @login_required
def delete_gallery(galleryId):
    gallery_to_delete = Gallery.query.get(galleryId)
    if delete_gallery:
        db.session.delete(gallery_to_delete)
        db.session.commit()
        return 'Successful deletion'
    else:
        return 'Error while trying to delete'
