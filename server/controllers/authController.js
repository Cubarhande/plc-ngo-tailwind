const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// REGISTER
// ==========================================
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check existing admin
    const existingAdmin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "admin",
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ==========================================
// LOGIN
// ==========================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find admin
    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check account status
    if (!admin.status) {
      return res.status(403).json({
        success: false,
        message: "Your account is disabled",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
const updateProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const { name, email, password } = req.body;

    if (name) {
      admin.name = name;
    }

    if (email) {
      admin.email = email;
    }

    if (password && password.trim()) {
      admin.password = await bcrypt.hash(
        password,
        10
      );
    }

    await admin.save();

    res.status(200).json({
      message: "Profile updated successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};
module.exports = {
  register,
  login,
  updateProfile,
};
