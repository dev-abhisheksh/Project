import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { requestRedemption } from "../controllers/redemption.controller.js";

const router = express.Router();

router.post("/request", verifyToken, requestRedemption)

export default router;
