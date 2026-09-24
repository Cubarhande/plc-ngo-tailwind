
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

const app = express();

/* =========================
     MIDDLEWARE
  ========================= */

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

/* =========================
     STATIC UPLOADS
  ========================= */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
     ROUTES
  ========================= */

const authRoutes = require("./routes/authRoutes");

const heroRoutes = require("./routes/heroRoutes");

const aboutRoutes = require("./routes/aboutRoutes");
const aboutCategoryRoutes = require("./routes/aboutCategoryRoutes");
const aboutCardRoutes = require("./routes/aboutCardRoutes"); 

const causeRoutes = require("./routes/causeRoutes");

const partnerRoutes = require("./routes/partnerRoutes");

const eventRoutes = require("./routes/eventRoutes");
const eventCardRoutes = require("./routes/eventCardRoutes");
const resourceCategoryRoutes = require("./routes/resourceCategoryRoutes");

const resourceCardRoutes = require("./routes/resourceCardRoutes");
const contactRoutes = require("./routes/contactRoutes");

const settingsRoutes = require("./routes/settingsRoutes");
const whatwedoCategoryRoutes = require("./routes/whatwedoCategoryRoutes");

const whatWeDoCardRoutes = require("./routes/whatWeDoCardRoutes");
/* =========================
     API ROUTES
  ========================= */

app.use("/api/auth", authRoutes);

app.use("/api/hero", heroRoutes);

app.use("/api/about", aboutRoutes);

app.use("/api/about-categories", aboutCategoryRoutes);

app.use("/api/about-cards", aboutCardRoutes);

 

app.use("/api/causes", causeRoutes);

app.use("/api/partners", partnerRoutes);

app.use("/api/events", eventRoutes);
app.use("/api/event-cards", eventCardRoutes);

app.use("/api/resource-categories", resourceCategoryRoutes);

app.use("/api/resource-cards", resourceCardRoutes);

app.use("/api/contacts", contactRoutes);

app.use("/api/settings", settingsRoutes);
app.use("/api/whatwedocategories", whatwedoCategoryRoutes);

app.use("/api/whatwedocards", whatWeDoCardRoutes);
/* =========================
     HOME
  ========================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PLC Information Management API is running.",
  });
});

/* =========================
     404
  ========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

/* =========================
     ERROR HANDLER
  ========================= */

app.use(errorHandler);

/* =========================
     SERVER
  ========================= */

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });
