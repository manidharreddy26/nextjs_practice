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

const ManageLaptopsPage = () => {
  const [laptops, setLaptops] = useState([]);
  const [selectedLaptop, setSelectedLaptop] = useState(null);

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

  const getAllLaptops = async () => {
    try {
      setIsLoading(true);
      setApiError("");

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
    const timer = setTimeout(getAllLaptops, 0);

    return () => clearTimeout(timer);
  }, []);

  const cancelUpdate = () => {
    setSelectedLaptop(null);
    setFormData(emptyForm);
    setNewImage("");
    setImagePreview("");
    setErrors({});

    const imageInput = document.getElementById("updateImage");

    if (imageInput) {
      imageInput.value = "";
    }
  };

  const openUpdateForm = (laptop) => {
    setSelectedLaptop(laptop);

    setFormData({
      title: laptop.title,
      model: laptop.model,
      price: laptop.price,
    });

    setNewImage("");
    setImagePreview(laptop.image || "");
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
        api: "",
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
      newErrors.title = "Laptop title is required";
    } else if (cleanTitle.length < 2) {
      newErrors.title = "Laptop title must contain at least 2 characters";
    } else if (cleanTitle.length > 60) {
      newErrors.title = "Laptop title cannot exceed 60 characters";
    }

    if (!cleanModel) {
      newErrors.model = "Laptop model is required";
    } else if (cleanModel.length < 2) {
      newErrors.model = "Laptop model must contain at least 2 characters";
    } else if (cleanModel.length > 60) {
      newErrors.model = "Laptop model cannot exceed 60 characters";
    }

    if (!formData.price) {
      newErrors.price = "Laptop price is required";
    } else if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      newErrors.price = "Laptop price must be greater than 0";
    } else if (numericPrice > 10000000) {
      newErrors.price = "Enter a valid laptop price";
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

  const deleteLaptopHandler = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      setIsDeletingId(id);
      clearMessages();

      const response = await fetch(`/api/products/laptops?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.message || "Laptop delete failed");
        return;
      }

      setMessage(result.message || "Laptop deleted successfully");

      if (selectedLaptop?._id === id) {
        cancelUpdate();
      }

      getAllLaptops();
    } catch {
      setApiError("Something went wrong while deleting laptop");
    } finally {
      setIsDeletingId("");
    }
  };

  const filteredLaptops = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    const data = laptops.filter(
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
  }, [laptops, searchText, sortBy]);

  const totalPages = Math.ceil(filteredLaptops.length / ITEMS_PER_PAGE);

  const visibleLaptops = filteredLaptops.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const changeFilter = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={styles.manageContainer}>
      <h1>Manage Laptops</h1>

      {message && <p className={styles.successMessage}>{message}</p>}

      {apiError && <p className={styles.errorMessage}>{apiError}</p>}

      <div className={styles.filterSection}>
        <input
          type="text"
          placeholder="Search by laptop name or model..."
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
          Showing {filteredLaptops.length} laptop
          {filteredLaptops.length !== 1 ? "s" : ""}
        </p>
      )}

      {isLoading ? (
        <p>Loading laptops...</p>
      ) : filteredLaptops.length === 0 ? (
        <p>No data matched your search.</p>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.laptopTable}>
              <thead>
                <tr>
                  <th>Laptop ID</th>
                  <th>Image</th>
                  <th>Laptop Name</th>
                  <th>Laptop Model</th>
                  <th>Laptop Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleLaptops.map((laptop) => (
                  <tr key={laptop._id}>
                    <td className={styles.idCell}>{laptop._id}</td>

                    <td>
                      {laptop.image ? (
                        <Image
                          src={laptop.image}
                          alt={laptop.title}
                          width={70}
                          height={55}
                          className={styles.tableImage}
                          unoptimized
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>

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
              maxLength={60}
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
              maxLength={60}
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
              max="10000000"
              value={formData.price}
              onChange={handleChange}
            />

            {errors.price && (
              <small className={styles.errorMessage}>{errors.price}</small>
            )}
          </div>

          <div className={styles.fromInp}>
            <label htmlFor="updateImage">Change Laptop Image (optional)</label>

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
                alt="Laptop preview"
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

export default ManageLaptopsPage;
