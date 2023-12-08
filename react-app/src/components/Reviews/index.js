// Reviews.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import OpenModalButton from "../OpenModalButton";
import { readReviewsThunk, deleteReviewThunk } from "../../store/reviews";
import PostReviewModal from "./PostReviewModal";
import UpdateReviewModal from "./UpdateReviewModal";

import "./Reviews.css";

const Reviews = ({ galleryId }) => {
    const dispatch = useDispatch();
    const reviews = useSelector((state) => Object.values(state.reviews.reviews));
    const currentUser = useSelector((state) => state.session.user);

    const [showReviewModal, setShowReviewModal] = useState(false);

    useEffect(() => {
        dispatch(readReviewsThunk());
    }, [dispatch, reviews.length]);

    const galleryReviews = reviews.filter((review) => review.gallery_id == galleryId);
    let ratingSum = 0;
    galleryReviews.forEach((review) => (ratingSum += parseFloat(review.star_rating)));
    const avgRating = ratingSum > 0 ? (ratingSum / galleryReviews.length).toFixed(2) : "No reviews";

    const userReview = currentUser ? galleryReviews.find((review) => review.owner_id == currentUser.id) : null;

    const handleDeleteReview = async () => {
        await dispatch(deleteReviewThunk(userReview?.id));
    };

    return (
        <div className="reviews_wrapper">
            <p className="review_rating"> ★ {avgRating}</p>
            <div className="current-user_review">
                {userReview ? (
                    <>
                        <h2 className="current-user_review-header">Your review: </h2>
                        <div key={userReview.id} className="single-review current-user">
                            <h3 className="review_header">{userReview.review}</h3>
                            <div className="review_info">
                                <p>
                                    {new Date(userReview.updated_at).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                                <p className="review_rating">★ {parseFloat(userReview.star_rating).toFixed(1)}</p>
                            </div>
                            <div className="review_buttons">
                                <button onClick={handleDeleteReview}>Delete</button>
                                <OpenModalButton
                                    buttonText="Update"
                                    className="update-modal"
                                    modalComponent={
                                        <UpdateReviewModal
                                            onSubmit={() => setShowReviewModal(false)}
                                            setShowReviewModal={setShowReviewModal}
                                            galleryId={galleryId}
                                            reviewId={userReview.id}
                                        />
                                    }
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    currentUser && (
                        <OpenModalButton
                            buttonText="Create review"
                            modalComponent={
                                <PostReviewModal
                                    onSubmit={() => setShowReviewModal(false)}
                                    setShowReviewModal={setShowReviewModal}
                                    galleryId={galleryId}
                                />
                            }
                        />
                    )
                )}
            </div>

            <div className="review">
                <h2 className="reviews_header">Reviews:</h2>
                {galleryReviews
                    .filter((review) => !currentUser || review.owner_id !== currentUser.id)  // Handle logged out user
                    .map((review) => (
                        <div key={review.id} className="single-review">
                            <h3>{review.review}</h3>
                            <p>
                                {new Date(review.updated_at).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </p>
                            <p>Rating: ★ {parseFloat(review.star_rating).toFixed(1)}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Reviews;
