import express from "express";
import { getGames, getGameDetails } from "../controllers/gameController.js";

const router = express.Router();

router.get("/", getGames);
router.get("/:id", getGameDetails);

export default router;