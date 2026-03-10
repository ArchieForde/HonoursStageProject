import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import gameRoutes from "./routes/gameRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

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
