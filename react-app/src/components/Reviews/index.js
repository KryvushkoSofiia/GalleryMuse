import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { readReviewsThunk } from "../../store/reviews";

const Reviews = ({ galleryId }) => {
    console.log("gallery id", galleryId);
    const dispatch = useDispatch();
    const reviews = useSelector((state) => Object.values(state.reviews.reviews));
    const currentUser = useSelector((state) => state.session.user);

    useEffect(() => {
        dispatch(readReviewsThunk());
    }, [dispatch, reviews.length]);

    const galleryReviews = reviews.filter((review) => review.gallery_id == galleryId);
    let ratingSum = 0;
    galleryReviews.forEach((review) => ratingSum += parseFloat(review.star_rating));
    console.log("rating sum", ratingSum);
    const avgRating = ratingSum > 0 ? (ratingSum / galleryReviews.length).toFixed(2) : "No reviews";
    console.log("Gallery reviews", galleryReviews);
    console.log("current User", currentUser);

    return (
        <div className="reviews_wrapper">
            <h2 className="reviews_header">Reviews:</h2>
            <p> Rating: ★ {avgRating}</p>
            <div className="review">
                {galleryReviews.map((review) => (
                    <div key={review.id} className="single-review">
                        <h3>{review.review}</h3>
                        <p>{new Date(review.updated_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}</p>
                        <p>Rating: ★ {parseFloat(review.star_rating).toFixed(1)}</p>
                        {review.owner_id == currentUser.id ? (
                            <>
                                <button>Delete</button>
                                <button>Update</button>
                            </>
                        ) : null}
                    </div>

                ))}
            </div>
        </div>
    );
};

export default Reviews;
