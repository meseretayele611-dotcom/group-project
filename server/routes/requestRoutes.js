const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  createRequest,
  getRequests,
  confirmRequestCompletion, // የተጠቃሚ ማረጋገጫ መቆጣጠሪያ
} = require("../controllers/requestController");

const {
  createFeedback,
  getFeedbacks,
} = require("../controllers/feedbackController");

// 1. የጥገና ጥያቄዎችን መመዝገቢያ እና ማንበቢያ
router.route("/").post(protect, createRequest).get(protect, getRequests);

// 2. ተጠቃሚው ጥገናው መፈጸሙን የሚያረጋግጥበት (User Confirmation)
router.route("/confirm/:id").put(protect, confirmRequestCompletion);

// 3. ቴክኒሻኑ ግብረ-መልስ እና ሪፖርት የሚያስገባበት (Technician Feedback)
router
  .route("/feedback")
  .post(protect, createFeedback)
  .get(protect, getFeedbacks);

module.exports = router;
