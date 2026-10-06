const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  getAbout,
  getAllAbout,
  createAbout,
  updateAbout,
  deleteAbout,
} = require("../controllers/aboutController");

router.get("/", getAbout);

router.get("/admin", getAllAbout);

router.post("/", upload.single("image"), createAbout);

router.put("/:id", upload.single("image"), updateAbout);

router.delete("/:id", deleteAbout);

module.exports = router;
