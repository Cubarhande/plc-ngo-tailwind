const WhatwedoCategories = require("../models/WhatwedoCategories");
const WhatWeDoCard = require("../models/WhatWeDoCard");

exports.createWhatwedoCategories = async (req, res) => {
  try {
    const WhatwedoCategories = await WhatwedoCategories.create(req.body);

    res.status(201).json({
      success: true,
      message: "WhatwedoCategories created successfully.",
      data: WhatwedoCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await WhatwedoCategories.find()
      .sort({ displayOrder: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getWhatwedoCategories = async (req, res) => {
  try {
    const WhatwedoCategories = await WhatwedoCategories.findById(
      req.params.id
    );

    if (!WhatwedoCategories) {
      return res.status(404).json({
        success: false,
        message: "WhatwedoCategories not found."
      });
    }

    res.json({
      success: true,
      data: WhatwedoCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateWhatwedoCategories = async (req, res) => {
  try {
    const WhatwedoCategories =
      await WhatwedoCategories.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!WhatwedoCategories) {
      return res.status(404).json({
        success: false,
        message: "WhatwedoCategories not found."
      });
    }

    res.json({
      success: true,
      message: "WhatwedoCategories updated successfully.",
      data: WhatwedoCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteWhatwedoCategories = async (req, res) => {
  try {
    const WhatwedoCategories =
      await WhatwedoCategories.findByIdAndDelete(
        req.params.id
      );

    if (!WhatwedoCategories) {
      return res.status(404).json({
        success: false,
        message: "WhatwedoCategories not found."
      });
    }

    await WhatWeDoCard.deleteMany({
      WhatwedoCategories: WhatwedoCategories._id
    });

    res.json({
      success: true,
      message:
        "WhatwedoCategories and related cards deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};