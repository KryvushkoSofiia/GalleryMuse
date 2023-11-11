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
        gallery_img: null,
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    // Update handleFileChange to handle file input changes
    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     setFormData({
    //         ...formData,
    //         gallery_img: file,
    //     });
    // };


    const [image, setImage] = useState(null);
    
    const ALLOWED_EXTENSIONS = ["pdf", "png", "jpg", "jpeg", "gif"];

    const isAllowedExtension = (filename) => {
        const ext = filename.split('.').pop();
        return ALLOWED_EXTENSIONS.includes(ext.toLowerCase());
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

        if (!image) {
            newErrors.gallery_img = "Gallery Image is required.";
        } else if (!isAllowedExtension(image.name)) {
            newErrors.gallery_img = "Invalid file format. Allowed formats: " + ALLOWED_EXTENSIONS.join(", ");
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

        } else {
            // const { name, value } = e.target;
            // setFormData({
            //     ...formData,
            //     [name]: value,
            // });

            console.log("Form data", formData);
            const newFormData = new FormData();
            newFormData.append("gallery_img", image);
            newFormData.append("title", formData.title);
            newFormData.append("description", formData.description);
            newFormData.append("location", formData.location);
            newFormData.append("status", formData.status);

            console.log("new form gallery_img", newFormData.get("gallery_img"));
            console.log("new form title", newFormData.get("title"));

            console.log("image", image);

            const createdGallery = await dispatch(createGalleryThunk(newFormData));
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
                <form onSubmit={handleSubmit} className="create-gallery-form"
                    encType="multipart/form-data">
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
                            type="file"
                            id="gallery_img"
                            name="gallery_img"
                            accept="image/*"
                            // value={formData.gallery_img}
                            onChange={(e) => setImage(e.target.files[0])}
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
