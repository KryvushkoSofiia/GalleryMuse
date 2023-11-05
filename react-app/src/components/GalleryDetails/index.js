import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getGalleryThunk } from '../../store/galleries';

import { useParams, useHistory } from "react-router-dom";

const GalleryDetail = () => {
  const dispatch = useDispatch();
  const { galleryId } = useParams();

  console.log("GalleryId", galleryId);

  const gallery = useSelector(
    (state) => Object.values(state.galleries.singleGallery)[0]
  );
  console.log("Gallery", gallery);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getGalleryThunk(galleryId));
      } catch (error) {
        console.error('Error fetching gallery:', error)
      }
    };
    fetchData();
  }, [dispatch, galleryId]);

  if (!gallery) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{gallery.title}</h2>
      <p>{gallery.description}</p>
      <p>{gallery.location}</p>
      <img src={gallery.gallery_img} alt={gallery.title} />

      <p>Created at: {gallery.created_at}</p>
      <p>Owner ID: {gallery.owner_id}</p>
      {gallery.status ? <p>Status: Active</p> : <p>Status: Inactive</p>}

    </div>
  );
};

export default GalleryDetail;
