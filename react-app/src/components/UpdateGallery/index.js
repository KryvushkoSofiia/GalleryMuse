import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateGalleryThunk, getGalleryThunk } from "../../store/galleries";

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
  console.log("Gallery data received:", gallery);

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

    if (updatedGallery) {
      history.push(`/galleries/${galleryId}`);
    } else {
      setErrors(updatedGallery);
    }
  };

  return (
    <div className="edit-gallery__wrapper">
      <h2>Edit Gallery</h2>
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

        <button type="submit">Update Gallery</button>
      </form>
    </div>
  );
};

export default EditGallery;
