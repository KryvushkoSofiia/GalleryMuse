// PostReviewModal.js
import React, { useState } from "react";
import { useModal } from "../../../context/Modal";
import { useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
import { createReviewThunk } from "../../../store/reviews";

import "./PostReviewModal.css";

const PostReviewModal = ({ onSubmit, setShowReviewModal, galleryId}) => {
    console.log("Post rev gall id", galleryId); 
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [review, setReview] = useState('');
    const [star_rating, setStar_rating] = useState(0);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        // validations here

        // Call createReviewThunk with review data and galleryId
        try {
            const newReview = await dispatch(createReviewThunk({ review, star_rating }, galleryId));
            onSubmit(newReview); // Pass the newly created review to the parent component
            closeModal();
            setShowReviewModal(false); // Close the review modal
        } catch (error) {
            // Handle error, e.g., display an error message
            console.error("Error creating review:", error.message);
        }
    }

    return (
        <div className="post-review-modal">
            <div>
                <h2 className="post-review-header">Post your review</h2>
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your review here"
                />
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
            <button onClick={handleReviewSubmit}>Submit review</button>
        </div>
    );
}

export default PostReviewModal;
