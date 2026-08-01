const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    rating: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    offers: {
      type: [
        {
          store: String,
          price: Number,
          url: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true } // createdAt, updatedAt auto add ho jayega
);

module.exports = mongoose.model("Product", productSchema);