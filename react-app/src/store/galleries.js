const READ_GALLERIES = 'galleries/READ_GALLERIES';
const READ_GALLERY = 'galleries/READ_GALLERY';


const readGalleries = (galleries) => ({
    type: READ_GALLERIES,
    galleries,
});


const readGallery = (gallery) => ({
    type: READ_GALLERY,
    gallery,
});

export const getGalleriesThunk = () => async (dispatch) => {
    const response = await fetch('/galleries');

    if (response.ok) {
        const galleries = await response.json();
        console.log("Galleries", typeof galleries);
        dispatch(readGalleries(galleries));
    } else {
        throw new Error('Failed to fetch galleries');
    }
}

const initialState = {
    galleries: {},
};

const galleriesReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case READ_GALLERIES:
            newState = { ...state, galleries: {} };
            action.galleries.galleries.forEach((gallery) => {
                newState.galleries[gallery.id] = gallery;
            });
            return newState;
        default:
            return state;
    }
};

export default galleriesReducer;
