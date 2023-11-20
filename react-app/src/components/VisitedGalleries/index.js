import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getVisitedGalleryThunk,
    removeFromVisitedThunk,
} from '../../store/visited_galleries';

const VisitedGalleries = () => {
    const dispatch = useDispatch();
    const visitedGalleries = useSelector((state) => state.galleryVisited.galleryVisited);
    const [loading, setLoading] = useState(true);

    // console.log("Visited Galleries", visitedGalleries);

    useEffect(() => {
        const fetchData = async () => {
            try {
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

    console.log("Visited Galleries", visitedGalleries);
    return (
        <div>
            <h2>Visited Galleries</h2>
            {loading ? (
                <p>Loading...</p>
            ) : visitedGalleries.length === 0 ? (
                <p>No visited galleries yet.</p>
            ) : (
                <ul>
                    {visitedGalleries.map((gallery) => (
                        <li key={gallery.id}>
                            {gallery.gallery_id}
                            <button onClick={() => handleDelete(gallery.gallery_id)}>
                                Remove from Visited
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default VisitedGalleries;
