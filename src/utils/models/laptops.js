import mongoose from "mongoose";

const LaptopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const LaptopModel =
  mongoose.models.Laptop || mongoose.model("Laptop", LaptopSchema);

export default LaptopModel;
