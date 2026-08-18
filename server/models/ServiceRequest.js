const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    department: { type: String, required: true },
    dateOfRequest: { type: Date, required: true, default: Date.now },
    phoneNo: { type: String, required: true },
    applicantName: { type: String, required: true },
    equipmentType: { type: String, required: true },
    problemDescription: { type: String, required: true },
    signature: { type: String, required: true },

    // በቴክኒሻን የሚሞሉ (Required አይደሉም)
    identifiedProblem: { type: String, default: "" },
    responseSolution: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Fixed", "Not Fixed"],
      default: "Pending",
    },
    ifNotReason: { type: String, default: "" },
    technicianName: { type: String, default: "" },
    approvedBy: { type: String, default: "" },

    // Feedback (Required አይደለም)
    feedback: {
      rating: { type: Number, min: 1, max: 5, default: null },
      comment: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
