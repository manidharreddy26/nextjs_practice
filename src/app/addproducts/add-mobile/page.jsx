"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "../products.module.css";

const AddMobilePage = () => {
  const [title, setTitle] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    const cleanTitle = title.trim();
    const cleanModel = model.trim();
    const numericPrice = Number(price);

    if (!cleanTitle) {
      newErrors.title = "Mobile title is required";
    } else if (cleanTitle.length < 2) {
      newErrors.title = "Mobile title must have at least 2 characters";
    } else if (cleanTitle.length > 60) {
      newErrors.title = "Mobile title cannot exceed 60 characters";
    }

    if (!cleanModel) {
      newErrors.model = "Mobile model is required";
    } else if (cleanModel.length < 2) {
      newErrors.model = "Mobile model must have at least 2 characters";
    } else if (cleanModel.length > 60) {
      newErrors.model = "Mobile model cannot exceed 60 characters";
    }

    if (!price) {
      newErrors.price = "Mobile price is required";
    } else if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      newErrors.price = "Mobile price must be greater than 0";
    } else if (numericPrice > 10000000) {
      newErrors.price = "Enter a valid mobile price";
    }

    if (!image) {
      newErrors.image = "Mobile image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const imageHandler = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setImage("");
      setImagePreview("");
      e.target.value = "";

      setErrors((prev) => ({
        ...prev,
        image: "Only JPG, PNG, and WEBP images are allowed",
      }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImage("");
      setImagePreview("");
      e.target.value = "";

      setErrors((prev) => ({
        ...prev,
        image: "Image size must be less than 2 MB",
      }));
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
      setImagePreview(reader.result);

      setErrors((prev) => ({
        ...prev,
        image: "",
        api: "",
      }));
    };

    reader.readAsDataURL(file);
  };

  const addMobileHandler = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const response = await fetch("/api/products/mobiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          model: model.trim(),
          price: Number(price),
          image,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({
          api: result.message || "Mobile was not added",
        });
        return;
      }

      setSuccessMessage(result.message || "Mobile added successfully");

      setTitle("");
      setModel("");
      setPrice("");
      setImage("");
      setImagePreview("");
      setErrors({});

      document.getElementById("image").value = "";
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

        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}

        {errors.api && <p className={styles.errorMessage}>{errors.api}</p>}

        <div className={styles.fromInp}>
          <label htmlFor="title">Mobile Title / Name</label>

          <input
            id="title"
            type="text"
            value={title}
            placeholder="Enter Mobile Name"
            maxLength={60}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: "", api: "" }));
            }}
          />

          {errors.title && (
            <small className={styles.errorMessage}>{errors.title}</small>
          )}
        </div>

        <div className={styles.fromInp}>
          <label htmlFor="model">Mobile Model</label>

          <input
            id="model"
            type="text"
            value={model}
            placeholder="Enter Mobile Model"
            maxLength={60}
            onChange={(e) => {
              setModel(e.target.value);
              setErrors((prev) => ({ ...prev, model: "", api: "" }));
            }}
          />

          {errors.model && (
            <small className={styles.errorMessage}>{errors.model}</small>
          )}
        </div>

        <div className={styles.fromInp}>
          <label htmlFor="price">Mobile Price</label>

          <input
            id="price"
            type="number"
            value={price}
            placeholder="Enter Mobile Price"
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

        <div className={styles.fromInp}>
          <label htmlFor="image">Mobile Image</label>

          <input
            id="image"
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={imageHandler}
          />

          <small>Allowed: JPG, PNG, WEBP. Maximum size: 2 MB.</small>

          {errors.image && (
            <small className={styles.errorMessage}>{errors.image}</small>
          )}

          {imagePreview && (
            <Image
              src={imagePreview}
              alt="Selected mobile preview"
              width={140}
              height={100}
              className={styles.imagePreview}
              unoptimized
            />
          )}
        </div>

        <button type="submit" className={styles.formBtn} disabled={isLoading}>
          {isLoading ? "Adding Mobile..." : "Add Mobile"}
        </button>
      </form>
    </div>
  );
};

export default AddMobilePage;
