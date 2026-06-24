"use client";

import { useState } from "react";
import styles from "../products.module.css";

const AddMobilePage = () => {
  const [formData, setFormData] = useState({
    title: "",
    model: "",
    price: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      api: "",
    }));

    setMessage("");
  };

  const validateForm = () => {
    const newErrors = {};
    const { title, model, price } = formData;

    if (!title.trim()) {
      newErrors.title = "Mobile title is required";
    } else if (title.trim().length < 2) {
      newErrors.title = "Mobile title must have at least 2 characters";
    }

    if (!model.trim()) {
      newErrors.model = "Mobile model is required";
    } else if (model.trim().length < 2) {
      newErrors.model = "Mobile model must have at least 2 characters";
    }

    if (!price) {
      newErrors.price = "Mobile price is required";
    } else if (Number(price) <= 0) {
      newErrors.price = "Mobile price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addMobileHandler = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const response = await fetch("/api/products/mobiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          model: formData.model.trim(),
          price: Number(formData.price),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({
          api: result.message || "Mobile was not added",
        });
        return;
      }

      setMessage(result.message || "Mobile added successfully");

      setFormData({
        title: "",
        model: "",
        price: "",
      });

      setErrors({});
    } catch {
      setErrors({
        api: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form className={styles.formSection} onSubmit={addMobileHandler}>
        <h1>Add Mobile In Database</h1>

        {message && <p className={styles.successMessage}>{message}</p>}

        {errors.api && (
          <p className={styles.errorMessage}>{errors.api}</p>
        )}

        <div className={styles.fromInp}>
          <label htmlFor="title">Mobile Title / Name</label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            placeholder="Enter Mobile Name"
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
            placeholder="Enter Mobile Brand"
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
            placeholder="Enter Mobile Price"
            onChange={handleChange}
          />

          {errors.price && (
            <small className={styles.errorMessage}>{errors.price}</small>
          )}
        </div>

        <button
          type="submit"
          className={styles.formBtn}
          disabled={isLoading}
        >
          {isLoading ? "Adding Mobile..." : "Add Mobile"}
        </button>
      </form>
    </div>
  );
};

export default AddMobilePage;