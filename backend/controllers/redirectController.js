const Product = require("../models/Product");
const Click = require("../models/Click");

exports.redirectToOffer = async (req, res) => {
  try {
    const { productId, offerId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    const offer = product.offers.id(offerId);
    if (!offer) return res.status(404).json({ success: false, message: "Offer not found" });
    await Click.create({ product: product._id, offerId: offer._id.toString(), store: offer.store, ip: req.ip });
    res.redirect(offer.url);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};