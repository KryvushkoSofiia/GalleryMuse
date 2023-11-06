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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const createdGallery = await dispatch(createGalleryThunk(formData));

        if (createdGallery) {
            history.push("/galleries/");
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
                    </div>

                    <button type="submit" className="submit-button">Submit</button>
                </form>
            ) : (<p>You need to login to create a new gallery.</p>
            )}
        </div>
    );
};

export default CreateNewGallery;
