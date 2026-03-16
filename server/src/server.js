// Load environment variables BEFORE any imports
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory - MUST happen before other imports
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Debug: print loaded env vars  
console.log("RAWG_API_KEY loaded:", process.env.RAWG_API_KEY ? "YES" : "NO");

// Now import everything else AFTER dotenv
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import gameRoutes from "./routes/gameRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/games", gameRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

// Connect to MongoDB then start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
