const AboutCategory = require("../models/AboutCategory");

// =====================================================
// GET ACTIVE CATEGORIES - FRONTEND
// =====================================================

exports.getCategories = async (req, res) => {
  try {
    const categories = await AboutCategory.find({
      status: true,
    }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("GET ABOUT CATEGORIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch About categories",
    });
  }
};

// =====================================================
// GET ALL CATEGORIES - ADMIN
// =====================================================

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await AboutCategory.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("GET ALL ABOUT CATEGORIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// =====================================================
// CREATE CATEGORY
// =====================================================

exports.createCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      displayOrder,
      status,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await AboutCategory.create({
      name: name.trim(),
      description: description || "",

      displayOrder:
        displayOrder !== undefined
          ? Number(displayOrder) || 0
          : 0,

      status:
        status === "false"
          ? false
          : true,

      bgimage: req.file
        ? `/uploads/${req.file.filename}`
        : "",
    });

    res.status(201).json({
      success: true,
      message: "About category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("CREATE ABOUT CATEGORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

// =====================================================
// UPDATE CATEGORY
// =====================================================

exports.updateCategory = async (req, res) => {
  try {
    const category =
      await AboutCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // TEXT
    category.name =
      req.body.name?.trim() || category.name;

    category.description =
      req.body.description ?? category.description;

    // ORDER
    if (req.body.displayOrder !== undefined) {
      category.displayOrder =
        Number(req.body.displayOrder) || 0;
    }

    // STATUS
    if (req.body.status !== undefined) {
      category.status =
        req.body.status === "false"
          ? false
          : true;
    }

    // NEW BACKGROUND IMAGE
    if (req.file) {
      category.bgimage =
        `/uploads/${req.file.filename}`;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "About category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("UPDATE ABOUT CATEGORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

// =====================================================
// DELETE CATEGORY
// =====================================================

exports.deleteCategory = async (req, res) => {
  try {
    const category =
      await AboutCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await AboutCategory.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "About category deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ABOUT CATEGORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};