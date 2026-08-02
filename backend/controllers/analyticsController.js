const Click = require("../models/Click");
const Product = require("../models/Product");
const User = require("../models/User");
const Review = require("../models/Review");

exports.getAnalytics = async (req, res) => {
  try {
    const totalClicks = await Click.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalReviews = await Review.countDocuments();

    res.json({
      success: true,
      analytics: {
        totalProducts,
        totalUsers,
        totalClicks,
        totalReviews,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllClicks = async (req, res) => {
  try {
    const clicks = await Click.find().populate("product", "name").sort({ createdAt: -1 });
    res.json({ success: true, data: clicks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTopProducts = async (req, res) => {
  try {
    const top = await Click.aggregate([
      { $group: { _id: "$product", clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 10 },
    ]);
    res.json({ success: true, data: top });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTopStores = async (req, res) => {
  try {
    const top = await Click.aggregate([
      { $group: { _id: "$store", clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 10 },
    ]);
    res.json({ success: true, data: top });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("product", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};