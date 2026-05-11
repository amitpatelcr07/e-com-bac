import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to verify if user is admin
export const verifyAdmin = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({
          message: "Access denied. Admin privileges required.",
        });
      }

      req.user = user;
      next();
    } else {
      return res.status(401).json({
        message: "Not authorized. No token provided.",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized. Invalid token.",
      error: error.message,
    });
  }
};
