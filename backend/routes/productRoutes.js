const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductOffers,
  getBestDeal,
  addOffer,
  deleteOffer,
} = require("../controllers/productController");

const { getPriceHistory } = require("../controllers/priceHistoryController");
const { getReviews, createReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");
router.get("/", getProducts);
router.post("/", createProduct);

router.get("/:id/offers", getProductOffers);
router.get("/:id/best-deal", getBestDeal);
router.post("/:id/offers", addOffer);
router.delete("/:id/offers/:offerId", deleteOffer);
router.get("/:id/price-history", getPriceHistory); // naya route
router.get("/:id/reviews", getReviews);
router.post("/:id/reviews", protect, createReview);

router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;