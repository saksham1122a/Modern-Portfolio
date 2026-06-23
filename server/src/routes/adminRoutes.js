import express from "express";
import { login, seedAdmin, getMe } from "../controllers/adminController.js";
import { getDashboardStats } from "../controllers/statsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/seed", seedAdmin);           // run once, then leave it — it's idempotent
router.get("/me", protect, getMe);
router.get("/stats", protect, getDashboardStats);

export default router;
