import React, { useState, useEffect } from "react";
import { useModal } from "../../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { updateReviewThunk, readReviewsThunk } from "../../../store/reviews";

import './UpdateReviewModal.css';

const UpdateReviewModal = ({ onSubmit, setShowReviewModal, reviewId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    // Local state for dynamic review data
    const [reviewData, setReviewData] = useState({
        review: '',
        star_rating: 0,
    });

    // Get all reviews from the Redux store
    const reviews = useSelector((state) => state.reviews.reviews);

    useEffect(() => {
        // Fetch all reviews when the component mounts
        dispatch(readReviewsThunk());
    }, [dispatch]);

    useEffect(() => {
        // Filter out the specific review by ID
        const existingReview = reviews[reviewId];
        if (existingReview) {
            setReviewData({
                review: existingReview.review,
                star_rating: existingReview.star_rating,
            });
        }
    }, [reviewId, reviews]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        // validations here

        // Call updateReviewThunk with review data and reviewId
        try {
            console.log("Review Data", reviewData);
            const updatedReview = await dispatch(updateReviewThunk(reviewData, reviewId));
            onSubmit(updatedReview);
            closeModal();
            setShowReviewModal(false);
           await  dispatch(readReviewsThunk());
        } catch (error) {
            console.error("Error updating review:", error.message);
        }
    }

    return (
        <div className="update-review-modal">
            <div>
                <h2 className="update-review-header">Update your review</h2>
                <textarea
                    value={reviewData.review}
                    onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                    placeholder="Update your review here"
                />
            </div>
            <h4>Rating</h4>
            <div className="star-container">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={star <= reviewData.star_rating ? "star-filled" : "star-empty"}
                        onClick={() => setReviewData({ ...reviewData, star_rating: star })}
                    >
                        &#9733;
                    </span>
                ))}
            </div>
            <button onClick={handleReviewSubmit}>Update review</button>
        </div>
    );
}

export default UpdateReviewModal;
