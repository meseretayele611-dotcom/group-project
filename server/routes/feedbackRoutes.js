const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  createFeedback,
  getFeedbacks,
} = require("../controllers/feedbackController");

// ከጠየከው ንድፍ ጋር ተመሳሳይ በሆነ አወቃቀር
router.route("/").post(protect, createFeedback).get(protect, getFeedbacks);

module.exports = router;
