"use client";

import { useEffect, useState } from "react";
import styles from "../products.module.css";

const ManageLaptopsPage = () => {
  const [laptops, setLaptops] = useState([]);
  const [selectedLaptop, setSelectedLaptop] = useState(null);

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

  const getAllLaptops = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/products/laptops");
      const result = await response.json();

      if (!response.ok) {
        setApiError(result.message || "Failed to get laptops");
        return;
      }

      setLaptops(result.laptopdata || []);
    } catch {
      setApiError("Something went wrong while getting laptops");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getAllLaptops();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const clearMessages = () => {
    setMessage("");
    setApiError("");
  };

  const cancelUpdate = () => {
    setSelectedLaptop(null);
    setFormData({ title: "", model: "", price: "" });
    setErrors({});
  };

  const openUpdateForm = (laptop) => {
    setSelectedLaptop(laptop);

    setFormData({
      title: laptop.title,
      model: laptop.model,
      price: laptop.price,
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
      newErrors.title = "Laptop title is required";
    } else if (title.trim().length < 2) {
      newErrors.title = "Laptop title must contain at least 2 characters";
    }

    if (!model.trim()) {
      newErrors.model = "Laptop model is required";
    } else if (model.trim().length < 2) {
      newErrors.model = "Laptop model must contain at least 2 characters";
    }

    if (!price || Number(price) <= 0) {
      newErrors.price = "Laptop price must be greater than 0";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const updateLaptopHandler = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!validateForm()) return;

    try {
      setIsUpdating(true);

      const response = await fetch(
        `/api/products/laptops?id=${selectedLaptop._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newtitle: formData.title.trim(),
            newmodel: formData.model.trim(),
            newprice: Number(formData.price),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.message || "Laptop update failed");
        return;
      }

      setMessage(result.message || "Laptop updated successfully");
      cancelUpdate();
      getAllLaptops();
    } catch {
      setApiError("Something went wrong while updating laptop");
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteLaptopHandler = async (laptopId, laptopTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${laptopTitle}"?`)) {
      return;
    }

    try {
      setIsDeletingId(laptopId);
      clearMessages();

      const response = await fetch(`/api/products/laptops?id=${laptopId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.message || "Laptop delete failed");
        return;
      }

      setMessage(result.message || "Laptop deleted successfully");

      if (selectedLaptop?._id === laptopId) {
        cancelUpdate();
      }

      getAllLaptops();
    } catch {
      setApiError("Something went wrong while deleting laptop");
    } finally {
      setIsDeletingId("");
    }
  };

  return (
    <div className={styles.manageContainer}>
      <h1>Manage Laptops</h1>

      {message && <p className={styles.successMessage}>{message}</p>}
      {apiError && <p className={styles.errorMessage}>{apiError}</p>}

      {isLoading ? (
        <p>Loading laptops...</p>
      ) : laptops.length === 0 ? (
        <p>No laptops found. Add a laptop first.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.laptopTable}>
            <thead>
              <tr>
                <th>Laptop ID</th>
                <th>Laptop Name</th>
                <th>Laptop Model</th>
                <th>Laptop Price</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {laptops.map((laptop) => (
                <tr key={laptop._id}>
                  <td className={styles.idCell}>{laptop._id}</td>
                  <td>{laptop.title}</td>
                  <td>{laptop.model}</td>
                  <td>₹ {Number(laptop.price).toLocaleString("en-IN")}</td>

                  <td className={styles.actionCell}>
                    <button
                      type="button"
                      className={styles.updateBtn}
                      onClick={() => openUpdateForm(laptop)}
                    >
                      Update
                    </button>

                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() =>
                        deleteLaptopHandler(laptop._id, laptop.title)
                      }
                      disabled={isDeletingId === laptop._id}
                    >
                      {isDeletingId === laptop._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedLaptop && (
        <form className={styles.updateForm} onSubmit={updateLaptopHandler}>
          <h2>Update Laptop</h2>

          <div className={styles.fromInp}>
            <label htmlFor="title">Laptop Title / Name</label>
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
            <label htmlFor="model">Laptop Model</label>
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
            <label htmlFor="price">Laptop Price</label>
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

export default ManageLaptopsPage;
