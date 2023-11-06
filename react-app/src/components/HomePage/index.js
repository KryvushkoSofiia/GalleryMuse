import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { getGalleriesThunk } from '../../store/galleries';
import { addToFavoritesThunk } from '../../store/galleries_favorites';

import './HomePage.css'

const GalleryList = () => {
  const dispatch = useDispatch();
  const galleries = useSelector((state) =>
    Object.values(state.galleries.galleries)
  );

  const addToFavorites = (galleryId) => {
    dispatch(addToFavoritesThunk(galleryId));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getGalleriesThunk());
      } catch (error) {
        console.error('Error fetching galleries:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  console.log('Redux State:', galleries); // Log the state

  return (
    <>
      <div className='home-page__banner'>
        Banner
      </div>
      <div className='home-page__wrapper'>

        <h1>All Galleries</h1>
        <ul className='home-page_galleries__wrapper'>
          {galleries.map((gallery) => (
            <li key={gallery.id} className='home-page__gallery'>
              <NavLink to={`/galleries/${gallery.id}`} activeClassName="active-link">
                <h2>{gallery.title}</h2>
                <img src={gallery.gallery_img} alt={gallery.title} />
                <p>{gallery.description}</p>
                <p>Location: {gallery.location}</p>
                <p>Created at: {gallery.created_at}</p>
              </NavLink>
              <button onClick={() => addToFavorites(gallery.id)}>Add to Favorites</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default GalleryList;
