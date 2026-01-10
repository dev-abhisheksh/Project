import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { reputationRanking } from "../controllers/reputation.controller.js";

const router = express.Router()

router.get("/leaderboards", verifyToken, reputationRanking)

export default router;