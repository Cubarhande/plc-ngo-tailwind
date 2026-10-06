const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  getCards,
  getAllCards,
  createCard,
  updateCard,
  deleteCard,
} = require("../controllers/aboutCardController");

router.get("/", getCards);

router.get(
  "/admin",
  getAllCards
);

router.post(
  "/",
  upload.single("image"),
  createCard
);

router.put(
  "/:id",
  upload.single("image"),
  updateCard
);

router.delete(
  "/:id",
  deleteCard
);

module.exports = router;