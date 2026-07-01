"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import styles from "../products.module.css";

const ITEMS_PER_PAGE = 5;

const emptyForm = {
  title: "",
  model: "",
  price: "",
};

const ManageMobilesPage = () => {
  const [mobiles, setMobiles] = useState([]);
  const [selectedMobile, setSelectedMobile] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [newImage, setNewImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState("");

  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const clearMessages = () => {
    setMessage("");
    setApiError("");
  };

  const getAllMobiles = async () => {
    try {
      setIsLoading(true);
      setApiError("");

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
    const timer = setTimeout(getAllMobiles, 0);

    return () => clearTimeout(timer);
  }, []);

  const cancelUpdate = () => {
    setSelectedMobile(null);
    setFormData(emptyForm);
    setNewImage("");
    setImagePreview("");
    setErrors({});

    const imageInput = document.getElementById("updateImage");

    if (imageInput) {
      imageInput.value = "";
    }
  };

  const openUpdateForm = (mobile) => {
    setSelectedMobile(mobile);

    setFormData({
      title: mobile.title,
      model: mobile.model,
      price: mobile.price,
    });

    setNewImage("");
    setImagePreview(mobile.image || "");
    setErrors({});
    clearMessages();

    const imageInput = document.getElementById("updateImage");

    if (imageInput) {
      imageInput.value = "";
    }
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const updateImageHandler = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setNewImage("");
      e.target.value = "";

      setErrors((prev) => ({
        ...prev,
        image: "Only JPG, PNG, and WEBP images are allowed",
      }));

      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setNewImage("");
      e.target.value = "";

      setErrors((prev) => ({
        ...prev,
        image: "Image size must be less than 2 MB",
      }));

      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setNewImage(reader.result);
      setImagePreview(reader.result);

      setErrors((prev) => ({
        ...prev,
        image: "",
      }));

      setApiError("");
    };

    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
    const cleanTitle = formData.title.trim();
    const cleanModel = formData.model.trim();
    const numericPrice = Number(formData.price);

    if (!cleanTitle) {
      newErrors.title = "Mobile title is required";
    } else if (cleanTitle.length < 2) {
      newErrors.title = "Mobile title must contain at least 2 characters";
    } else if (cleanTitle.length > 60) {
      newErrors.title = "Mobile title cannot exceed 60 characters";
    }

    if (!cleanModel) {
      newErrors.model = "Mobile model is required";
    } else if (cleanModel.length < 2) {
      newErrors.model = "Mobile model must contain at least 2 characters";
    } else if (cleanModel.length > 60) {
      newErrors.model = "Mobile model cannot exceed 60 characters";
    }

    if (!formData.price) {
      newErrors.price = "Mobile price is required";
    } else if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      newErrors.price = "Mobile price must be greater than 0";
    } else if (numericPrice > 10000000) {
      newErrors.price = "Enter a valid mobile price";
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
            newimage: newImage,
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

  const deleteMobileHandler = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      setIsDeletingId(id);
      clearMessages();

      const response = await fetch(`/api/products/mobiles?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.message || "Mobile delete failed");
        return;
      }

      setMessage(result.message || "Mobile deleted successfully");

      if (selectedMobile?._id === id) {
        cancelUpdate();
      }

      getAllMobiles();
    } catch {
      setApiError("Something went wrong while deleting mobile");
    } finally {
      setIsDeletingId("");
    }
  };

  const filteredMobiles = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    const data = mobiles.filter(
      ({ title, model }) =>
        title.toLowerCase().includes(search) ||
        model.toLowerCase().includes(search),
    );

    const sortFunctions = {
      newest: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),

      "name-asc": (a, b) => a.title.localeCompare(b.title),

      "name-desc": (a, b) => b.title.localeCompare(a.title),

      "price-low-high": (a, b) => Number(a.price) - Number(b.price),

      "price-high-low": (a, b) => Number(b.price) - Number(a.price),
    };

    return [...data].sort(sortFunctions[sortBy]);
  }, [mobiles, searchText, sortBy]);

  const totalPages = Math.ceil(filteredMobiles.length / ITEMS_PER_PAGE);

  const visibleMobiles = filteredMobiles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const changeFilter = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={styles.manageContainer}>
      <h1>Manage Mobiles</h1>

      {message && <p className={styles.successMessage}>{message}</p>}

      {apiError && <p className={styles.errorMessage}>{apiError}</p>}

      <div className={styles.filterSection}>
        <input
          type="text"
          placeholder="Search by mobile name or model..."
          value={searchText}
          onChange={changeFilter(setSearchText)}
          className={styles.searchInput}
        />

        <select
          value={sortBy}
          onChange={changeFilter(setSortBy)}
          className={styles.sortSelect}
        >
          <option value="newest">Newest First</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
        </select>
      </div>

      {!isLoading && (
        <p className={styles.resultCount}>
          Showing {filteredMobiles.length} mobile
          {filteredMobiles.length !== 1 ? "s" : ""}
        </p>
      )}

      {isLoading ? (
        <p>Loading mobiles...</p>
      ) : filteredMobiles.length === 0 ? (
        <p>No data matched your search.</p>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.laptopTable}>
              <thead>
                <tr>
                  <th>Mobile ID</th>
                  <th>Image</th>
                  <th>Mobile Name</th>
                  <th>Mobile Model</th>
                  <th>Mobile Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleMobiles.map((mobile) => (
                  <tr key={mobile._id}>
                    <td className={styles.idCell}>{mobile._id}</td>

                    <td>
                      {mobile.image ? (
                        <Image
                          src={mobile.image}
                          alt={mobile.title}
                          width={70}
                          height={55}
                          className={styles.tableImage}
                          unoptimized
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>

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

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? styles.activePage : ""}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
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
              maxLength={60}
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
              maxLength={60}
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
              max="10000000"
              value={formData.price}
              onChange={handleChange}
            />

            {errors.price && (
              <small className={styles.errorMessage}>{errors.price}</small>
            )}
          </div>

          <div className={styles.fromInp}>
            <label htmlFor="updateImage">Change Mobile Image (optional)</label>

            <input
              id="updateImage"
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={updateImageHandler}
            />

            <small>Allowed: JPG, PNG, WEBP. Maximum size: 2 MB.</small>

            {errors.image && (
              <small className={styles.errorMessage}>{errors.image}</small>
            )}

            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Mobile preview"
                width={140}
                height={100}
                className={styles.imagePreview}
                unoptimized
              />
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
