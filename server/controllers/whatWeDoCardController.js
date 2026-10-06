const WhatWeDoCard =
  require("../models/WhatWeDoCard");

// =====================================================
// CREATE CARD
// =====================================================

exports.createCard = async (req, res) => {
  try {
    const card =
      await WhatWeDoCard.create({
        ...req.body,

        image: req.file
          ? `/uploads/${req.file.filename}`
          : req.body.image || "",
      });

    const populatedCard =
      await card.populate("category");

    res.status(201).json({
      success: true,
      message: "What We Do card created successfully.",
      data: populatedCard,
    });
  } catch (error) {
    console.error("Create card error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL CARDS
// =====================================================

exports.getCards = async (req, res) => {
  try {
    const {
      search,
      category,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // SEARCH
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // CATEGORY
    if (category) {
      filter.category = category;
    }

    // STATUS
    if (status !== undefined) {
      filter.status = status === "true";
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip =
      (pageNumber - 1) * limitNumber;

    const cards =
      await WhatWeDoCard.find(filter)
        .populate(
          "category",
          "name description"
        )
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber);

    const total =
      await WhatWeDoCard.countDocuments(filter);

    res.json({
      success: true,
      data: cards,

      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(
          total / limitNumber
        ),
      },
    });
  } catch (error) {
    console.error("Get cards error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET CARDS BY CATEGORY
// =====================================================

exports.getCardsByCategory = async (
  req,
  res
) => {
  try {
    const cards =
      await WhatWeDoCard.find({
        category: req.params.categoryId,
        status: true,
      })
        .populate(
          "category",
          "name description"
        )
        .sort({
          displayOrder: 1,
        });

    res.json({
      success: true,
      data: cards,
    });
  } catch (error) {
    console.error(
      "Get cards by category error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET SINGLE CARD
// =====================================================

exports.getCard = async (req, res) => {
  try {
    const card =
      await WhatWeDoCard.findById(
        req.params.id
      ).populate("category");

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found.",
      });
    }

    res.json({
      success: true,
      data: card,
    });
  } catch (error) {
    console.error("Get card error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE CARD
// =====================================================

exports.updateCard = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.image =
        `/uploads/${req.file.filename}`;
    }

    const card =
      await WhatWeDoCard.findByIdAndUpdate(
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
        message: "Card not found.",
      });
    }

    res.json({
      success: true,
      message: "Card updated successfully.",
      data: card,
    });
  } catch (error) {
    console.error("Update card error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE CARD
// =====================================================

exports.deleteCard = async (req, res) => {
  try {
    const card =
      await WhatWeDoCard.findByIdAndDelete(
        req.params.id
      );

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found.",
      });
    }

    res.json({
      success: true,
      message: "Card deleted successfully.",
    });
  } catch (error) {
    console.error("Delete card error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};