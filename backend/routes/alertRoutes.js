const express = require("express");
const router = express.Router();

const { createAlert, getAlerts, deleteAlert } = require("../controllers/alertController");
const { protect } = require("../middleware/authMiddleware");

// Saare routes protected hain
router.post("/", protect, createAlert);
router.get("/", protect, getAlerts);
router.delete("/:id", protect, deleteAlert);

module.exports = router;