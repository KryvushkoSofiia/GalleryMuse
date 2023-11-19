import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGalleryFavoritesThunk, removeFromFavoritesThunk } from '../../store/galleries_favorites';
import { getVisitedGalleryThunk } from '../../store/visited_galleries';
import { getGalleriesThunk } from '../../store/galleries';
import { NavLink } from 'react-router-dom';

import './FavoriteGalleries.css';

const GalleryFavoritesList = () => {
  const dispatch = useDispatch();
  const galleryFavorites = useSelector((state) => state.galleryFavorites.galleryFavorites);
  const currentUser = useSelector((state) => state.session.user);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState({});
  const visitedGalleries = useSelector((state) => state.galleryVisited.galleryVisited);
  const galleries = useSelector((state) => Object.values(state.galleries.galleries));

  const findGalleryById = (galleryId) => {
    return galleries?.find((gallery) => gallery.id === galleryId);
  };

  const isGalleryVisited = (galleryId) => {
    return visitedGalleries.some((visited) => visited.gallery_id === galleryId);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getGalleriesThunk());
        await dispatch(getGalleryFavoritesThunk());
        await dispatch(getVisitedGalleryThunk());

        if (galleries) {
          const initialStatus = {};
          galleries.forEach((gallery) => {
            initialStatus[gallery.id] = isGalleryVisited(gallery.id);
          });
          setCurrentStatus(initialStatus);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (loading) {
      fetchData();
    }
  }, [dispatch, loading, galleries]);

  const handleDelete = async (recordId) => {
    try {
      await dispatch(removeFromFavoritesThunk(recordId));
      await dispatch(getGalleryFavoritesThunk());
    } catch (error) {
      console.error('Error removing favorite gallery:', error);
    }
  };

  return (
    <div className="background">
      <div className="favorite-galleries_wrapper">
        {currentUser ? (
          <>
            <h1 className="favorite-galleries_header">Favorite Galleries</h1>
            {loading ? (
              <p>Loading data...</p>
            ) : (
              <ul>
                {galleryFavorites.map((favorite) => {
                  const gallery = findGalleryById(favorite.gallery_id);

                  return (
                    <li key={favorite.id}>
                      <NavLink to={`/galleries/${favorite.gallery_id}`} className="">
                        {gallery && (
                          <>
                            <h2 className="title">{gallery.title}</h2>
                            <div className="favorite-gallery_info">
                              <img src={gallery.gallery_img} alt={gallery.title} />
                              <div className="info">
                                <p>{gallery.description}</p>
                                <p>Location: {gallery.location}</p>
                              </div>
                            </div>
                          </>
                        )}
                      </NavLink>
                      <div className="favorite-galleries_buttons">
                        <button>
                          {isGalleryVisited(favorite.gallery_id) ? 'Visited' : 'Not Visited'}
                        </button>
                        <button onClick={() => handleDelete(favorite.gallery_id)}>Delete</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        ) : (
          <p>You need to login to see your favorite galleries.</p>
        )}
      </div>
    </div>
  );
};

export default GalleryFavoritesList;
