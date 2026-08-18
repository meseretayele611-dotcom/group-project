const mongoose = require("mongoose");

const maintenanceRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    equipmentName: {
      type: String,
      required: [true, "እባክዎ የእቃውን ስም ያስገቡ"],
    },
    description: {
      type: String,
      required: [true, "እባክዎ የችግሩን ዝርዝር መግለጫ ያስገቡ"],
    },
    location: {
      type: String,
      required: [true, "እባክዎ እቃው የሚገኝበትን ቦታ/ክፍል ያስገቡ"],
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MaintenanceRequest", maintenanceRequestSchema);
