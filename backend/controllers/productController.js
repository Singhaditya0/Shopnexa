const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort } = req.query;
    const filter = {};
    if (keyword) filter.name = { $regex: keyword, $options: "i" };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    let query = Product.find(filter);
    if (sort === "low") query = query.sort({ price: 1 });
    else if (sort === "high") query = query.sort({ price: -1 });
    else query = query.sort({ createdAt: -1 });
    const products = await query;
    res.json({ success: true, data: products, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProductOffers = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product.offers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBestDeal = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    if (!product.offers || product.offers.length === 0) return res.json({ success: true, data: null });
    const best = product.offers.reduce((lowest, o) => (o.price < lowest.price ? o : lowest));
    res.json({ success: true, data: best });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addOffer = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    product.offers.push(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product.offers });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    product.offers = product.offers.filter((o) => o._id.toString() !== req.params.offerId);
    await product.save();
    res.json({ success: true, data: product.offers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};