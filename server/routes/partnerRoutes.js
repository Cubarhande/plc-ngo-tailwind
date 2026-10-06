const express = require("express");

const {
  createPartner,
  getPartners,
  getPartner,
  updatePartner,
  deletePartner,
} = require("../controllers/partnerController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getPartners);
router.get("/:id", getPartner);

router.post("/", protect, upload.single("logo"), createPartner);

router.put("/:id", protect, upload.single("logo"), updatePartner);

router.delete("/:id", protect, deletePartner);

module.exports = router;
