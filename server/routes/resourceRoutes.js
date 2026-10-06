const express = require("express");

const {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
} = require("../controllers/resourceController");

const router = express.Router();

router.get("/", getResources);
router.get("/:id", getResource);

router.post("/", createResource);
router.put("/:id", updateResource);
router.delete("/:id", deleteResource);

module.exports = router;