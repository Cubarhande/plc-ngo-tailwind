const ResourceCard = require("../models/ResourceCard");
const ResourceCategory = require("../models/ResourceCategory");

// =========================
// GET PUBLIC CARDS
// =========================

const getResourceCards = async (req, res) => {
  try {
    const cards = await ResourceCard.find({
      status: true,
    })
      .populate("category")
      .sort({
        displayOrder: 1,
        createdAt: -1,
      });

    const activeCards = cards.filter(
      (card) =>
        card.category &&
        card.category.status === true
    );

    res.status(200).json({
      success: true,
      data: activeCards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch resource cards",
      error: error.message,
    });
  }
};

// =========================
// GET ADMIN CARDS
// =========================

const getAdminResourceCards = async (
  req,
  res
) => {
  try {
    const cards = await ResourceCard.find()
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
      message:
        "Failed to fetch resource cards",
      error: error.message,
    });
  }
};

// =========================
// GET SINGLE CARD
// =========================

const getResourceCard = async (
  req,
  res
) => {
  try {
    const card =
      await ResourceCard.findById(
        req.params.id
      ).populate("category");

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Resource card not found",
      });
    }

    res.status(200).json({
      success: true,
      data: card,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch resource card",
      error: error.message,
    });
  }
};

// =========================
// CREATE CARD
// =========================

const createResourceCard = async (
  req,
  res
) => {
  try {
    const {
      category,
      title,
      listType,
      listItems,
      description,
      displayOrder,
      status,
    } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Card title is required",
      });
    }

    const categoryExists =
      await ResourceCategory.findById(
        category
      );

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Resource category not found",
      });
    }

    const validListType = [
      "number",
      "bullet",
      "none",
    ].includes(listType)
      ? listType
      : "none";

    const card =
      await ResourceCard.create({
        category,
        title: title.trim(),
        listType: validListType,

        listItems:
          validListType === "none"
            ? []
            : Array.isArray(listItems)
            ? listItems.filter(
                (item) =>
                  item &&
                  item.trim()
              )
            : [],

        description:
          validListType === "none"
            ? description || ""
            : "",

        displayOrder:
          Number(displayOrder) || 0,

        status:
          status === undefined
            ? true
            : status,
      });

    const populatedCard =
      await ResourceCard.findById(
        card._id
      ).populate("category");

    res.status(201).json({
      success: true,
      message:
        "Resource card created successfully",
      data: populatedCard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to create resource card",
      error: error.message,
    });
  }
};

// =========================
// UPDATE CARD
// =========================

const updateResourceCard = async (
  req,
  res
) => {
  try {
    const {
      category,
      title,
      listType,
      listItems,
      description,
      displayOrder,
      status,
    } = req.body;

    if (category) {
      const categoryExists =
        await ResourceCategory.findById(
          category
        );

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message:
            "Resource category not found",
        });
      }
    }

    const validListType = [
      "number",
      "bullet",
      "none",
    ].includes(listType)
      ? listType
      : "none";

    const updateData = {
      category,
      title,
      listType: validListType,

      listItems:
        validListType === "none"
          ? []
          : Array.isArray(listItems)
          ? listItems.filter(
              (item) =>
                item &&
                item.trim()
            )
          : [],

      description:
        validListType === "none"
          ? description || ""
          : "",

      displayOrder:
        Number(displayOrder) || 0,

      status:
        status === undefined
          ? true
          : status,
    };

    const card =
      await ResourceCard.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).populate("category");

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Resource card not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Resource card updated successfully",
      data: card,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to update resource card",
      error: error.message,
    });
  }
};

// =========================
// DELETE CARD
// =========================

const deleteResourceCard = async (
  req,
  res
) => {
  try {
    const card =
      await ResourceCard.findByIdAndDelete(
        req.params.id
      );

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Resource card not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Resource card deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to delete resource card",
      error: error.message,
    });
  }
};

module.exports = {
  getResourceCards,
  getAdminResourceCards,
  getResourceCard,
  createResourceCard,
  updateResourceCard,
  deleteResourceCard,
};