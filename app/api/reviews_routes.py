from flask import Blueprint, request
from app.models import db, Review
from app.forms.review_form import ReviewForm
# from flask_login import current_user, login_requested


reviews_routes = Blueprint('reviews', __name__)

@reviews_routes.route('/')
def all_reviews():
    reviews = Review.query.all()
    response = [review.to_dict() for review in reviews]
    return {"reviews": response}

@reviews_routes.route('/<int:reviewId>')
def single_review(reviewId):
    review = Review.query.get(reviewId).to_dict()

    if review is None:
        return {"error": "Review not found"}, 404
    
    return {'review': review}


@reviews_routes.route('<int:reviewId>', methods=['DELETE'])
def delete_review(reviewId):
    review_to_delete = Review.query.get(reviewId)
    if delete_review:
        db.session.delete(review_to_delete)
        db.session.commit()
        return 'Successful deletion'
    else:
        return 'Error while trying to delete review'
