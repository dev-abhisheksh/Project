import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { requestRedemption } from "../controllers/redemption.controller.js";
import { myRedemptions } from "../controllers/userDashboard.controller.js";

const router = express.Router();

router.post("/request", verifyToken, requestRedemption)

router.get("/my", verifyToken, myRedemptions)

export default router;
