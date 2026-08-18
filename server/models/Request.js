const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  equipmentType: { type: String, required: true },
  roomNumber: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Pending, In Progress, Completed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Request", RequestSchema);
