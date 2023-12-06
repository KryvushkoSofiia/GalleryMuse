const READ_REVIEWS = 'reviews/READ_REVIEWS';
const READ_REVIEW = 'reviews/READ_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

const readReviews = (reviews) => ({
    type: READ_REVIEWS,
    reviews
});

const readReview = (reviewId) => ({
    type: READ_REVIEWS,
    reviewId
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

export const readReviewThunk = (reviewId) => async (dispatch) => {

}

export const deleteReviewThunk = (reviewId) => async (dispatch) => {

}

const initialState = {
    reviews: {},
};

const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case READ_REVIEWS:
            newState = { ...state, reviews: {} }
            action.reviews.reviews.forEach(review => {
                newState.reviews[review.id] = review;
            });
            return newState;
        default:
            return state;
    }
}

export default reviewsReducer;
