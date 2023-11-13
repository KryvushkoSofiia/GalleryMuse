// const READ_VISITED_GALLERY = 'visitedGallery/READ_VISITED_GALLERY';
// const ADD_TO_VISITED = 'visitedGallery/ADD_TO_VISITED';
// const REMOVE_FROM_VISITED = 'visitedGallery/REMOVE_FROM_VISITED';
// const UPDATE_GALLERY_STATUS = 'visitedGallery/UPDATE_VISITED_STATUS';

// const readVisitedGallery = (visitedGallery) => ({
//   type: READ_VISITED_GALLERY,
//   visitedGallery,
// });

// const addToVisited = (galleryId) => ({
//   type: ADD_TO_VISITED,
//   galleryId,
// });

// const removeFromVisited = (galleryId) => ({
//   type: REMOVE_FROM_VISITED,
//   galleryId,
// });

// const updateVisitedGalleryStatus = (galleryId, newStatus) => ({
//   type: UPDATE_GALLERY_STATUS,
//   galleryId,
//   newStatus,
// });

// export const getVisitedGalleryThunk = () => async (dispatch) => {
//   try {
//     const response = await fetch('/api/visited_galleries/');
//     if (response.ok) {
//       const data = await response.json();
//       const visitedGalleries = data.visited_galleries;
//       dispatch(readVisitedGallery(visitedGalleries));
//     } else {
//       throw new Error('Failed to fetch visited galleries');
//     }
//   } catch (error) {
//     console.error('Error in getVisitedGalleryThunk:', error);
//     throw error;
//   }
// };

// export const addToVisitedThunk = (galleryId) => async (dispatch) => {
//   try {
//     const response = await fetch(`/api/visited_galleries/${galleryId}`, {
//       method: 'POST',
//     });
//     if (response.ok) {
//       dispatch(addToVisited(galleryId));
//     } else {
//       throw new Error('Failed to add gallery to visited galleries');
//     }
//   } catch (error) {
//     console.error('Error in addToVisitedThunk:', error);
//     throw error;
//   }
// };

// export const removeFromVisitedThunk = (galleryId) => async (dispatch) => {
//   try {
//     const response = await fetch(`/api/visited_galleries/${galleryId}`, {
//       method: 'DELETE',
//     });

//     if (response.ok) {
//       dispatch(removeFromVisited(galleryId));
//     } else {
//       throw new Error('Failed to remove gallery from visited galleries');
//     }
//   } catch (error) {
//     console.error('Error in removeFromVisitedThunk:', error);
//     throw error;
//   }
// };

// export const updateVisitedGalleryStatusThunk = (galleryId, newStatus) => async (dispatch) => {
//   try {
//     const response = await fetch(`/api/visited_galleries/${galleryId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ status: newStatus }),
//     });
//     if (response.ok) {
//       dispatch(updateVisitedGalleryStatus(galleryId, newStatus));
//     } else {
//       throw new Error('Failed to update gallery status');
//     }
//   } catch (error) {
//     console.error('Error in updateVisitedGalleryStatusThunk:', error);
//     throw error;
//   }
// };

// const initialState = {
//   galleryVisited: [],
// };

// const galleryVisitedReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case READ_VISITED_GALLERY:
//       return {
//         ...state,
//         galleryVisited: action.visitedGallery,
//       };
//     case ADD_TO_VISITED:
//       return {
//         ...state,
//         galleryVisited: [...state.galleryVisited, action.galleryId],
//       };
//     case REMOVE_FROM_VISITED:
//       return {
//         ...state,
//         galleryVisited: state.galleryVisited.filter(
//           (gallery) => gallery.id !== action.galleryId
//         ),
//       };
//     case UPDATE_GALLERY_STATUS:
//       return {
//         ...state,
//         galleryVisited: state.galleryVisited.map((gallery) =>
//           gallery.id === action.galleryId
//             ? { ...gallery, status: action.newStatus }
//             : gallery
//         ),
//       };
//     default:
//       return state;
//   }
// };

// export default galleryVisitedReducer;
