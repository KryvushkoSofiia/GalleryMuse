const READ_GALLERY_FAVORITES = 'galleryFavorites/READ_GALLERY_FAVORITES';
const ADD_TO_FAVORITES = 'galleryFavorites/ADD_TO_FAVORITES';
const REMOVE_FROM_FAVORITES = 'galleryFavorites/REMOVE_FROM_FAVORITES';
const UPDATE_GALLERY_STATUS = 'galleryFavorites/UPDATE_GALLERY_STATUS';

const readGalleryFavorites = (galleryFavorites) => ({
  type: READ_GALLERY_FAVORITES,
  galleryFavorites,
});

const addToFavorites = (galleryId) => ({
  type: ADD_TO_FAVORITES,
  galleryId,
});

const removeFromFavorites = (galleryId) => ({
  type: REMOVE_FROM_FAVORITES,
  galleryId,
});

const updateGalleryStatus = (galleryId, newStatus) => ({
  type: UPDATE_GALLERY_STATUS,
  galleryId,
  newStatus,
});


export const getGalleryFavoritesThunk = () => async (dispatch) => {
  try {
    const response = await fetch('/api/galleries_favorites/');
    if (response.ok) {
      const data = await response.json();
      const galleryFavorites = data.galleries_favorites;
      dispatch(readGalleryFavorites(galleryFavorites));
    } else {
      throw new Error('Failed to fetch gallery favorites');
    }
  } catch (error) {
    console.error('Error in getGalleryFavoritesThunk:', error);
    throw error;
  }
};

export const addToFavoritesThunk = (galleryId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/galleries_favorites/${galleryId}`, {
      method: 'POST',
    });
    if (response.ok) {
      dispatch(addToFavorites(galleryId));
    } else {
      throw new Error('Failed to add gallery to favorites');
    }
  } catch (error) {
    console.error('Error in addToFavoritesThunk:', error);
    throw error;
  }
};


export const removeFromFavoritesThunk = (galleryId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/galleries_favorites/${galleryId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      dispatch(removeFromFavorites(galleryId));
    } else {
      throw new Error('Failed to remove gallery from favorites');
    }
  } catch (error) {
    console.error('Error in removeFromFavoritesThunk:', error);
    throw error;
  }
};



export const updateFavoriteGalleryThunk = (galleryId, newStatus) => async (dispatch) => {
  try {
    const response = await fetch(`/api/galleries_favorites/${galleryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (response.ok) {
      dispatch(updateGalleryStatus(galleryId, newStatus));
    } else {
      throw new Error('Failed to update gallery status');
    }
  } catch (error) {
    console.error('Error in updateGalleryStatusThunk:', error);
    throw error;
  }
};


const initialState = {
  galleryFavorites: [],
};


const galleryFavoritesReducer = (state = initialState, action) => {
  switch (action.type) {
    case READ_GALLERY_FAVORITES:
      return {
        ...state,
        galleryFavorites: action.galleryFavorites,
      };
    case ADD_TO_FAVORITES:
      return {
        ...state,
        galleryFavorites: [...state.galleryFavorites, action.galleryId],
      };
    case REMOVE_FROM_FAVORITES:
      return {
        ...state,
        galleryFavorites: state.galleryFavorites.filter(
          (gallery) => gallery.id !== action.galleryId
        ),
      };
    case UPDATE_GALLERY_STATUS:
      return {
        ...state,
        galleryFavorites: state.galleryFavorites.map((gallery) =>
          gallery.id === action.galleryId
            ? { ...gallery, status: action.newStatus }
            : gallery
        ),
      };
    default:
      return state;
  }
};

export default galleryFavoritesReducer;
