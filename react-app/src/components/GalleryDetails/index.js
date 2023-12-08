// GalleryDetail.js

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getGalleryThunk } from '../../store/galleries';
import { addToFavoritesThunk, getGalleryFavoritesThunk, removeFromFavoritesThunk } from '../../store/galleries_favorites';
import { removeFromVisitedThunk, getVisitedGalleryThunk, addToVisitedThunk } from '../../store/visited_galleries';
import { useParams } from 'react-router-dom';

import './GalleryDetails.css';
import Reviews from '../Reviews';

const GalleryDetail = () => {
  const dispatch = useDispatch();
  const { galleryId } = useParams();
  const gallery = useSelector((state) => Object.values(state.galleries.singleGallery)[0]);
  const galleryFavorites = useSelector((state) => state.galleryFavorites.galleryFavorites);
  const visitedGalleries = useSelector((state) => state.galleryVisited.galleryVisited);

  const isVisited = useSelector((state) => {
    const gallery = Object.values(state.galleries.singleGallery)[0];
    return gallery?.id && state.galleryVisited.galleryVisited?.some((visited) => visited.gallery_id === gallery.id);
  });

  const isFavorite = useSelector((state) => {
    const gallery = Object.values(state.galleries.singleGallery)[0];
    return gallery?.id && state.galleryFavorites.galleryFavorites?.some((favorite) => favorite.gallery_id === gallery.id);
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(getGalleryThunk(galleryId));
        await dispatch(getGalleryFavoritesThunk());
        await dispatch(getVisitedGalleryThunk());
      } catch (error) {
        console.error('Error fetching gallery:', error);
      }
    };

    fetchData();
  }, [dispatch, galleryId]);

  const addRemoveFavorites = async () => {
    try {
      if (isFavorite) {
        await dispatch(removeFromFavoritesThunk(galleryId));
      } else {
        await dispatch(addToFavoritesThunk(galleryId));
      }

      await dispatch(getGalleryThunk(galleryId));
      await dispatch(getGalleryFavoritesThunk());

    } catch (error) {
      console.error('Error adding/removing from favorites:', error);
    }
  };

  const toggleStatus = async () => {
    try {
      if (isVisited) {
        await dispatch(removeFromVisitedThunk(galleryId));
      } else {
        await dispatch(addToVisitedThunk(galleryId));
      }

      await dispatch(getGalleryThunk(galleryId));
      await dispatch(getVisitedGalleryThunk());

    } catch (error) {
      console.error('Error toggling gallery status:', error);
    }
  };

  if (!gallery) {
    return <div>Loading...</div>;
  }

  return (
    <div className='gallery-details__wrapper'>
      <h2 className='gallery-details_title'>{gallery.title}</h2>
      <div className='gallery-info'>
        <p>Description: {gallery.description}</p>
        <p>Location: {gallery.location}</p>
      </div>
      <div className='gallery-image'>
        <img src={gallery.gallery_img} alt={gallery.title} />
      </div>
      <div className='gallery-status'>
        <p>Owner ID: {gallery.owner_id}</p>
      </div>

      {isVisited !== undefined && isFavorite !== undefined && (
        <div className='buttons-wrapper'>
          <button className={isVisited ? 'remove-visited' : 'add-to-visited'} onClick={toggleStatus}>
            {isVisited ? 'Mark as Not Visited' : 'Mark as Visited'}
          </button>
          <button className={isFavorite ? 'remove-favorite' : 'add-favorite'} onClick={addRemoveFavorites}>
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>
      )}
      <div className='reviews'>
        <Reviews galleryId={galleryId} />
      </div>
    </div>
  );
};

export default GalleryDetail;
