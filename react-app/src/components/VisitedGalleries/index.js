import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGalleriesThunk } from '../../store/galleries';
import { getVisitedGalleryThunk, removeFromVisitedThunk } from '../../store/visited_galleries';
import { NavLink } from 'react-router-dom'; // Import NavLink for navigation
import './VisitedGalleries.css';

const VisitedGalleries = () => {
  const dispatch = useDispatch();
  const galleries = useSelector((state) => state.galleries.galleries);
  const visitedGalleries = useSelector((state) => state.galleryVisited.galleryVisited);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getGalleriesThunk());
        await dispatch(getVisitedGalleryThunk());
      } catch (error) {
        console.error('Error fetching visited galleries:', error);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      fetchData();
    }
  }, [dispatch, loading]);

  const handleDelete = async (galleryId) => {
    try {
      await dispatch(removeFromVisitedThunk(galleryId));
      await dispatch(getVisitedGalleryThunk());
    } catch (error) {
      console.error('Error removing visited gallery:', error);
    }
  };

  return (
    <div className="background">
      <div className="visited-galleries_wrapper">
        <h1 className="visited-galleries_header">Visited Galleries</h1>
        {loading ? (
          <p>Loading...</p>
        ) : visitedGalleries.length === 0 ? (
          <p>No visited galleries yet.</p>
        ) : (
          <ul>
            {visitedGalleries.map((gallery) => {
              const galleryDetails = galleries[gallery.gallery_id];

              return (
                <li key={gallery.id} className="visited-gallery-item">
                  <NavLink to={`/galleries/${gallery.gallery_id}`} className="visited-gallery-details">
                    <img src={galleryDetails.gallery_img} alt={galleryDetails.title} />
                    <div className="info">
                      <h2 className='gallery-title'>{galleryDetails.title}</h2>
                      <p>{galleryDetails.description}</p>
                    </div>
                  </NavLink>
                  <div className="visited-gallery-actions">
                    {/* <span className="visited-gallery-id">{gallery.gallery_id}</span> */}
                    <button className="delete-button" onClick={() => handleDelete(gallery.gallery_id)}>
                      Remove from Visited
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VisitedGalleries;
