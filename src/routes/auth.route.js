import express from "express";
import { loginWithPassword, refreshAccessToken, registerUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginWithPassword)
router.post("/refresh", refreshAccessToken)

export default router;