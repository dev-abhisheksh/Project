import express from "express";
import { loginWithPassword, registerUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginWithPassword)

export default router;