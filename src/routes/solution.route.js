import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/roles.middleware.js";
import { createSolution } from "../controllers/solution.controller.js";

const router = express.Router()

router.post("/create/:problemId", verifyToken, authorizeRoles("admin", "expert"), createSolution)

export default router