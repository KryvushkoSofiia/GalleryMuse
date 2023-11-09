import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getGalleryThunk } from '../../store/galleries';
import { addToFavoritesThunk, getGalleryFavoritesThunk } from '../../store/galleries_favorites';
import { useParams } from 'react-router-dom';

import './GalleryDetails.css';

const GalleryDetail = () => {
  const dispatch = useDispatch();
  const { galleryId } = useParams();
  const gallery = useSelector((state) => Object.values(state.galleries.singleGallery)[0]);
  const currentUser = useSelector((state) => state.session.user);
  const galleryFavorites = useSelector((state) => state.galleryFavorites.galleryFavorites);

  const getInitialIsFavorite = () => {
    return gallery?.id && galleryFavorites.some((favorite) => favorite.gallery_id === gallery.id);
  };

  const [isFavorite, setIsFavorite] = useState(getInitialIsFavorite());

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getGalleryThunk(galleryId));
        await dispatch(getGalleryFavoritesThunk());
      } catch (error) {
        console.error('Error fetching gallery:', error);
      }
    };
    fetchData();
  }, [dispatch, galleryId, galleryFavorites.length]);

  useEffect(() => {
    // Update isFavorite when galleryFavorites change
    setIsFavorite(getInitialIsFavorite());
  }, [galleryFavorites, galleryId]);

  const addToFavorites = async () => {
    await dispatch(addToFavoritesThunk(galleryId));
    setIsFavorite(true);
  };

  if (!gallery) {
    return <div>Loading...</div>;
  }

  return (
    <div className='gallery-details__wrapper'>
      <h2 className='gallery-details_title'>{gallery.title}</h2>
      <div className='gallery-info'>
        <p>{gallery.description}</p>
        <p>{gallery.location}</p>
      </div>
      <div className='gallery-image'>
        <img src={gallery.gallery_img} alt={gallery.title} />
      </div>
      <div className='gallery-status'>
        <p>Owner ID: {gallery.owner_id}</p>
        {gallery.status ? <p>Status: Visited</p> : <p>Status: Not Visited</p>}
      </div>

      {currentUser ? (
        // If the user is logged in, display the buttons
        isFavorite ? (
          <button className='remove-favorite' onClick={addToFavorites}>Remove from Favorites</button>
        ) : (
          <button className='add-favorite' onClick={addToFavorites}>Add to Favorites</button>
        )
      ) : null}
    </div>
  );
};

export default GalleryDetail;
