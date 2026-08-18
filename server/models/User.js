const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      // ⚠️ የተፈቀዱትን Role ዓይነቶች እዚህ ጋር ማስተካከል ይቻላል
      enum: [
        "Admin",
        "User",
        "Technician",
        "Manager",
        "admin",
        "user",
        "technician",
      ],
      default: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
