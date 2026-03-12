import { fetchGamesByGenre, fetchGameDetails } from "../services/rawgServices.js";

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