import express from "express";
import { verifyAdmin } from "../middleware/role.middleware.js";
import {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getDashboardStats,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All admin routes are protected by verifyAdmin middleware
router.use(verifyAdmin);

// ==================== DASHBOARD ====================
router.get("/dashboard/stats", getDashboardStats);

// ==================== CATEGORY ROUTES ====================
router.post("/categories", addCategory);
router.get("/categories", getCategories);
router.get("/categories/:id", getCategoryById);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// ==================== PRODUCT ROUTES ====================
router.post("/products", addProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
