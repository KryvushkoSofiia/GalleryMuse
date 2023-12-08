const READ_REVIEWS = 'reviews/READ_REVIEWS';
const READ_REVIEW = 'reviews/READ_REVIEW';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';


const readReviews = (reviews) => ({
    type: READ_REVIEWS,
    reviews
});

// const readReview = (reviewId) => ({
//     type: READ_REVIEWS,
//     reviewId
// });

const createReview = (reviewData) => ({
    type: CREATE_REVIEW,
    reviewData
});

const updateReview = (reviewData) => ({
    type: UPDATE_REVIEW,
    reviewData
});

const deleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId
});


export const readReviewsThunk = () => async (dispatch) => {
    const response = await fetch('/api/reviews');

    if (response.ok) {
        const reviews = await response.json();
        console.log("reviews from thunk", reviews);
        dispatch(readReviews(reviews));
    } else {
        throw new Error('Failed to fetch reviews');
    }
}

export const createReviewThunk = (reviewData, galleryId) => async (dispatch) => {
    try {
        const response = await fetch('/api/reviews/new', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...reviewData, galleryId }),
        });

        if (!response.ok) {
            throw new Error('Failed to create review');
        }

        const newReview = await response.json();
        dispatch(createReview(newReview));
        return newReview;
    } catch (error) {
        console.error('Error creating review:', error.message);
        throw error;
    }
};

export const updateReviewThunk = (reviewData, reviewId) => async (dispatch) => {
    reviewData.star_rating = parseFloat(reviewData.star_rating);
    try {
        const response = await fetch(`/api/reviews/update/${reviewId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reviewData),
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(updateReview(reviewId, data));
            return data;
        } else {
            throw new Error('Failed updating review');
        }
    } catch (error) {
        console.error('Error updating review:', error.message);
        throw error;
    }
};


export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        dispatch(deleteReview(reviewId));
    } else {
        throw new Error('Failed to delete review');
    }
}

const initialState = {
    reviews: {}
};

const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case READ_REVIEWS:
            newState = { ...state, reviews: {} };
            action.reviews.reviews.forEach(review => {
                newState.reviews[review.id] = review;
            });
            return newState;
        case CREATE_REVIEW:
            newState = { ...state, reviews: { ...state.reviews, [action.reviewData.id]: action.reviewData } };
            return newState;
        case UPDATE_REVIEW:
            newState = { ...state, reviews: { ...state.reviews, [action.reviewData.id]: action.reviewData } }
        case DELETE_REVIEW:
            newState = { ...state };
            delete newState.reviews[action.reviewId];
            return newState;
        default:
            return state;
    }
}

export default reviewsReducer;
