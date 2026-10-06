const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WhatwedoCategories",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    buttonText: {
      type: String,
      default: "",
      trim: true,
    },

    buttonLink: {
      type: String,
      default: "",
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    backgroundColor: {
      type: String,
      default: "#ffffff",
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
  "WhatWeDoCard",
  cardSchema
);