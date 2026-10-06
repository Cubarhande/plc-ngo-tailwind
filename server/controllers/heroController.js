const Hero = require("../models/Hero");

// ==========================================
// GET HERO
// ==========================================
const getHero = async (req, res) => {
  try {
    const heroes = await Hero.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: heroes,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch hero",
    });
  }
};

// ==========================================
// CREATE HERO
// ==========================================
const createHero = async (req, res) => {
  try {
    console.log("CREATE HERO BODY:", req.body);
    console.log("CREATE HERO FILE:", req.file);

    const {
      heading,
      description,
      buttonText,
      buttonLink,
      status,
    } = req.body;

    if (!heading) {
      return res.status(400).json({
        success: false,
        message: "Heading is required",
      });
    }

    const hero = await Hero.create({
      heading,
      description: description || "",
      buttonText: buttonText || "",
      buttonLink: buttonLink || "",
      status:
        status === "false"
          ? false
          : true,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : "",
    });

    res.status(201).json({
      success: true,
      message: "Hero created successfully",
      data: hero,
    });

  } catch (error) {
    console.error(
      "CREATE HERO ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create hero",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE HERO
// ==========================================
const updateHero = async (req, res) => {
  try {
    const {
      heading,
      description,
      buttonText,
      buttonLink,
      status,
    } = req.body;

    const updateData = {
      heading,
      description,
      buttonText,
      buttonLink,
      status:
        status === "false"
          ? false
          : true,
    };

    if (req.file) {
      updateData.image =
        `/uploads/${req.file.filename}`;
    }

    const hero = await Hero.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hero updated successfully",
      data: hero,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update hero",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE HERO
// ==========================================
const deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findByIdAndDelete(
      req.params.id
    );

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hero deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete hero",
    });
  }
};

module.exports = {
  getHero,
  createHero,
  updateHero,
  deleteHero,
};