const Product = require("../models/product.model");
const { validationResult } = require("express-validator");

const addProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ message: "Please send in all fields" });
    }
    const product = new Product({
      name,
      description,
      price,
      addedBy: req.user._id,
      isVisible: true,
    });

    await product.save();
    res.status(201).json({
      message: "Product added successfully!",
      product: product,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ isVisible: true })
      .skip(skip)
      .limit(limit);

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({
      message: "Products found successfully!",
      products,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


const updateProductVisibility = async (req, res) => {
  try {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product visibility and return the updated object
    product.isVisible = !product.isVisible;
    await product.save();
    res.status(201).json({
      message: "Product updated successfully!",
      product,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product was added by the current user or if the user is an admin
    if (product.addedBy.toString() !== req.user._id.toString()) {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    // Update the product and return the updated object
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: { ...req.body } },
      { new: true }
    );

    res.status(200).json({
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.addedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete the product
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: "Product deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  updateProductVisibility,
  getProducts,
  addProduct,
 updateProduct,
 deleteProduct
}
