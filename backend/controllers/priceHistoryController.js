const PriceHistory = require("../models/PriceHistory");

exports.getPriceHistory = async (req, res) => {
  try {
    const history = await PriceHistory.find({ product: req.params.id }).sort({ date: 1 });
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};