import jwt from "jsonwebtoken";

// Soft auth — attaches userId if token present, never blocks
export const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();
  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET || "changeme_secret");
    req.userId = decoded.id;
  } catch {
    // expired / invalid — just ignore
  }
  next();
};

// Hard auth — blocks if no valid token
export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ success: false, message: "Authentication required" });
  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET || "changeme_secret");
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
