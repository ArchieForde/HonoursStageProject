import axios from "axios";

const BASE_URL = "https://api.rawg.io/api";

export const fetchGameDetails = async (gameId) => {
  try {
    const [detailsRes, screenshotsRes] = await Promise.all([
      axios.get(`${BASE_URL}/games/${gameId}`, {
        params: { key: process.env.RAWG_API_KEY }
      }),
      axios.get(`${BASE_URL}/games/${gameId}/screenshots`, {
        params: { key: process.env.RAWG_API_KEY }
      })
    ]);
    return {
      ...detailsRes.data,
      screenshots: screenshotsRes.data.results || []
    };
  } catch (error) {
    console.error("RAWG API Error (details):", error.message);
    throw error;
  }
};

export const fetchGamesByGenre = async (genre) => {
  try {
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        key: process.env.RAWG_API_KEY,
        genres: genre,
        page_size: 10
      }
    });

    return response.data.results;

  } catch (error) {
    console.error("RAWG API Error:", error.message);
    throw error;
  }
};