const express = require("express");

const router = express.Router();

const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const upload = require("../middleware/uploadMiddleware");

// ================= GET ALL EVENTS =================

router.get("/", getEvents);

// ================= GET SINGLE EVENT =================

router.get("/:id", getEvent);

// ================= CREATE EVENT =================

router.post("/", upload.single("image"), createEvent);

// ================= UPDATE EVENT =================

router.put("/:id", upload.single("image"), updateEvent);

// ================= DELETE EVENT =================

router.delete("/:id", deleteEvent);

module.exports = router;