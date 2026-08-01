const express = require("express");
const router = express.Router();

const { updateReview, deleteReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;