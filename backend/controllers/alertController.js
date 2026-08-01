const Alert = require("../models/Alert");

exports.createAlert = async (req, res) => {
  try {
    const { productId, targetPrice } = req.body;
    const alert = await Alert.create({ user: req.user.id, product: productId, targetPrice });
    res.status(201).json({ success: true, data: alert });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user.id }).populate("product", "name price image");
    res.json({ success: true, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!alert) return res.status(404).json({ success: false, message: "Alert not found" });
    res.json({ success: true, message: "Alert deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};