// controllers/eventCardController.js

const EventCard = require("../models/EventCard");

exports.getEventCards = async (req, res) => {
  try {
    const cards = await EventCard.find()
      .sort({ displayOrder: 1 });

    res.json({
      success: true,
      data: cards,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createEventCard = async (req, res) => {
  try {
    const card = await EventCard.create({
      title: req.body.title,
      description: req.body.description,
      buttonText: req.body.buttonText,
      buttonLink: req.body.buttonLink,
      displayOrder: Number(
        req.body.displayOrder || 0
      ),
      backgroundColor:
        req.body.backgroundColor || "#ffffff",
      status:
        req.body.status === "true" ||
        req.body.status === true,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : "",
    });

    res.status(201).json({
      success: true,
      data: card,
    });
  } catch (error) {
    console.error("CREATE EVENT CARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateEventCard = async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      description: req.body.description,
      buttonText: req.body.buttonText,
      buttonLink: req.body.buttonLink,
      displayOrder: Number(
        req.body.displayOrder || 0
      ),
      backgroundColor:
        req.body.backgroundColor || "#ffffff",
      status:
        req.body.status === "true" ||
        req.body.status === true,
    };

    if (req.file) {
      data.image =
        `/uploads/${req.file.filename}`;
    }

    const card =
      await EventCard.findByIdAndUpdate(
        req.params.id,
        data,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!card) {
      return res.status(404).json({
        message: "Event card not found",
      });
    }

    res.json({
      success: true,
      data: card,
    });
  } catch (error) {
    console.error("UPDATE EVENT CARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteEventCard = async (req, res) => {
  try {
    const card =
      await EventCard.findByIdAndDelete(
        req.params.id
      );

    if (!card) {
      return res.status(404).json({
        message: "Event card not found",
      });
    }

    res.json({
      success: true,
      message: "Event card deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};