from flask import Blueprint, request
from app.models import db, Review
from flask_login import current_user, login_required
from app.forms.review_form import ReviewForm

# from flask_login import current_user, login_requested


reviews_routes = Blueprint("reviews", __name__)


@reviews_routes.route("/")
def all_reviews():
    reviews = Review.query.all()
    response = [review.to_dict() for review in reviews]
    return {"reviews": response}


@reviews_routes.route("/<int:reviewId>")
def single_review(reviewId):
    review = Review.query.get(reviewId).to_dict()

    if review is None:
        return {"error": "Review not found"}, 404

    return {"review": review}


@reviews_routes.route("/new", methods=["POST"])
@login_required
def create_review():
    form = ReviewForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        galleryId = request.json.get('galleryId')
        print('!!!**********************************Gallery Id', galleryId)
        review = Review(
            owner_id=current_user.id,
            gallery_id=galleryId,
            review=form.data["review"],
            star_rating=form.data["star_rating"],
        )
        db.session.add(review)
        db.session.commit()
        print("***********NEW****REVIEW", review)
        return review.to_dict(), 201
    else:
        return {"Errors": form.errors}

@reviews_routes.route("/update/<int:reviewId>", methods=["PUT"])
@login_required
def update_review(reviewId):
    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        print("Form is valid")

        review_to_update = Review.query.get(reviewId)
        review_to_update.review = form.data['review']
        review_to_update.star_rating = form.data['star_rating']

        db.session.commit()
        print("Review updated successfully.")
        return review_to_update.to_dict(), 201
    else:
        return {"Errors": form.errors}


@reviews_routes.route("<int:reviewId>", methods=["DELETE"])
@login_required
def delete_review(reviewId):
    review_to_delete = Review.query.get(reviewId)
    if delete_review:
        db.session.delete(review_to_delete)
        db.session.commit()
        return "Successful deletion"
    else:
        return "Error while trying to delete review"
