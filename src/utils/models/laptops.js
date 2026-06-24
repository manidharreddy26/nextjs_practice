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
  },
  {
    timestamps: true,
  },
);

// "Laptop" must be exactly the same in both places
const LaptopModel =
  mongoose.models.Laptop || mongoose.model("Laptop", LaptopSchema);

export default LaptopModel;
