const express = require("express");

const {
  createCard,
  getCards,
  getCardsByCategory,
  getCard,
  updateCard,
  deleteCard,
} = require("../controllers/cardController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getCards);

router.get("/whatwedocategories/:categoryId", getCardsByCategory);

router.get("/:id", getCard);

router.post("/", protect, upload.single("image"), createCard);

router.put("/:id", protect, upload.single("image"), updateCard);

router.delete("/:id", protect, deleteCard);

module.exports = router;
