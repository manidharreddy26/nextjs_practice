"use client";

import { useEffect, useState } from "react";
import styles from "../products.module.css";

const ManageMobilesPage = () => {
  const [mobiles, setMobiles] = useState([]);
  const [selectedMobile, setSelectedMobile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    model: "",
    price: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState("");

  const getAllMobiles = async () => {
    try {
      const response = await fetch("/api/products/mobiles");
      const result = await response.json();

      if (!response.ok) {
        setApiError(result.message || "Failed to get mobiles");
        return;
      }

      setMobiles(result.mobiledata || []);
    } catch {
      setApiError("Something went wrong while getting mobiles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getAllMobiles();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const clearMessages = () => {
    setMessage("");
    setApiError("");
  };

  const cancelUpdate = () => {
    setSelectedMobile(null);
    setFormData({ title: "", model: "", price: "" });
    setErrors({});
  };

  const openUpdateForm = (mobile) => {
    setSelectedMobile(mobile);

    setFormData({
      title: mobile.title,
      model: mobile.model,
      price: mobile.price,
    });

    setErrors({});
    clearMessages();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { title, model, price } = formData;

    if (!title.trim()) {
      newErrors.title = "Mobile title is required";
    } else if (title.trim().length < 2) {
      newErrors.title = "Mobile title must contain at least 2 characters";
    }

    if (!model.trim()) {
      newErrors.model = "Mobile model is required";
    } else if (model.trim().length < 2) {
      newErrors.model = "Mobile model must contain at least 2 characters";
    }

    if (!price || Number(price) <= 0) {
      newErrors.price = "Mobile price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateMobileHandler = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!validateForm()) return;

    try {
      setIsUpdating(true);

      const response = await fetch(
        `/api/products/mobiles?id=${selectedMobile._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newtitle: formData.title.trim(),
            newmodel: formData.model.trim(),
            newprice: Number(formData.price),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.message || "Mobile update failed");
        return;
      }

      setMessage(result.message || "Mobile updated successfully");
      cancelUpdate();
      getAllMobiles();
    } catch {
      setApiError("Something went wrong while updating mobile");
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteMobileHandler = async (mobileId, mobileTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${mobileTitle}"?`)) {
      return;
    }

    try {
      setIsDeletingId(mobileId);
      clearMessages();

      const response = await fetch(`/api/products/mobiles?id=${mobileId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.message || "Mobile delete failed");
        return;
      }

      setMessage(result.message || "Mobile deleted successfully");

      if (selectedMobile?._id === mobileId) {
        cancelUpdate();
      }

      getAllMobiles();
    } catch {
      setApiError("Something went wrong while deleting mobile");
    } finally {
      setIsDeletingId("");
    }
  };

  return (
    <div className={styles.manageContainer}>
      <h1>Manage Mobiles</h1>

      {message && <p className={styles.successMessage}>{message}</p>}
      {apiError && <p className={styles.errorMessage}>{apiError}</p>}

      {isLoading ? (
        <p>Loading mobiles...</p>
      ) : mobiles.length === 0 ? (
        <p>No mobiles found. Add a mobile first.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.laptopTable}>
            <thead>
              <tr>
                <th>Mobile ID</th>
                <th>Mobile Name</th>
                <th>Mobile Model</th>
                <th>Mobile Price</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {mobiles.map((mobile) => (
                <tr key={mobile._id}>
                  <td className={styles.idCell}>{mobile._id}</td>
                  <td>{mobile.title}</td>
                  <td>{mobile.model}</td>
                  <td>₹ {Number(mobile.price).toLocaleString("en-IN")}</td>

                  <td className={styles.actionCell}>
                    <button
                      type="button"
                      className={styles.updateBtn}
                      onClick={() => openUpdateForm(mobile)}
                    >
                      Update
                    </button>

                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() =>
                        deleteMobileHandler(mobile._id, mobile.title)
                      }
                      disabled={isDeletingId === mobile._id}
                    >
                      {isDeletingId === mobile._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedMobile && (
        <form className={styles.updateForm} onSubmit={updateMobileHandler}>
          <h2>Update Mobile</h2>

          <div className={styles.fromInp}>
            <label htmlFor="title">Mobile Title / Name</label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
            />

            {errors.title && (
              <small className={styles.errorMessage}>{errors.title}</small>
            )}
          </div>

          <div className={styles.fromInp}>
            <label htmlFor="model">Mobile Model</label>

            <input
              id="model"
              name="model"
              type="text"
              value={formData.model}
              onChange={handleChange}
            />

            {errors.model && (
              <small className={styles.errorMessage}>{errors.model}</small>
            )}
          </div>

          <div className={styles.fromInp}>
            <label htmlFor="price">Mobile Price</label>

            <input
              id="price"
              name="price"
              type="number"
              min="1"
              value={formData.price}
              onChange={handleChange}
            />

            {errors.price && (
              <small className={styles.errorMessage}>{errors.price}</small>
            )}
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.formBtn}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Save Update"}
            </button>

            <button
              type="button"
              className={styles.cancelBtn}
              onClick={cancelUpdate}
              disabled={isUpdating}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ManageMobilesPage;
