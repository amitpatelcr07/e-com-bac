import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
console.log("MONGO_URI from .env:", process.env.MONGO_URI);
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI environment variable is not set");
  }
  try {
    await mongoose.connect(uri, {
      ssl: true,
      retryWrites: true,
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB connection error (non-fatal):", error.message);
    // Do not throw — allow server to run for testing
  }
};

export default connectDB;
