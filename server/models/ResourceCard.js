const mongoose = require("mongoose");

const resourceCardSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResourceCategory",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    listType: {
      type: String,
      enum: ["number", "bullet", "none"],
      default: "none",
    },

    listItems: [
      {
        type: String,
        trim: true,
      },
    ],

    description: {
      type: String,
      default: "",
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ResourceCard",
  resourceCardSchema
);