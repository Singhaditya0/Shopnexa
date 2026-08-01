const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    offerId: {
      type: String, // offer ka sub-document _id
      required: true,
    },
    store: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Click", clickSchema);