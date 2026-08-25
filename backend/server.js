const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const adminRoutes = require("./routes/adminRoutes");
const redirectRoutes = require("./routes/redirectRoutes");
const app = express();
const alertRoutes = require("./routes/alertRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const searchRoutes = require("./routes/searchRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const cors = require("cors");
app.use(cors());
app.use(express.json());

// Serverless-safe MongoDB connection: reuse the connection across
// invocations of the same warm function instead of reconnecting every time.
let isConnected = false;
async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB error:", err);
  }
}
// Ensure a connection exists BEFORE any route handler runs
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.get("/", (req, res) => {
  res.send("Shopnexa backend is running ✅");
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/redirect", redirectRoutes);

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  // Only listen on a port for local dev — Vercel handles requests itself
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

module.exports = app;