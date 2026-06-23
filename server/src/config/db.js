import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI not set. Please set MONGO_URI in your environment or .env file.");
    }
    // Use sensible options and bubble up errors so the caller can handle them
    await mongoose.connect(uri, {
      // Mongoose 6+ uses sensible defaults; include options for clarity
      // useNewUrlParser and useUnifiedTopology are true by default in current Mongoose
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // Rethrow so callers (startup) can stop the process and avoid buffering-timeout errors
    throw err;
  }
};
