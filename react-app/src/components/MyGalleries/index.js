import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Modal, useModal } from "../../context/Modal";

import DeleteConfirmationModal from "../DeleteConfirmationModal";
import OpenModalButton from "../OpenModalButton";
import UpdateGallery from "../UpdateGallery";

import { getGalleriesThunk } from '../../store/galleries';

import './MyGalleries.css';

const MyGalleries = () => {
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.session.user);

    const galleries = useSelector((state) =>
        Object.values(state.galleries.galleries)
    );
    
    // Check if currentUser is available before filtering
    const myGalleries = currentUser ? galleries.filter((gallery) => gallery.owner_id === currentUser.id) : [];

    const [deleteConfirmation, setDeleteConfirmation] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getGalleriesThunk());
            } catch (error) {
                console.error('Error fetching galleries:', error);
            }
        }
        fetchData()
    }, [dispatch]);

    return (
        <div className='my-galleries__wrapper'>
            {currentUser ? (
                <>
                    <h1 className='my-galleries__header'>My Galleries</h1>
                    <div className='my-galleries_list__wrapper'>
                        <ul className='my-galleries_list'>
                            {myGalleries.map((gallery) => (
                                <li key={gallery.id} className='my-galleries_list__item'>
                                    <NavLink to={`/galleries/${gallery.id}`} className="my-galleries_list__item-desc">
                                        <h2 className='title'>{gallery.title}</h2>
                                        <img src={gallery.gallery_img} alt={gallery.title} />
                                        <p>{gallery.description}</p>
                                        <p>Location: {gallery.location}</p>
                                    </NavLink>
                                    <div className="gallery-actions">
                                        <div className="gallery-buttons">
                                            <Link
                                                className="update-gallery-button"
                                                to={`/galleries/update/${gallery.id}`}
                                            >
                                                Update
                                            </Link>
                                            <OpenModalButton
                                                className="delete-button"
                                                buttonText="Delete"
                                                modalComponent={
                                                    <DeleteConfirmationModal
                                                        show={deleteConfirmation}
                                                        onCancel={() => setDeleteConfirmation(false)}
                                                        galleryId={gallery.id}
                                                    />
                                                }
                                            />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            ) : (<p>You need to login to see your galleries.</p>)}
        </div>
    )
}

export default MyGalleries;
