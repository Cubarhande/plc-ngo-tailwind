const express = require("express");

const {
  getResourceCards,
  getAdminResourceCards,
  getResourceCard,
  createResourceCard,
  updateResourceCard,
  deleteResourceCard,
} = require("../controllers/resourceCardController");

const router = express.Router();

// Public
router.get("/", getResourceCards);

// Admin
router.get("/admin", getAdminResourceCards);

router.get("/:id", getResourceCard);

router.post("/", createResourceCard);

router.put("/:id", updateResourceCard);

router.delete("/:id", deleteResourceCard);

module.exports = router;
