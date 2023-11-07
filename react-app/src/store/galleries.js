const READ_GALLERIES = 'galleries/READ_GALLERIES';
const READ_GALLERY = 'galleries/READ_GALLERY';
const CREATE_GALLERY = 'galleries/CREATE_GALLERY';
const UPDATE_GALLERY = 'galleries/UPDATE_GALLERY';
const DELETE_GALLERY = 'galleries/DELETE_GALLERY';

const readGalleries = (galleries) => ({
    type: READ_GALLERIES,
    galleries,
});


const readGallery = (gallery) => ({
    type: READ_GALLERY,
    gallery,
});

const createGallery = (galleryData) => ({
    type: CREATE_GALLERY,
    galleryData,
});

const updateGallery = (galleryData, galleryId) => ({
    type: UPDATE_GALLERY,
    galleryData,
    galleryId,
});

const deleteGallery = (galleryId) => ({
    type: DELETE_GALLERY,
    galleryId,
});

export const getGalleriesThunk = () => async (dispatch) => {
    const response = await fetch('/api/galleries');

    if (response.ok) {
        const galleries = await response.json();
        console.log("Galleries", typeof galleries);
        dispatch(readGalleries(galleries));
    } else {
        throw new Error('Failed to fetch galleries');
    }
};

export const getGalleryThunk = (galleryId) => async (dispatch) => {
    const response = await fetch(`/api/galleries/${galleryId}`);

    if (response.ok) {
        const gallery = await response.json();
        console.log("Gallery store", gallery);
        dispatch(readGallery(gallery));
    } else {
        throw new Error('Failed to fetch gallery');
    }
};

export const createGalleryThunk = (galleryData) => async (dispatch) => {
    const response = await fetch('api/galleries/new', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(galleryData),
    });

    if (response.ok) {
        const newGallery = await response.json();
        console.log("New gallery from thunk", newGallery);
        dispatch(createGallery(newGallery));
        return newGallery;
    } else {
        throw new Error('Failed to create gallery');
    }

};

export const updateGalleryThunk = (galleryData, galleryId) => async (dispatch) => {
    const response = await fetch(`/api/galleries/update/${galleryId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(galleryData),
    });

    if (response.ok) {
        const updatedGallery = await response.json();
        console.log("Updated gallery data:", updatedGallery);
        dispatch(updateGallery(updatedGallery, galleryId));
    } else {
        console.error('Failed to update gallery');
        console.error(await response.text());
        throw new Error('Failed to update gallery');
    }
}

export const deleteGalleryThunk = (galleryId) => async (dispatch) => {
    const response = await fetch(`/api/galleries/${galleryId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        dispatch(deleteGallery(galleryId));
    } else {
        throw new Error('Failed to udelete gallery');
    }

}

const initialState = {
    galleries: {},
    singleGallery: {},
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
        case READ_GALLERY:
            newState = { ...state };
            newState.singleGallery = action.gallery;
            return newState;
        case CREATE_GALLERY:
            newState = { ...state };
            newState.singleGallery = action.galleryData;
            return newState;
        case UPDATE_GALLERY:
            newState = { ...state };
            newState.galleries[action.galleryId] = action.galleryData;
            return newState
        case DELETE_GALLERY:
            newState = { ...state };
            delete newState.galleries[action.galleryId]
            return newState
        default:
            return state;
    }
};

export default galleriesReducer;
