const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuid } = require("uuid");
require("dotenv").config();
const Paste = require("./model/Paste");

const app = express();

app.use(express.json());
app.use(cors());

// --------- MONGO CONNECTION ----------
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.log("❌ Mongo Error:", err.message);
  }
})();

// --------- TEST ROUTE ----------
app.get("/", (req, res) => {
  res.send("Backend Running Successfully 😎");
});

// --------- CREATE PASTE ----------
app.post("/paste", async (req, res) => {
  const { content, expireMinutes, maxViews } = req.body;

  if (!content) return res.status(400).json({ msg: "content required" });

  const id = uuid().slice(0, 8);

  let expireAt = null;
  if (expireMinutes) expireAt = new Date(Date.now() + expireMinutes * 60000);

  await Paste.create({
    id,
    content,
    expireAt,
    maxViews: maxViews || null
  });

  res.json({ id, link: `/paste/${id}` });
});

// --------- VIEW PASTE ----------
app.get("/paste/:id", async (req, res) => {
  const p = await Paste.findOne({ id: req.params.id });

  if (!p) return res.status(404).json({ msg: "not found" });

  if (p.expireAt && new Date() > p.expireAt) {
    await Paste.deleteOne({ id: p.id });
    return res.status(410).json({ msg: "expired" });
  }

  if (p.maxViews && p.views >= p.maxViews) {
    await Paste.deleteOne({ id: p.id });
    return res.status(410).json({ msg: "expired" });
  }

  p.views += 1;
  await p.save();

  res.json({ content: p.content });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
