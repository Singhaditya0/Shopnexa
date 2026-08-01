const express = require("express");
const router = express.Router();

const { redirectToOffer } = require("../controllers/redirectController");

router.get("/:productId/:offerId", redirectToOffer);

module.exports = router;