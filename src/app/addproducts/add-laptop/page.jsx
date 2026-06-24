"use client";

import { useState } from "react";
import styles from "../products.module.css";

const AddLaptopPage = () => {
  const [title, setTitle] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    const cleanTitle = title.trim();
    const cleanModel = model.trim();
    const numericPrice = Number(price);

    if (!cleanTitle) {
      newErrors.title = "Laptop title is required";
    } else if (cleanTitle.length < 2) {
      newErrors.title = "Laptop title must have at least 2 characters";
    } else if (cleanTitle.length > 60) {
      newErrors.title = "Laptop title cannot exceed 60 characters";
    }

    if (!cleanModel) {
      newErrors.model = "Laptop model is required";
    } else if (cleanModel.length < 2) {
      newErrors.model = "Laptop model must have at least 2 characters";
    } else if (cleanModel.length > 60) {
      newErrors.model = "Laptop model cannot exceed 60 characters";
    }

    if (!price) {
      newErrors.price = "Laptop price is required";
    } else if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      newErrors.price = "Laptop price must be greater than 0";
    } else if (numericPrice > 10000000) {
      newErrors.price = "Enter a valid laptop price";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const laptopDataHandler = async (e) => {
    e.preventDefault();

    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/products/laptops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          model: model.trim(),
          price: Number(price),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({
          api: result.message || "Laptop was not added",
        });
        return;
      }

      setSuccessMessage(result.message || "Laptop added successfully");

      setTitle("");
      setModel("");
      setPrice("");
      setErrors({});
    } catch (error) {
      setErrors({
        api: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form className={styles.formSection} onSubmit={laptopDataHandler}>
        <h1>Add Laptop In Database</h1>

        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}

        {errors.api && <p className={styles.errorMessage}>{errors.api}</p>}

        <div className={styles.fromInp}>
          <label htmlFor="title">Laptop Title / Name</label>

          <input
            id="title"
            type="text"
            value={title}
            placeholder="Enter Laptop Name"
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: "", api: "" }));
            }}
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
            type="text"
            value={model}
            placeholder="Enter Laptop Model"
            onChange={(e) => {
              setModel(e.target.value);
              setErrors((prev) => ({ ...prev, model: "", api: "" }));
            }}
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
            type="number"
            value={price}
            placeholder="Enter Laptop Price"
            min="1"
            max="10000000"
            onChange={(e) => {
              setPrice(e.target.value);
              setErrors((prev) => ({ ...prev, price: "", api: "" }));
            }}
          />

          {errors.price && (
            <small className={styles.errorMessage}>{errors.price}</small>
          )}
        </div>

        <button type="submit" className={styles.formBtn} disabled={isLoading}>
          {isLoading ? "Adding Laptop..." : "Add Laptop"}
        </button>
      </form>
    </div>
  );
};

export default AddLaptopPage;
