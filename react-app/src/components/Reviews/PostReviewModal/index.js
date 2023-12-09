// PostReviewModal.js
import React, { useState, useEffect } from "react";
import { useModal } from "../../../context/Modal";
import { useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
import { createReviewThunk } from "../../../store/reviews";

import "./PostReviewModal.css";

const PostReviewModal = ({ onSubmit, setShowReviewModal, galleryId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [review, setReview] = useState('');
    const [errors, setErrors] = useState({});
    const [star_rating, setStar_rating] = useState(0);

    useEffect(() => {
        // Validations
        const newErrors = {};

        if (review.length < 4 || review.length > 1000) {
            newErrors.review = "Review must be between 4 and 1000 symbols";
        }

        if (star_rating < 1 || star_rating > 5) {
            newErrors.star_rating = "Star rating must be between 1 and 5";
        }

        setErrors(newErrors);
    }, [review, star_rating]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        // If there are validation errors, stop submission
        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            // Call createReviewThunk with review data and galleryId
            const newReview = await dispatch(createReviewThunk({ review, star_rating }, galleryId));
            onSubmit(newReview); // Pass the newly created review to the parent component
        } catch (error) {
            // Handle error, e.g., display an error message
            console.error("Error creating review:", error.message);
        } finally {
            closeModal();
            setShowReviewModal(false);
        }
    };

    return (
        <div className="post-review-modal">
            <div>
                <h2 className="post-review-header">Post your review</h2>
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your review here"
                />
                {errors.review && <p className="error-message">{errors.review}</p>}
            </div>
            <h4>Rating</h4>
            <div className="star-container">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={star <= star_rating ? "star-filled" : "star-empty"}
                        onClick={() => setStar_rating(star)}
                    >
                        &#9733;
                    </span>
                ))}
            </div>
            {errors.star_rating && <p className="error-message">{errors.star_rating}</p>}
            <button onClick={handleReviewSubmit}>Submit review</button>
        </div>
    );
};

export default PostReviewModal;
