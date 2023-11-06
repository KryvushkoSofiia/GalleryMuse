import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateGalleryThunk, getGalleryThunk } from "../../store/galleries";


import './UpdateGallery.css';


const EditGallery = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { galleryId } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    status: false,
    gallery_img: "",
  });

  const gallery = useSelector((state) => Object.values(state.galleries.singleGallery)[0]);
  // console.log("Gallery data received:", gallery);

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

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setFormData({
        ...formData,
        [name]: value === "true", // Check if value is "true"
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedGallery = await dispatch(
      updateGalleryThunk(formData, galleryId)
    );
    history.push('/my-galleries')
    // console.log("UpdateGallery", updatedGallery);

    // if (updatedGallery) {
    //   console.log('Redirecting to gallery page');
    //   history.push(`/galleries/${galleryId}`);
    // } else {
    //   setErrors(updatedGallery);
    // }
  };

  return (
    <div className="edit-gallery__wrapper">
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

        <button type="submit" className="submit-button">Update Gallery</button>
      </form>
    </div>
  );
};

export default EditGallery;
