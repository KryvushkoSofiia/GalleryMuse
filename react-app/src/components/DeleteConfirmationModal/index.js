import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "./DeleteConfirmationModal.css";
import { deleteGalleryThunk } from "../../store/galleries";
import { Modal, useModal } from "../../context/Modal";

import './DeleteConfirmationModal.css'

const DeleteConfirmationModal = ({ galleryId, show, onCancel }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteGalleryThunk(galleryId));
    closeModal();
  };
  // if (!show) return null;
  const handleCancel = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className="delete-confirmation-modal">
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to remove this gallery?</p>
      <div className="button-container">
        <button className="confirm-delete-button" onClick={handleDelete}>
          Yes (Delete gallery)
        </button>
        {/* <button className="cancel-delete-button" onClick={onCancel}> */}
        <button className="cancel-delete-button" onClick={handleCancel}>
          No (Keep gallery)
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
