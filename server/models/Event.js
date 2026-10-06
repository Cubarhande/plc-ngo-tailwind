const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
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

    eventDate: {
      type: Date,
      default: null,
    },

    location: {
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

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Event", eventSchema);
