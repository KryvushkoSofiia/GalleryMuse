import React, { useEffect, useState } from 'react';
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

  const [searchTerm, setSearchTerm] = useState('');
  const [locationSearchTerm, setLocationSearchTerm] = useState(''); // New state for location search

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

  // Filter galleries by location based on locationSearchTerm
  const filteredGalleries = galleries.filter((gallery) => {
    return (
      gallery.location.toLowerCase().includes(locationSearchTerm.toLowerCase()) &&
      gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) // Also filter by title
    );
  });

  return (
    <>
      <>
        <div className='home-page__banner'>
          Banner
        </div>
        <a href='#all-galleries'>
          <img id='arrow' src={Arrow} alt='Arrow' className='svg-image' />
        </a>
      </>
      <div className='home-page__wrapper'>
        <h1 id='all-galleries'>All Galleries</h1>
        <div>
          <input
            type="text"
            placeholder="Search by Location"
            value={locationSearchTerm}
            onChange={(e) => setLocationSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by Title"
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
                  // If the user is logged in, display the buttons
                  isFavorite ? (
                    <button className='remove-favorite' onClick={() => addToFavorites(gallery.id)}>Remove from Favorites</button>
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
