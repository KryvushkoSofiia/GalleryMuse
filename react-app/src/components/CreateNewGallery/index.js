import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { createGalleryThunk } from "../../store/galleries";

const CreateNewGallery = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        status: false,
        gallery_img: "",
    });

    const [errors, setErrors] = useState({});

    // Handle changes in the form inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("FormData", formData);
        const createdGallery = dispatch(createGalleryThunk(formData))
        if (createdGallery) {
            history.push("/galleries/");
          } else {
            return "Error"; 
          }
    };

    return (
        <div className="create-gallery__wrapper">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Status:</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                    >
                        <option value={true}>Visited</option>
                        <option value={false}>Not Visited</option>
                    </select>
                </div>

                <div>
                    <label>Gallery Image:</label>
                    <input
                        type="text"
                        name="gallery_img"
                        value={formData.gallery_img}
                        onChange={handleInputChange}
                    />
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateNewGallery;
