const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  defaultSlaHours: { type: Number, required: true },
});

module.exports = mongoose.model("Category", categorySchema);
