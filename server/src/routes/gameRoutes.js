import express from "express";
import { getGames, getGameDetails, getRecommendations } from "../controllers/gameController.js";

const router = express.Router();

// GET /api/games - Fetch games by genre (existing)
router.get("/", getGames);

// GET /api/games/:id - Fetch game details (existing)
router.get("/:id", getGameDetails);

// POST /api/games/recommend - ML-powered recommendations (new)
router.post("/recommend", getRecommendations);

export default router;