const Cause = require("../models/Cause");

exports.createCause = async (req, res) => {
  try {
    const cause = await Cause.create({
      ...req.body,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : req.body.image || ""
    });

    res.status(201).json({
      success: true,
      message: "Cause created successfully.",
      data: cause
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCauses = async (req, res) => {
  try {
    const causes = await Cause.find()
      .sort({ displayOrder: 1 });

    res.json({
      success: true,
      data: causes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCause = async (req, res) => {
  try {
    const cause = await Cause.findById(
      req.params.id
    );

    if (!cause) {
      return res.status(404).json({
        success: false,
        message: "Cause not found."
      });
    }

    res.json({
      success: true,
      data: cause
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateCause = async (req, res) => {
  try {
    const updateData = {
      ...req.body
    };

    if (req.file) {
      updateData.image =
        `/uploads/${req.file.filename}`;
    }

    const cause =
      await Cause.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );

    if (!cause) {
      return res.status(404).json({
        success: false,
        message: "Cause not found."
      });
    }

    res.json({
      success: true,
      message: "Cause updated successfully.",
      data: cause
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteCause = async (req, res) => {
  try {
    const cause =
      await Cause.findByIdAndDelete(
        req.params.id
      );

    if (!cause) {
      return res.status(404).json({
        success: false,
        message: "Cause not found."
      });
    }

    res.json({
      success: true,
      message: "Cause deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};