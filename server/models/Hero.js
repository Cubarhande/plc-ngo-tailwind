const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
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

    image: {
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

module.exports = mongoose.model("Hero", heroSchema);
