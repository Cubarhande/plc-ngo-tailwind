const Partner = require("../models/Partner");

exports.createPartner = async (req, res) => {
  try {
    const partner = await Partner.create({
      ...req.body,
      logo: req.file
        ? `/uploads/${req.file.filename}`
        : req.body.logo || ""
    });

    res.status(201).json({
      success: true,
      message: "Partner created successfully.",
      data: partner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPartners = async (req, res) => {
  try {
    const partners = await Partner.find()
      .sort({ displayOrder: 1 });

    res.json({
      success: true,
      data: partners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPartner = async (req, res) => {
  try {
    const partner =
      await Partner.findById(
        req.params.id
      );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found."
      });
    }

    res.json({
      success: true,
      data: partner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePartner = async (req, res) => {
  try {
    const updateData = {
      ...req.body
    };

    if (req.file) {
      updateData.logo =
        `/uploads/${req.file.filename}`;
    }

    const partner =
      await Partner.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found."
      });
    }

    res.json({
      success: true,
      message: "Partner updated successfully.",
      data: partner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deletePartner = async (req, res) => {
  try {
    const partner =
      await Partner.findByIdAndDelete(
        req.params.id
      );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found."
      });
    }

    res.json({
      success: true,
      message: "Partner deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};