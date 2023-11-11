import React, { useState, useEffect, Children } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateGalleryThunk, getGalleryThunk } from "../../store/galleries";

import './UpdateGallery.css';

const EditGallery = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { galleryId } = useParams();

  const currentUser = useSelector((state) => state.session.user);

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    status: false,
    gallery_img: "",
  });

  const gallery = useSelector((state) => Object.values(state.galleries.singleGallery)[0]);

  useEffect(() => {
    dispatch(getGalleryThunk(galleryId));
  }, [dispatch, galleryId]);

  useEffect(() => {
    if (gallery && gallery.title) {
      setFormData({
        title: gallery.title,
        description: gallery.description,
        location: gallery.location,
        status: gallery.status,
        gallery_img: gallery.gallery_img,
      });
    }
  }, [gallery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setFormData({
        ...formData,
        [name]: value === "true",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const [image, setImage] = useState(formData.gallery_img);

  const ALLOWED_EXTENSIONS = ["pdf", "png", "jpg", "jpeg", "gif"];

  const isAllowedExtension = (filename) => {
    const ext = filename.split('.').pop();
    return ALLOWED_EXTENSIONS.includes(ext.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Image populated", formData.gallery_img);

    const newErrors = {};

    if (!formData.title || formData.title.length < 6 || formData.title.length > 50) {
      newErrors.title = "Title is required and must be between 6 and 50 characters";
    }

    if (!formData.description || formData.description.length < 30 || formData.description.length > 1000) {
      newErrors.description = "Description is required and must be between 30 and 1000 characters";
    }

    if (!formData.location || formData.location.length < 5 || formData.location.length > 255) {
      newErrors.location = "Location is required and must be between 5 and 255 characters.";
    }

    if (image && !isAllowedExtension(image.name)) {
      newErrors.gallery_img = "Invalid file format. Allowed formats: " + ALLOWED_EXTENSIONS.join(", ");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      const newFormData = new FormData();

      if (image) {
        newFormData.append("gallery_img", image);
      } else {
        // Only append the existing image if no new image is selected
        newFormData.append("gallery_img", formData.gallery_img);
      }

      newFormData.append("title", formData.title);
      newFormData.append("description", formData.description);
      newFormData.append("location", formData.location);
      newFormData.append("status", formData.status);

      console.log("Form data handleSubmit", formData);
      console.log("New uploaded image", image);
      console.log("updatedFormData", newFormData);
      console.log("new form gallery_img", newFormData.get("gallery_img"));
      console.log("new form title", newFormData.get("title"));

      const updatedGallery = await dispatch(updateGalleryThunk(newFormData, galleryId));
      if (updatedGallery) {
        history.push("/my-galleries");
      } else {
        setErrors(updatedGallery);
        console.log("Gallery update failed");
      }

      // Reset the image state to null after submitting
      setImage(null);
    }
  };



  return (
    <div className="edit-gallery__wrapper">
      {currentUser ? (
        <>
          <h2>Edit Gallery</h2>
          <form onSubmit={handleSubmit} className="edit-gallery-form">
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

              {formData.gallery_img && (
                <div>
                  <a href={formData.gallery_img} target="_blank" rel="noopener noreferrer" download>
                    Open Existing Image
                  </a>
                </div>
              )}

              <input
                type="file"
                id="gallery_img"
                name="gallery_img"
                accept="image/*"
                // defaultValue={formData.gallery_img}
                onChange={(e) => setImage(e.target.files[0])}
                className="text-input"
              />
              {errors.gallery_img && <span className='error'>{errors.gallery_img}</span>}
            </div>

            <button type="submit" className="submit-button">Update Gallery</button>
          </form>
        </>
      ) : (<p>You need to login to create a new gallery.</p>)}
    </div>
  );
};

export default EditGallery;
