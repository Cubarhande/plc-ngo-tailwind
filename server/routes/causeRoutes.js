const express = require("express");

const {
  createCause,
  getCauses,
  getCause,
  updateCause,
  deleteCause,
} = require("../controllers/causeController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getCauses);
router.get("/:id", getCause);

router.post("/", protect, upload.single("image"), createCause);

router.put("/:id", protect, upload.single("image"), updateCause);

router.delete("/:id", protect, deleteCause);

module.exports = router;
