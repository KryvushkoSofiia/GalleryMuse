import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { getGalleriesThunk } from '../../store/galleries';
import { addToFavoritesThunk, getGalleryFavoritesThunk, removeFromFavoritesThunk } from '../../store/galleries_favorites';

import './HomePage.css';
import Arrow from './Arrow.svg';

const GalleryList = () => {
  const dispatch = useDispatch();
  const galleries = useSelector((state) => Object.values(state.galleries.galleries));
  const galleryFavorites = useSelector((state) => state.galleryFavorites.galleryFavorites);
  const currentUser = useSelector((state) => state.session.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [locationSearchTerm, setLocationSearchTerm] = useState('');

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
  }, [dispatch, galleryFavorites.length, currentUser]); // Include currentUser in the dependency array

  // Reset state when user changes
  useEffect(() => {
    setSearchTerm('');
    setLocationSearchTerm('');
  }, [currentUser]);

  // Filter galleries by location based on locationSearchTerm
  const filteredGalleries = galleries.filter((gallery) => {
    return (
      gallery.location.toLowerCase().includes(locationSearchTerm.toLowerCase()) &&
      gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) // Also filter by title
    );
  });

  const addToFavorites = async (galleryId) => {
    try {
      await dispatch(addToFavoritesThunk(galleryId));
      await dispatch(getGalleryFavoritesThunk());
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };
  
  const removeFromFavorites = async (galleryId) => {
    try {
      await dispatch(removeFromFavoritesThunk(galleryId));
      await dispatch(getGalleryFavoritesThunk());
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  return (
    <>
      <div className='home-page__banner'>
        Banner
      </div>
      <a href='#all-galleries'>
        <img id='arrow' src={Arrow} alt='Arrow' className='svg-image' />
      </a>
      <div className='home-page__wrapper'>
        <h1 id='all-galleries'>All Galleries</h1>
        <div className='home-page_search__wrapper'>
          <input
            type="text"
            placeholder="Search by Location"
            className='search'
            value={locationSearchTerm}
            onChange={(e) => setLocationSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by Title"
            className='search'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ul className='home-page_galleries__wrapper'>
          {filteredGalleries.map((gallery) => {
            const isFavorite = galleryFavorites.some((favorite) => favorite.gallery_id === gallery.id);

            return (
              <li key={gallery.id} className='home-page__gallery'>
                <NavLink to={`/galleries/${gallery.id}`} className="active-link">
                  <h2>{gallery.title}</h2>
                  <img src={gallery.gallery_img} alt={gallery.title} />
                  <p>{gallery.description}</p>
                  <p>Location: {gallery.location}</p>
                </NavLink>
                {currentUser ? (
                  isFavorite ? (
                    <button className='remove-favorite' onClick={() => removeFromFavorites(gallery.id)}>Remove from Favorites</button>
                  ) : (
                    <button className='add-favorite' onClick={() => addToFavorites(gallery.id)}>Add to Favorites</button>
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
