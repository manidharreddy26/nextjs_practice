import mongoose from "mongoose";

export const DBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDb connection is done");
  } catch (error) {
    console.log(error);
  }
};
 