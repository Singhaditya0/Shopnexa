const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    brand: { type: String, default: "" },
    category: { type: String, required: true },
    images: { type: [String], default: [] },
    price: { type: Number, required: true },
    unitCount: { type: Number, default: 1 },   // ← NEW: base price kitne units ki hai
    currency: { type: String, default: "INR" },
    rating: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    offers: {
      type: [
        {
          store: String,
          price: Number,
          currency: { type: String, default: "INR" },   // ← NEW: is offer ka apna currency
          url: String,
          unitCount: { type: Number, default: 1 },   // ← NEW: offer price kitne units ki hai
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);