const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    logo: {
      type: String,
      default: ""
    },

    website: {
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

module.exports = mongoose.model("Partner", partnerSchema);