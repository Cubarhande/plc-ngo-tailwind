const AboutCard = require("../models/AboutCard");
const AboutCategory = require("../models/AboutCategory");

// GET ALL CARDS
exports.getCards = async (req, res) => {
  try {
    const cards = await AboutCard.find({
      status: true,
    })
      .populate("category")
      .sort({
        displayOrder: 1,
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      data: cards,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch About cards",
    });
  }
};

// GET ALL CARDS - ADMIN
exports.getAllCards = async (req, res) => {
  try {
    const cards = await AboutCard.find()
      .populate("category")
      .sort({
        displayOrder: 1,
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      data: cards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cards",
    });
  }
};

// CREATE CARD
exports.createCard = async (req, res) => {
  try {
    const {
      category,
      title,
      description,
      buttonText,
      buttonLink,
      displayOrder,
      backgroundColor,
      status,
    } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Card title is required",
      });
    }

    const categoryExists =
      await AboutCategory.findById(
        category
      );

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "About category not found",
      });
    }

    const card = await AboutCard.create({
      category,
      title,
      description,
      buttonText,
      buttonLink,
      displayOrder:
        Number(displayOrder) || 0,
      backgroundColor:
        backgroundColor || "#ffffff",
      status:
        status === "false" ? false : true,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : "",
    });

    const populatedCard =
      await AboutCard.findById(card._id)
        .populate("category");

    res.status(201).json({
      success: true,
      message:
        "About card created successfully",
      data: populatedCard,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create About card",
      error: error.message,
    });
  }
};

// UPDATE CARD
exports.updateCard = async (req, res) => {
  try {
    const card =
      await AboutCard.findById(
        req.params.id
      );

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "About card not found",
      });
    }

    if (req.body.category) {
      const categoryExists =
        await AboutCategory.findById(
          req.body.category
        );

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "About category not found",
        });
      }

      card.category =
        req.body.category;
    }

    card.title =
      req.body.title ?? card.title;

    card.description =
      req.body.description ??
      card.description;

    card.buttonText =
      req.body.buttonText ??
      card.buttonText;

    card.buttonLink =
      req.body.buttonLink ??
      card.buttonLink;

    card.displayOrder =
      req.body.displayOrder !== undefined
        ? Number(req.body.displayOrder)
        : card.displayOrder;

    card.backgroundColor =
      req.body.backgroundColor ??
      card.backgroundColor;

    if (req.body.status !== undefined) {
      card.status =
        req.body.status === "false"
          ? false
          : true;
    }

    if (req.file) {
      card.image =
        `/uploads/${req.file.filename}`;
    }

    await card.save();

    const populatedCard =
      await AboutCard.findById(card._id)
        .populate("category");

    res.status(200).json({
      success: true,
      message:
        "About card updated successfully",
      data: populatedCard,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update About card",
      error: error.message,
    });
  }
};

// DELETE CARD
exports.deleteCard = async (req, res) => {
  try {
    const card =
      await AboutCard.findById(
        req.params.id
      );

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "About card not found",
      });
    }

    await AboutCard.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "About card deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete About card",
    });
  }
};