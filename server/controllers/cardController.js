const WhatWeDoCard =
  require("../models/WhatWeDoCard");

exports.createCard = async (req, res) => {
  try {
    const card = await WhatWeDoCard.create({
      ...req.body,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : req.body.image || ""
    });

    const populatedCard =
      await card.populate("category");

    res.status(201).json({
      success: true,
      message: "Card created successfully.",
      data: populatedCard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCards = async (req, res) => {
  try {
    const {
      search,
      category,
      status,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i"
          }
        },
        {
          description: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (status !== undefined) {
      filter.status = status === "true";
    }

    const skip =
      (Number(page) - 1) * Number(limit);

    const cards =
      await WhatWeDoCard.find(filter)
        .populate("category", "name")
        .sort({ displayOrder: 1 })
        .skip(skip)
        .limit(Number(limit));

    const total =
      await WhatWeDoCard.countDocuments(filter);

    res.json({
      success: true,
      data: cards,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(
          total / Number(limit)
        )
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCardsByCategory = async (
  req,
  res
) => {
  try {
    const cards =
      await WhatWeDoCard.find({
        category: req.params.categoryId,
        status: true
      })
        .populate("category", "name")
        .sort({ displayOrder: 1 });

    res.json({
      success: true,
      data: cards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCard = async (req, res) => {
  try {
    const card =
      await WhatWeDoCard.findById(
        req.params.id
      ).populate("category");

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found."
      });
    }

    res.json({
      success: true,
      data: card
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const updateData = {
      ...req.body
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
          runValidators: true
        }
      ).populate("category");

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found."
      });
    }

    res.json({
      success: true,
      message: "Card updated successfully.",
      data: card
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const card =
      await WhatWeDoCard.findByIdAndDelete(
        req.params.id
      );

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found."
      });
    }

    res.json({
      success: true,
      message: "Card deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};