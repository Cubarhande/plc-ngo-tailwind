const Settings = require("../models/Settings");
const fs = require("fs");
const path = require("path");

// =====================================================
// GET SETTINGS
// =====================================================

const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
};

// =====================================================
// UPDATE SETTINGS
// =====================================================

const updateSettings = async (req, res) => {
  try {
    console.log("SETTINGS BODY:", req.body);
    console.log("SETTINGS FILES:", req.files);

    const {
      // ==========================================
      // GENERAL SETTINGS
      // ==========================================

      siteName,
      siteFooter,
      email,
      phone,
      address,
      map,

      // ==========================================
      // SOCIAL MEDIA
      // ==========================================

      facebook,
      instagram,
      twitter,
      linkedin,
      youtube,

      // ==========================================
      // CTA SETTINGS
      // ==========================================

      ctaEnabled,
      ctaPhone,
      ctaEmail,
      ctaPreTitle,
      ctaPreTitleHighlight,
      ctaTitle,
      ctaTitleHighlight,
      ctaButtonText,
      ctaButtonLink,
      ctaBackgroundImage,
      ctaShapeImage1,
      ctaShapeImage3,
    } = req.body;

    // ==========================================
    // FIND SETTINGS
    // ==========================================

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    // ==========================================
    // GENERAL SETTINGS
    // ==========================================

    settings.siteName = siteName || "";
    settings.siteFooter = siteFooter || "";
    settings.email = email || "";
    settings.phone = phone || "";
    settings.address = address || "";
    settings.map = map || "";

    // ==========================================
    // SOCIAL MEDIA
    // ==========================================

    settings.facebook = facebook || "";
    settings.instagram = instagram || "";
    settings.twitter = twitter || "";
    settings.linkedin = linkedin || "";
    settings.youtube = youtube || "";

    // ==========================================
    // CTA SETTINGS
    // ==========================================

    settings.ctaEnabled = ctaEnabled === "true" || ctaEnabled === true;

    settings.ctaPhone = ctaPhone || "";
    settings.ctaEmail = ctaEmail || "";
    settings.ctaPreTitle = ctaPreTitle || "";
    settings.ctaPreTitleHighlight = ctaPreTitleHighlight || "";
    settings.ctaTitle = ctaTitle || "";
    settings.ctaTitleHighlight = ctaTitleHighlight || "";
    settings.ctaButtonText = ctaButtonText || "";
    settings.ctaButtonLink = ctaButtonLink || "";

    settings.ctaBackgroundImage = ctaBackgroundImage || "";

    settings.ctaShapeImage1 = ctaShapeImage1 || "";

    settings.ctaShapeImage3 = ctaShapeImage3 || "";

    // ==========================================
    // LOGO UPLOAD
    // ==========================================

    if (req.files && req.files.logo && req.files.logo[0]) {
      settings.logo = `/uploads/${req.files.logo[0].filename}`;
    }

    // ==========================================
    // FAVICON UPLOAD
    // ==========================================

    if (req.files && req.files.favicon && req.files.favicon[0]) {
      settings.favicon = `/uploads/${req.files.favicon[0].filename}`;
    }

    // ==========================================
    // SAVE SETTINGS
    // ==========================================

    await settings.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE LOGO / FAVICON
// =====================================================

const deleteSettingsImage = async (req, res) => {
  try {
    const { field } = req.params;

    console.log("DELETE IMAGE FIELD:", field);

    // =================================================
    // SECURITY: ONLY ALLOW LOGO AND FAVICON
    // =================================================

    if (!["logo", "favicon"].includes(field)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image field.",
      });
    }

    // =================================================
    // FIND SETTINGS
    // =================================================

    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Settings not found.",
      });
    }

    // =================================================
    // GET STORED IMAGE PATH
    // =================================================

    const imagePath = settings[field];

    console.log("IMAGE PATH FROM DATABASE:", imagePath);

    // =================================================
    // DELETE PHYSICAL FILE
    // =================================================

    if (imagePath) {
      // Example:
      // /uploads/logo-123456.png
      //
      // basename gives:
      // logo-123456.png

      const fileName = path.basename(imagePath);

      // IMPORTANT:
      // This assumes your upload middleware stores
      // files in:
      //
      // server/uploads/

      const filePath = path.join(__dirname, "../uploads", fileName);

      console.log("PHYSICAL FILE PATH:", filePath);

      // Check whether file exists

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);

        console.log("PHYSICAL IMAGE DELETED:", filePath);
      } else {
        console.log("PHYSICAL IMAGE NOT FOUND:", filePath);
      }
    }

    // =================================================
    // REMOVE IMAGE FROM MONGODB
    // =================================================

    settings[field] = "";

    await settings.save();

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message: `${field} removed successfully.`,
      data: settings,
    });
  } catch (error) {
    console.error("DELETE SETTINGS IMAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove image.",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getSettings,
  updateSettings,
  deleteSettingsImage,
};
