// actions.js
const READ_GALLERY_FAVORITES = 'galleryFavorites/READ_GALLERY_FAVORITES';
const ADD_TO_FAVORITES = 'galleryFavorites/ADD_TO_FAVORITES';

const readGalleryFavorites = (galleryFavorites) => ({
  type: READ_GALLERY_FAVORITES,
  galleryFavorites,
});

const addToFavorites = (galleryId) => ({
  type: ADD_TO_FAVORITES,
  galleryId,
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

// reducer.js
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
    default:
      return state;
  }
};

export default galleryFavoritesReducer;
