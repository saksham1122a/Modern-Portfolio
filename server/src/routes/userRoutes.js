import express from "express";
import rateLimit from "express-rate-limit";
import { register, login, getMe, listUsers, deleteUser } from "../controllers/userController.js";
import { requireAuth } from "../middleware/userAuthMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";  // admin protect

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many requests, try again later" },
});

router.post("/register", authLimiter, register);
router.post("/login",    authLimiter, login);
router.get("/me",        requireAuth,  getMe);

// Admin-only routes
router.get("/",          protect, listUsers);
router.delete("/:id",   protect, deleteUser);

export default router;
