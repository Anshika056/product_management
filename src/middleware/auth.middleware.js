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
      return res.status(401).json({ message: "User not found, authorization denied" });
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

const adminAuthenticated = async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        return res.status(401).json({
          status: false,
          statusCode: 401,
          statusMessage: "Access token not found",
        });
      }
  
      const token = req.headers.authorization.split(" ");
      req.user = await jwt.verify(token[1].trim(), process.env.JWT_SECRET);
      if (req.user.role != "admin") {
        return res.status(401).json({
          status: false,
          statusCode: 401,
          statusMessage: "Access Denied",
        });
      }
  
      next();
    } catch (error) {
      next(error);
    }
  };

module.exports = {
    authMiddleware,
    adminAuthenticated
};
