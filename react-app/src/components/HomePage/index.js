import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { getGalleriesThunk } from '../../store/galleries';
import { addToFavoritesThunk, getGalleryFavoritesThunk } from '../../store/galleries_favorites';

import './HomePage.css';
import Arrow from './Arrow.svg';

const GalleryList = () => {
  const dispatch = useDispatch();
  const galleries = useSelector((state) => Object.values(state.galleries.galleries));
  const galleryFavorites = useSelector((state) => state.galleryFavorites.galleryFavorites);
  const currentUser = useSelector((state) => state.session.user);

  const addToFavorites = (galleryId) => {
    dispatch(addToFavoritesThunk(galleryId));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getGalleriesThunk());
        await dispatch(getGalleryFavoritesThunk());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dispatch, galleryFavorites.length]);

  console.log('Redux State:', galleries);

  return (
    <>
      <div className='home-page__banner'>
        Banner
        <a href='#all-galleries'>
          <img id='arrow' src={Arrow} alt='Arrow' className='svg-image' />
        </a>
      </div>
      <div className='home-page__wrapper'>
        <h1 id='all-galleries'>All Galleries</h1>
        <ul className='home-page_galleries__wrapper'>
          {galleries.map((gallery) => {
            const isFavorite = galleryFavorites.some((favorite) => favorite.gallery_id === gallery.id);

            return (
              <li key={gallery.id} className='home-page__gallery'>
                <NavLink to={`/galleries/${gallery.id}`} activeClassName="active-link">
                  <h2>{gallery.title}</h2>
                  <img src={gallery.gallery_img} alt={gallery.title} />
                  <p>{gallery.description}</p>
                  <p>Location: {gallery.location}</p>
                </NavLink>
                {currentUser ? (
                  // If the user is logged in, display the buttons
                  isFavorite ? (
                    <button onClick={() => addToFavorites(gallery.id)}>Remove from Favorites</button>
                  ) : (
                    <button onClick={() => addToFavorites(gallery.id)}>Add to Favorites</button>
                  )
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default GalleryList;
