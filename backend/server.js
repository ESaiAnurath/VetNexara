const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// 🔥 TEMP CORS FIX (FOR DEMO — ALLOW ALL)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ No MONGO_URI provided");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  }
};

connectDB();

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/scan', require('./routes/scanner'));

// ✅ Health check
app.get('/', (req, res) => {
  res.send('VetNexara API Running 🚀');
});

app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
