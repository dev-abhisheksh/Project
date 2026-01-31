import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { reputationRanking } from "../controllers/reputation.controller.js";
import { myEarnings } from "../controllers/userDashboard.controller.js";

const router = express.Router()

router.get("/leaderboards", verifyToken, reputationRanking)
router.get("/my", verifyToken, myEarnings)

export default router;