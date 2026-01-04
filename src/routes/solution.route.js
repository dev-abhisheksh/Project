import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/roles.middleware.js";
import { acceptSolution, allSolutionsOfProblem, createSolution } from "../controllers/solution.controller.js";

const router = express.Router()

router.post("/create/:problemId", verifyToken, authorizeRoles("admin", "expert"), createSolution)
router.patch("/accept/:solutionId", verifyToken, authorizeRoles("expert"), acceptSolution)
router.get("/:problemId", verifyToken, allSolutionsOfProblem)

export default router