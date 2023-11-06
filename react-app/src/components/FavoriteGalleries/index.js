import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGalleryFavoritesThunk, updateFavoriteGalleryThunk } from '../../store/galleries_favorites';
import { getGalleriesThunk } from '../../store/galleries';
import { Link } from 'react-router-dom';

const GalleryFavoritesList = () => {
    const dispatch = useDispatch();
    const galleryFavorites = useSelector((state) => state.galleryFavorites.galleryFavorites);
    const [loading, setLoading] = useState(true);
    const [currentStatus, setCurrentStatus] = useState({});

    // Use the useSelector hook to get galleries
    const galleries = useSelector((state) => Object.values(state.galleries.galleries));

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getGalleriesThunk());
                await dispatch(getGalleryFavoritesThunk());

                if (galleries) {
                  
                    const initialStatus = {};
                    galleries.forEach((gallery) => {
                        initialStatus[gallery.id] = gallery.status;
                    });
                    // console.log("Initial status", initialStatus);
                    setCurrentStatus(initialStatus);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching gallery favorites:', error);
                // False - not show favorite galleries
                setLoading(false);
            }
        };

        if (loading) {
            fetchData();
        }
    }, [dispatch, loading, galleries]);

    // Define handleStatusChange function as before
    const handleStatusChange = async (galleryId, gallery_id) => {
        try {
            const newStatus = !currentStatus[gallery_id];

            await dispatch(updateFavoriteGalleryThunk(galleryId, newStatus));

            await dispatch(getGalleriesThunk());

            // Update the currentStatus state for the specific gallery
            setCurrentStatus((prevStatus) => ({
                ...prevStatus,
                [gallery_id]: newStatus,
            }));

            setLoading(false);
        } catch (error) {
            console.error('Error updating gallery status:', error);
        }
    };

    return (
        <div>
            <h1>Favorite Galleries</h1>
            {loading ? (
                <p>Loading data...</p>
            ) : (
                <ul>
                    {galleryFavorites.map((favorite) => (
                        <li key={favorite.id}>
                            <p>Gallery id: {favorite.gallery_id}</p>
                            <button
                                onClick={() => handleStatusChange(favorite.id, favorite.gallery_id)}
                            >
                                {currentStatus[favorite.gallery_id] ? "Visited" : "Not Visited"}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GalleryFavoritesList;
