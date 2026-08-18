const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  assignmentId: { type: String, required: true, unique: true },
  serviceRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceRequest",
    required: true,
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  assignedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

module.exports = mongoose.model("Assignment", assignmentSchema);
