const About = require("../models/About");
const fs = require("fs");
const path = require("path");

// GET ABOUT
exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne({
      status: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("Get About Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch About content",
    });
  }
};

// GET ALL ABOUT - ADMIN
exports.getAllAbout = async (req, res) => {
  try {
    const about = await About.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch About content",
    });
  }
};

// CREATE ABOUT
exports.createAbout = async (req, res) => {
  try {
    const {
      title,
      description,
      buttonText,
      buttonLink,
      status,
    } = req.body;

    const about = await About.create({
      title,
      description,
      buttonText,
      buttonLink,
      status:
        status === "false" ? false : true,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : "",
    });

    res.status(201).json({
      success: true,
      message: "About created successfully",
      data: about,
    });
  } catch (error) {
    console.error("Create About Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create About",
      error: error.message,
    });
  }
};

// UPDATE ABOUT
exports.updateAbout = async (req, res) => {
  try {
    const about = await About.findById(
      req.params.id
    );

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About not found",
      });
    }

    about.title =
      req.body.title ?? about.title;

    about.description =
      req.body.description ??
      about.description;

    about.buttonText =
      req.body.buttonText ??
      about.buttonText;

    about.buttonLink =
      req.body.buttonLink ??
      about.buttonLink;

    if (req.body.status !== undefined) {
      about.status =
        req.body.status === "false"
          ? false
          : true;
    }

    if (req.file) {
      about.image = `/uploads/${req.file.filename}`;
    }

    await about.save();

    res.status(200).json({
      success: true,
      message: "About updated successfully",
      data: about,
    });
  } catch (error) {
    console.error("Update About Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update About",
      error: error.message,
    });
  }
};

// DELETE ABOUT
exports.deleteAbout = async (req, res) => {
  try {
    const about = await About.findById(
      req.params.id
    );

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About not found",
      });
    }

    await About.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "About deleted successfully",
    });
  } catch (error) {
    console.error("Delete About Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete About",
    });
  }
};