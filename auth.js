const express = require("express");
const router = express.Router();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here";

// Input validation helper
const validateInput = (username, email, password) => {
  const errors = [];
  
  if (!username || username.trim().length < 3) {
    errors.push("Username must be at least 3 characters long");
  }
  
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.push("Please provide a valid email address");
  }
  
  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }
  
  return errors;
};

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    const validationErrors = validateInput(username, email, password);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User with this email or username already exists" 
      });
    }

    // Create new user
    const newUser = new User({ 
      username: username.trim(), 
      email: email.toLowerCase().trim(), 
      password 
    });
    
    await newUser.save();

    return res.status(201).json({ 
      success: true, 
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Server error during registration" 
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username,
        email: user.email 
      }, 
      JWT_SECRET, 
      { expiresIn: "24h" }
    );

    // Set secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return res.json({ 
      success: true, 
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Server error during login" 
    });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ 
    success: true, 
    message: "Logged out successfully" 
  });
});

// GET USER INFO
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    return res.json({ 
      success: true, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
});

// PROTECTED MIDDLEWARE
function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Access denied. No token provided." 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
}

module.exports = { router, authMiddleware };

