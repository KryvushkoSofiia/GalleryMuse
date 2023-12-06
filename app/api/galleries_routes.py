from flask import Blueprint, request
from app.models import db, Gallery
from app.forms.gallery_form import GalleryForm
from flask_login import current_user, login_required
from app.api.aws_helpers import (
    upload_file_to_s3, get_unique_filename, remove_file_from_s3)

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

    print("**************form", form.data)
    if form.validate_on_submit():
        # uploaded_file = request.files.get('gallery_img')
        # if uploaded_file:
        #     file_url = upload_file_to_s3(uploaded_file)
        # else:
        #     file_url = None

        image = form.data['gallery_img']
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)

        print("*******************UPLOAD", upload)
        image_url = upload.get('url')


        if image_url is None:
                return "Error: 'url' key not present in the upload dictionary"
        gallery = Gallery(
            owner_id=current_user.id,
            title=form.data['title'],
            description=form.data['description'],
            location=form.data['location'],
            status=form.data['status'],
            gallery_img=image_url,
        )
        db.session.add(gallery)
        db.session.commit()
        print(gallery)
        return gallery.to_dict(), 201
    else:
        return {"Errors": form.errors}

@galleries_routes.route('/update/<int:galleryId>', methods=['PUT'])
@login_required
def update_gallery(galleryId):
    form = GalleryForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        print("Form is valid.")


        gallery_to_update = Gallery.query.get(galleryId)

        # uploaded_file = request.files['gallery_img']
        uploaded_file = request.files.get('gallery_img')
        if uploaded_file:
            # remove_file_from_s3(gallery_to_update.gallery_img)
            # file_url = upload_file_to_s3(uploaded_file)
            # gallery_to_update.gallery_img = file_url
            remove_file_from_s3(gallery_to_update.gallery_img)
            image_url = upload_file_to_s3(uploaded_file).get('url')
            gallery_to_update.gallery_img = image_url
        # gallery_to_update.owner_id = int(current_user.id),
        print("*******CuRRent User*************",current_user.id) 
        gallery_to_update.title=form.data['title']
        gallery_to_update.description=form.data['description']
        gallery_to_update.location=form.data['location']
        gallery_to_update.status=form.data['status']
        # gallery_to_update.gallery_img=form.data['gallery_img']

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
        return 'Error while trying to delete gallery'
