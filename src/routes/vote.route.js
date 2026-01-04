import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { toggleLike } from "../controllers/vote.controller.js";

const router = express.Router()

router.patch("/toggle/:solutionId", verifyToken, toggleLike)

export default router