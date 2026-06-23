import express from "express";
import rateLimit from "express-rate-limit";
import { submitContactForm, getMessages, markRead, deleteMessage } from "../controllers/contactController.js";
import { contactValidationRules, validate } from "../middleware/validators.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many requests. Please try again later." },
});

router.post("/", contactLimiter, contactValidationRules, validate, submitContactForm);
router.get("/", protect, getMessages);
router.patch("/:id/read", protect, markRead);
router.delete("/:id", protect, deleteMessage);

export default router;
