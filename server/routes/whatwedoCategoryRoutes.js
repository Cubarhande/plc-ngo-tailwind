const express = require("express");

const {
  createWhatwedoCategories,
  getCategories,
  getWhatwedoCategories,
  updateWhatwedoCategories,
  deleteWhatwedoCategories,
} = require("../controllers/whatwedoCategoryController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// =====================================================
// PUBLIC
// =====================================================

router.get("/", getCategories);

router.get("/:id", getWhatwedoCategories);

// =====================================================
// ADMIN
// =====================================================

router.post("/", protect, upload.single("bgimage"), createWhatwedoCategories);

router.put("/:id", protect, upload.single("bgimage"), updateWhatwedoCategories);

router.delete("/:id", protect, deleteWhatwedoCategories);

module.exports = router;
