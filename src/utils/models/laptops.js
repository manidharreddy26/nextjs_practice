import mongoose from "mongoose";

const LaptopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  model: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const LaptopModel =
  mongoose.models.Laptop || mongoose.model(`laptop`, LaptopSchema);

export default LaptopModel;
