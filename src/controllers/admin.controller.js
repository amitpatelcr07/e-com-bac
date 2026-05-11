import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// ==================== CATEGORY CONTROLLER ====================

// Add a new category
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if category already exists
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res
        .status(400)
        .json({ message: "Category already exists with this name" });
    }

    // Handle image upload (dummy code - replace with actual Cloudinary/AWS S3 URL)
    let imageUrl = null;
    if (req.body.image) {
      // TODO: Replace with actual Cloudinary/AWS S3 upload logic
      // const uploadedImage = await uploadToCloudinary(req.body.image);
      // imageUrl = uploadedImage.secure_url;
      imageUrl = req.body.image; // Dummy - user will provide actual URL
    }

    const category = await Category.create({
      name,
      description,
      image: imageUrl,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding category",
      error: error.message,
    });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Categories fetched successfully",
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

// Get single category
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id).populate(
      "createdBy",
      "name email",
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching category",
      error: error.message,
    });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if another category has the same name
    if (name && name !== category.name) {
      const duplicateName = await Category.findOne({ name });
      if (duplicateName) {
        return res
          .status(400)
          .json({ message: "Category with this name already exists" });
      }
    }

    // Handle image update (dummy code)
    if (image) {
      // TODO: Replace with actual Cloudinary/AWS S3 upload logic
      category.image = image; // Dummy - user will provide actual URL
    }

    if (name) category.name = name;
    if (description) category.description = description;

    const updatedCategory = await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating category",
      error: error.message,
    });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if products exist with this category
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category. ${productsCount} product(s) are linked to this category.`,
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting category",
      error: error.message,
    });
  }
};

// ==================== PRODUCT CONTROLLER ====================

// Add a new product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // Validate input
    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price, and category are required",
      });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Handle image upload (dummy code)
    let imageUrl = null;
    if (req.body.image) {
      // TODO: Replace with actual Cloudinary/AWS S3 upload logic
      // const uploadedImage = await uploadToCloudinary(req.body.image);
      // imageUrl = uploadedImage.secure_url;
      imageUrl = req.body.image; // Dummy - user will provide actual URL
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image: imageUrl,
      stock: stock || 0,
      createdBy: req.user._id,
    });

    // Populate category and creator details
    await product.populate([
      { path: "category", select: "name" },
      { path: "createdBy", select: "name email" },
    ]);

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding product",
      error: error.message,
    });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Products fetched successfully",
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("category", "name description")
      .populate("createdBy", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, image } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Verify category exists if being updated
    if (category && category !== product.category.toString()) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }
      product.category = category;
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock !== undefined) product.stock = stock;

    // Handle image update (dummy code)
    if (image) {
      // TODO: Replace with actual Cloudinary/AWS S3 upload logic
      product.image = image; // Dummy - user will provide actual URL
    }

    const updatedProduct = await product.save();
    await updatedProduct.populate([
      { path: "category", select: "name" },
      { path: "createdBy", select: "name email" },
    ]);

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};

// ==================== ADMIN DASHBOARD ====================

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Revenue calculation (if orders have a total field)
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
          },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
        },
      },
    ]);

    const stats = orderStats[0] || {
      totalRevenue: 0,
      completedOrders: 0,
      pendingOrders: 0,
    };

    res.status(200).json({
      message: "Dashboard stats fetched successfully",
      stats: {
        totalProducts,
        totalCategories,
        totalOrders,
        ...stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};
