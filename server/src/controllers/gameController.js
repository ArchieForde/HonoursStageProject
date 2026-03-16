import { fetchGamesByGenre, fetchGameDetails } from "../services/rawgServices.js";
import axios from "axios";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:5001";

export const getGames = async (req, res) => {
  try {
    const { genre } = req.query;
    const games = await fetchGamesByGenre(genre);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch games" });
  }
};

export const getGameDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const details = await fetchGameDetails(id);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch game details" });
  }
};

// ML-powered recommendation endpoint - calls Python service
export const getRecommendations = async (req, res) => {
  try {
    const { answers, limit } = req.body;
    
    if (!answers) {
      return res.status(400).json({ error: "Missing user answers" });
    }
    
    // Call Python recommendation service
    const response = await axios.post(`${PYTHON_API_URL}/recommend`, {
      answers,
      limit: limit || 5
    }, {
      timeout: 60000 // 60 second timeout
    });
    
    res.json(response.data);
  } catch (error) {
    console.error("Recommendation error:", error.message);
    res.status(500).json({ 
      error: "Failed to generate recommendations. Please ensure the Python ML service is running." 
    });
  }
};
