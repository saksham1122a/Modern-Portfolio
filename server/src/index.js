import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import contactRoutes from "./routes/contactRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import Admin from "./models/Admin.js";
import { seedMockData } from "./config/seedData.js";

dotenv.config();

const app = express();

// --- Core middleware ---
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// --- Health check ---
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

// --- Routes ---
app.use("/api/contact", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server only after a successful DB connection. If the connection fails,
// exit with non-zero code so the failure is obvious and requests won't trigger
// Mongoose buffering timeouts.
connectDB()
  .then(async () => {
    // Auto-seed admin user based on environment variables
    try {
      const email = process.env.ADMIN_EMAIL || "sakshamnnda01@gmail.com";
      const password = process.env.ADMIN_PASSWORD || "Saksham@12345";
      const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
      if (existing) {
        existing.password = password;
        await existing.save();
        console.log("Admin account verified/updated successfully");
      } else {
        await Admin.create({ email, password });
        console.log(`Admin account created with email: ${email}`);
      }
    } catch (err) {
      console.error("Error auto-seeding admin account:", err);
    }

    // Auto-seed projects, skills, and experiences if database collections are empty
    await seedMockData();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB, aborting startup:", err);
    process.exit(1);
  });

export default app;
