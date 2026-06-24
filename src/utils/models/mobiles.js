import mongoose from "mongoose";

const MobileSchema = new mongoose.Schema(
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

const MobileModel =
  mongoose.models.Mobile || mongoose.model("Mobile", MobileSchema);

export default MobileModel;
