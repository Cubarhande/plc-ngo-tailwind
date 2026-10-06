const express = require("express");

const {
  createCard,
  getCards,
  getCardsByCategory,
  getCard,
  updateCard,
  deleteCard,
} = require("../controllers/whatWeDoCardController");

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// =====================================================
// PUBLIC
// =====================================================

router.get("/", getCards);

router.get("/category/:categoryId", getCardsByCategory);

router.get("/:id", getCard);

// =====================================================
// ADMIN
// =====================================================

router.post("/", protect, upload.single("image"), createCard);

router.put("/:id", protect, upload.single("image"), updateCard);

router.delete("/:id", protect, deleteCard);

module.exports = router;
