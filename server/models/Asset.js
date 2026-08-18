const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  assetId: { type: String, required: true, unique: true },
  assetTag: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

module.exports = mongoose.model("Asset", assetSchema);
