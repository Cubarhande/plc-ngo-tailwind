const express = require("express");

const router = express.Router();

const {
  getCategories,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/aboutCategoryController");

const upload = require("../middleware/uploadMiddleware");

// =====================================================
// PUBLIC
// =====================================================

router.get("/", getCategories);

// =====================================================
// ADMIN
// =====================================================

router.get("/admin", getAllCategories);

router.post("/", upload.single("bgimage"), createCategory);

router.put("/:id", upload.single("bgimage"), updateCategory);

router.delete("/:id", deleteCategory);

module.exports = router;
