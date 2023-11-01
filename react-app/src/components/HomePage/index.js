import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGalleriesThunk } from '../../store/galleries';

const GalleryList = () => {
  const dispatch = useDispatch();
  const galleries = useSelector((state) =>
    Object.values(state.galleries.galleries)
  );

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
    <div>
      <h1>All Galleries</h1>
      <ul>
        {galleries.map((gallery) => (
          <li key={gallery.id}>
            <h2>{gallery.title}</h2>
            <p>{gallery.description}</p>
            <p>Location: {gallery.location}</p>
            <p>Created at: {gallery.created_at}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GalleryList;
