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
      addedBy: req.user.userId,
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
    const products = await Product.find({ isVisible: true });
    if (products.length == 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(201).json({
      message: "Product found successfully!",
      product: products,
    });
    return res.status(404).json({ message: "No products found" });
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
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      { $set: { isVisible: req.body.visibility } },
      { new: true }
    );
    res.status(201).json({
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  updateProductVisibility,
  getProducts,
  addProduct,
}
