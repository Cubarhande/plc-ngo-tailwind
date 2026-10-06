// models/EventCard.js

const mongoose = require("mongoose");

const eventCardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    buttonText: {
      type: String,
      default: "",
    },

    buttonLink: {
      type: String,
      default: "",
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
  "EventCard",
  eventCardSchema
);