import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const signToken = (id, email) =>
  jwt.sign({ id, email }, process.env.JWT_SECRET || "changeme_secret", {
    expiresIn: "7d",
  });

// POST /api/admin/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = signToken(admin._id, admin.email);
    res.json({ success: true, token, email: admin.email });
  } catch (err) { next(err); }
};

// POST /api/admin/seed — creates admin account (idempotent)
export const seedAdmin = async (req, res, next) => {
  try {
    const email = process.env.ADMIN_EMAIL || "sakshamnnda01@gmail.com";
    const password = process.env.ADMIN_PASSWORD || "Saksham@12345";
    const existing = await Admin.findOne({ email });
    if (existing) {
      existing.password = password;
      await existing.save();
      return res.json({ success: true, message: "Admin already exists (credentials updated/verified)" });
    }

    await Admin.create({
      email,
      password,
    });
    res.status(201).json({
      success: true,
      message: `Admin created with email: ${email}`,
    });
  } catch (err) { next(err); }
};

// GET /api/admin/me
export const getMe = (req, res) => {
  res.json({ success: true, email: req.admin.email });
};
