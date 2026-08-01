const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  getAnalytics,
  getAllClicks,
  getTopProducts,
  getTopStores,
} = require("../controllers/analyticsController");

// Product management (already tha)
router.get("/products", protect, adminOnly, getProducts);
router.post("/products", protect, adminOnly, createProduct);
router.put("/products/:id", protect, adminOnly, updateProduct);
router.delete("/products/:id", protect, adminOnly, deleteProduct);

// Analytics (naya)
router.get("/analytics", protect, adminOnly, getAnalytics);
router.get("/clicks", protect, adminOnly, getAllClicks);
router.get("/top-products", protect, adminOnly, getTopProducts);
router.get("/top-stores", protect, adminOnly, getTopStores);

module.exports = router;