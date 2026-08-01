const Product = require("../models/Product");

exports.getRecommendations = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    const recommendations = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(6);
    res.json({ success: true, data: recommendations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};