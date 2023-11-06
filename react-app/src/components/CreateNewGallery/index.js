import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { createGalleryThunk } from "../../store/galleries";

import './CreateNewGallery.css';

const CreateNewGallery = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const currentUser = useSelector((state) => state.session.user);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        status: false,
        gallery_img: "",
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!formData.title || formData.title.length < 6 || formData.title.length > 50) {
            newErrors.title = "Title is required and must be between 6 and 50 characters.";
        }

        if (!formData.description || formData.description.length < 30 || formData.description.length > 1000) {
            newErrors.description = "Description is required and must be between 30 and 1000 characters.";
        }

        if (!formData.location || formData.location.length < 5 || formData.location.length > 255) {
            newErrors.location = "Location is required and must be between 5 and 255 characters.";
        }

        const validUrlEndings = [".jpg", ".jpeg", ".png"];
        if (!formData.gallery_img || !validUrlEndings.some((ending) => formData.gallery_img.toLowerCase().endsWith(ending))) {
            newErrors.gallery_img = "Image URL is required and must end in .jpg, .jpeg, or .png";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            const createdGallery = await dispatch(createGalleryThunk(formData));
            if (createdGallery) {
                history.push(`/galleries/${createdGallery.id}`);
            } else {
                console.log("Gallery creation failed");
            }
        }
    };
    return (
        <div className="create-gallery__wrapper">
            {currentUser ? (
                <form onSubmit={handleSubmit} className="create-gallery-form">
                    <div className="form-group">
                        <label htmlFor="title" className="label">Title:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="text-input"
                        />
                        {errors.title && <span className="error">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="label">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="textarea-input"
                        />
                        {errors.description && <span className="error">{errors.description}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="location" className="label">Location:</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="text-input"
                        />
                        {errors.location && <span className="error">{errors.location}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="status" className="label">Status:</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="select-input"
                        >
                            <option value={true}>Visited</option>
                            <option value={false}>Not Visited</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="gallery_img" className="label">Gallery Image:</label>
                        <input
                            type="text"
                            id="gallery_img"
                            name="gallery_img"
                            value={formData.gallery_img}
                            onChange={handleInputChange}
                            className="text-input"
                        />
                        {errors.gallery_img && <span className='error'>{errors.gallery_img}</span>}
                    </div>

                    <button type="submit" className="submit-button">Submit</button>
                </form>
            ) : (<p>You need to login to create a new gallery.</p>
            )}
        </div>
    );
};

export default CreateNewGallery;
