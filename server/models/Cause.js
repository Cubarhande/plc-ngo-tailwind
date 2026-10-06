const mongoose = require("mongoose");

const causeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    image: {
      type: String,
      default: ""
    },

    goalAmount: {
      type: Number,
      default: 0
    },

    raisedAmount: {
      type: Number,
      default: 0
    },

    buttonText: {
      type: String,
      default: "Donate"
    },

    buttonLink: {
      type: String,
      default: ""
    },

    displayOrder: {
      type: Number,
      default: 0
    },

    status: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Cause", causeSchema);