const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : req.body.image || ""
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully.",
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ eventDate: 1 });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event =
      await Event.findById(
        req.params.id
      );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found."
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const updateData = {
      ...req.body
    };

    if (req.file) {
      updateData.image =
        `/uploads/${req.file.filename}`;
    }

    const event =
      await Event.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found."
      });
    }

    res.json({
      success: true,
      message: "Event updated successfully.",
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event =
      await Event.findByIdAndDelete(
        req.params.id
      );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found."
      });
    }

    res.json({
      success: true,
      message: "Event deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};