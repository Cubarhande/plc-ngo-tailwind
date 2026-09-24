const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "",
      trim: true,
    },

    siteFooter: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    map: {
      type: String,
      default: "",
      trim: true,
    },

    logo: {
      type: String,
      default: "",
    },

    favicon: {
      type: String,
      default: "",
    },

    facebook: {
      type: String,
      default: "",
    },

    instagram: {
      type: String,
      default: "",
    },

    twitter: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    youtube: {
      type: String,
      default: "",
    },

    // ========================================
    // CTA SECTION SETTINGS
    // ========================================

    ctaEnabled: {
      type: Boolean,
      default: true,
    },

    ctaPhone: {
      type: String,
      default: "",
      trim: true,
    },

    ctaEmail: {
      type: String,
      default: "",
      trim: true,
    },

    ctaPreTitle: {
      type: String,
      default: "",
      trim: true,
    },

    ctaPreTitleHighlight: {
      type: String,
      default: "",
      trim: true,
    },

    ctaTitle: {
      type: String,
      default: "",
      trim: true,
    },

    ctaTitleHighlight: {
      type: String,
      default: "",
      trim: true,
    },

    ctaButtonText: {
      type: String,
      default: "",
      trim: true,
    },

    ctaButtonLink: {
      type: String,
      default: "",
      trim: true,
    },

    ctaBackgroundImage: {
      type: String,
      default: "",
    },

    ctaShapeImage1: {
      type: String,
      default: "",
    },

    ctaShapeImage3: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Settings", settingsSchema);
