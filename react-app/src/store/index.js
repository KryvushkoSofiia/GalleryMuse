import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session';
import galleries from './galleries';
import reviews from './reviews';
import galleryFavoritesReducer from './galleries_favorites';
import galleryVisitedReducer from './visited_galleries'

const rootReducer = combineReducers({
  session,
  galleries,
  reviews,
  galleryFavorites: galleryFavoritesReducer,
  galleryVisited: galleryVisitedReducer,
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
