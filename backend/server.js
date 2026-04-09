const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

// ✅ Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://vet-nexara.vercel.app",
  "https://vetnexara.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200 // ✅ Fix for older browsers & Render preflight
};

// ✅ Handle preflight OPTIONS requests globally (MUST be before routes)
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Database connection
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ No MONGO_URI provided, skipping MongoDB connection.");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/scan', require('./routes/scanner'));

// ✅ Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/', (req, res) => {
  res.send('VetNexara API Running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});