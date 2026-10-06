const express = require("express");

const {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// PUBLIC
// =====================================================

// Website contact form
router.post("/", createContact);

// =====================================================
// ADMIN PROTECTED
// =====================================================

// Get all messages
router.get("/", protect, getContacts);

// Get single message
router.get("/:id", protect, getContact);

// Update message status
router.put("/:id", protect, updateContact);

// Delete message
router.delete("/:id", protect, deleteContact);

module.exports = router;
