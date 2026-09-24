const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const {
  getSettings,
  updateSettings,
  deleteSettingsImage,
} = require("../controllers/settingsController");

// ========================================
// PUBLIC GET SETTINGS
// ========================================

router.get("/", getSettings);

// ========================================
// PROTECTED UPDATE SETTINGS
// ========================================

router.put(
  "/",
  authMiddleware,
  upload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
    {
      name: "favicon",
      maxCount: 1,
    },
  ]),
  updateSettings,
);

// ========================================
// DELETE LOGO / FAVICON
// ========================================

router.delete("/image/:field", authMiddleware, deleteSettingsImage);

module.exports = router;
