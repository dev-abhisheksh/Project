import express from "express";
import { loginWithPassword, logoutUser, refreshAccessToken, registerUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginWithPassword)
router.post("/refresh", refreshAccessToken)
router.post("/logout", logoutUser)

export default router;