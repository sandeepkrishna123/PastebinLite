const mongoose = require("mongoose");

const pasteSchema = new mongoose.Schema({
  id: String,
  content: String,
  expireAt: Date,
  maxViews: Number,
  views: { type: Number, default: 0 }
});

module.exports = mongoose.model("Paste", pasteSchema);
