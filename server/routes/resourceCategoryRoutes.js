const express = require("express");

const {
  getResourceCategories,
  getAdminResourceCategories,
  getResourceCategory,
  createResourceCategory,
  updateResourceCategory,
  deleteResourceCategory,
} = require("../controllers/resourceCategoryController");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

// Public
router.get("/", getResourceCategories);

// Admin
router.get("/admin", getAdminResourceCategories);

router.get("/:id", getResourceCategory);

router.post("/", upload.single("bgimage"), createResourceCategory);

router.put("/:id", upload.single("bgimage"), updateResourceCategory);

router.delete("/:id", deleteResourceCategory);

module.exports = router;
