import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();
const SECRET = process.env.JWT_SECRET || "super_secret_key";

// Middleware xác thực token
export const authRequired = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res
      .status(401)
      .json({ status: "ERROR", message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ status: "ERROR", message: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res
        .status(401)
        .json({ status: "ERROR", message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: "ERROR", message: "Invalid or expired token" });
  }
};

export const adminRequired = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ status: "ERROR", message: "Forbidden: Admins only" });
  }
  next();
};
