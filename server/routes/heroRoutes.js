const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getHero,
  createHero,
  updateHero,
  deleteHero,
} = require("../controllers/heroController");

// Public
router.get("/", getHero);

// Admin protected
router.post("/", authMiddleware, upload.single("image"), createHero);

router.put("/:id", authMiddleware, upload.single("image"), updateHero);

router.delete("/:id", authMiddleware, deleteHero);

module.exports = router;
