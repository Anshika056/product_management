const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send({ error: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from the token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found, authorization denied" });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token or request!",
    });
  }
};

const roleGuard = (requiredRoles) => {
  return (req, res, next) => {
    const userRoles = [req.user?.role] || [];
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (hasRole) {
      return next();
    } else {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions." });
    }
  };
};

module.exports = {
  authMiddleware,
  roleGuard,
};
