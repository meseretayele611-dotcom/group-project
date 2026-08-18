const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  feedbackId: { type: String, required: true, unique: true },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String, required: true },
  serviceRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceRequest",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
