import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGalleryFavoritesThunk } from '../../store/galleries_favorites';
import { Link } from 'react-router-dom';

const GalleryFavoritesList = () => {
    const dispatch = useDispatch();
    const galleryFavorites = useSelector((state) => state.galleryFavorites.galleryFavorites);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getGalleryFavoritesThunk());
                setLoading(false); // Set loading to false once data is loaded
            } catch (error) {
                console.error('Error fetching gallery favorites:', error);
            }
        };

        if (loading) {
            fetchData(); // Fetch data only if loading is true
        }
    }, [dispatch, loading]);

    return (
        <div>
            <h1>Favorite Galleries</h1>
            {loading ? (
                <p>Loading data...</p>
            ) : (
                <ul>
                    {galleryFavorites.map((favorite) => (
                        <li key={favorite.id}>
                            <p>Gallery id :{favorite.gallery_id}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GalleryFavoritesList;
