import axios from "axios";

const BASE_URL = "https://api.rawg.io/api";

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