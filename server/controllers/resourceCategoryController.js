const ResourceCategory = require("../models/ResourceCategory");

// =========================
// GET PUBLIC CATEGORIES
// =========================

const getResourceCategories = async (req, res) => {
  try {
    const categories = await ResourceCategory.find({
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
    console.error("GET RESOURCE CATEGORIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resource categories",
      error: error.message,
    });
  }
};

// =========================
// GET ADMIN CATEGORIES
// =========================

const getAdminResourceCategories = async (req, res) => {
  try {
    const categories = await ResourceCategory.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("GET ADMIN RESOURCE CATEGORIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resource categories",
      error: error.message,
    });
  }
};

// =========================
// GET SINGLE CATEGORY
// =========================

const getResourceCategory = async (req, res) => {
  try {
    const category = await ResourceCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Resource category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("GET SINGLE RESOURCE CATEGORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resource category",
      error: error.message,
    });
  }
};

// =========================
// CREATE
// =========================

const createResourceCategory = async (req, res) => {
  try {
    console.log("CREATE RESOURCE CATEGORY");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { name, description, displayOrder, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await ResourceCategory.create({
      name: name.trim(),
      description: description || "",
      displayOrder: Number(displayOrder) || 0,

      status:
        status === undefined ? true : status === "true" || status === true,

      bgimage: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json({
      success: true,
      message: "Resource category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("CREATE RESOURCE CATEGORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create resource category",
      error: error.message,
    });
  }
};

// =========================
// UPDATE
// =========================

const updateResourceCategory = async (req, res) => {
  try {
    console.log("UPDATE RESOURCE CATEGORY");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const category = await ResourceCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Resource category not found",
      });
    }

    // Update text fields
    if (req.body.name !== undefined) {
      if (!req.body.name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      category.name = req.body.name.trim();
    }

    if (req.body.description !== undefined) {
      category.description = req.body.description;
    }

    if (req.body.displayOrder !== undefined) {
      category.displayOrder = Number(req.body.displayOrder) || 0;
    }

    if (req.body.status !== undefined) {
      category.status = req.body.status === "true" || req.body.status === true;
    }

    // Update image only when a new image is uploaded
    if (req.file) {
      category.bgimage = `/uploads/${req.file.filename}`;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Resource category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("UPDATE RESOURCE CATEGORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update resource category",
      error: error.message,
    });
  }
};

// =========================
// DELETE
// =========================

const deleteResourceCategory = async (req, res) => {
  try {
    const category = await ResourceCategory.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Resource category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resource category deleted successfully",
    });
  } catch (error) {
    console.error("DELETE RESOURCE CATEGORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete resource category",
      error: error.message,
    });
  }
};

module.exports = {
  getResourceCategories,
  getAdminResourceCategories,
  getResourceCategory,
  createResourceCategory,
  updateResourceCategory,
  deleteResourceCategory,
};
