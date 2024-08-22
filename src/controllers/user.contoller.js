const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { hashValue,verifyHash } = require("../helpers/hash.helper");

/**
 * Handle user registration
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if an admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    let role = "user";
    if (!existingAdmin) {
      role = "admin";
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash the password
    const hashedPassword = await hashValue(password);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    if (token === undefined) {
      return sendResponse(
        res,
        false,
        400,
        "Something went wrong please try again."
      );
    }
    res.status(201).json({
      message: "User registered successfully!",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Handle user login
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const logging = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email is invalid" });
    }

    if (!(await verifyHash(password, user.password))) {
      return res.status(404).json({ message: "Incorrect email or password." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    return res.status(201).json({
      message: "User logged in successfully!",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const deleteUser = async (req, res) => {
      try {
        const { id } = req.params;
    
        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        // Check if the user is trying to delete their own account or if they are an admin
        if (user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }
    
        // Delete the user
        await User.findByIdAndDelete(id);
    
        res.status(200).json({
          message: "User deleted successfully!",
        });
      } catch (err) {
        res.status(500).json({ message: "Server error" });
      }
    };
    

    // Update the user and return the updated object
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { ...req.body } },
      { new: true }
    );

    res.status(200).json({
      message: "User updated successfully!",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "User deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};




module.exports={
  logging,
  updateUser,
  deleteUser,
  register,
}