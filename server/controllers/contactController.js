const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

// =====================================================
// CREATE CONTACT
// Public
// =====================================================

exports.createContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    // Save contact message
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    // =================================================
    // SEND EMAIL TO ADMIN
    // =================================================

    try {
      await sendEmail({
        to: process.env.EMAIL_TO,
        subject: `New Contact Message: ${subject}`,
        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: auto;
            color: #334155;
          ">

            <h2 style="color:#0f172a;">
              New Contact Message
            </h2>

            <p>
              You have received a new message from the
              PLC Organisation website.
            </p>

            <hr />

            <p>
              <strong>Name:</strong> ${name}
            </p>

            <p>
              <strong>Email:</strong> ${email}
            </p>

            <p>
              <strong>Phone:</strong>
              ${phone || "Not provided"}
            </p>

            <p>
              <strong>Subject:</strong> ${subject}
            </p>

            <p>
              <strong>Message:</strong>
            </p>

            <div style="
              background:#f8fafc;
              padding:15px;
              border-radius:8px;
              line-height:1.6;
            ">
              ${message}
            </div>

            <hr />

            <p style="
              color:#64748b;
              font-size:13px;
            ">
              This message was sent from the
              PLC Organisation website.
            </p>

          </div>
        `,
      });
    } catch (emailError) {
      console.error(
        "Admin email failed:",
        emailError.message
      );
    }

    // =================================================
    // THANK YOU / AUTO REPLY TO USER
    // =================================================

    try {
      await sendEmail({
        to: email,
        subject:
          "Thank You for Contacting PLC Organisation",
        html: `
          <div style="
            font-family:Arial,sans-serif;
            max-width:650px;
            margin:auto;
            color:#334155;
          ">

            <h2 style="color:#0f172a;">
              Thank You, ${name}
            </h2>

            <p>
              Thank you for visiting
              <strong>PLC Organisation</strong>
              and getting in touch with us.
            </p>

            <p>
              We have successfully received your message.
              Our team will review your request and get
              back to you as soon as possible.
            </p>

            <div style="
              margin:25px 0;
              padding:18px;
              background:#f8fafc;
              border-radius:8px;
            ">
              <p style="margin:0;">
                <strong>Your Subject:</strong>
                ${subject}
              </p>
            </div>

            <p>
              We appreciate your interest in our organisation.
            </p>

            <p>
              Regards,<br />
              <strong>PLC Organisation</strong>
            </p>

            <hr />

            <p style="
              color:#94a3b8;
              font-size:12px;
            ">
              This is an automatic confirmation email.
            </p>

          </div>
        `,
      });
    } catch (emailError) {
      console.error(
        "Thank-you email failed:",
        emailError.message
      );
    }

    res.status(201).json({
      success: true,
      message:
        "Your message has been submitted successfully.",
      data: contact,
    });

  } catch (error) {
    console.error("Contact error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL CONTACTS
// Admin
// =====================================================

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: contacts,
    });

  } catch (error) {
    console.error("Get contacts error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET SINGLE CONTACT
// Admin
// =====================================================

exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(
      req.params.id
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    res.json({
      success: true,
      data: contact,
    });

  } catch (error) {
    console.error("Get contact error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE CONTACT
// Admin
// =====================================================

exports.updateContact = async (req, res) => {
  try {
    const contact =
      await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    res.json({
      success: true,
      message:
        "Contact message updated successfully.",
      data: contact,
    });

  } catch (error) {
    console.error("Update contact error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE CONTACT
// Admin
// =====================================================

exports.deleteContact = async (req, res) => {
  try {
    const contact =
      await Contact.findByIdAndDelete(
        req.params.id
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    res.json({
      success: true,
      message:
        "Contact message deleted successfully.",
    });

  } catch (error) {
    console.error("Delete contact error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};