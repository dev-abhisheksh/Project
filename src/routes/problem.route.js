import express from "express"
import verifyToken from "../middlewares/auth.middleware.js"
import authorizeRoles from "../middlewares/roles.middleware.js"
import { createProblem, deleteProblem, getProblemById, getProblems } from "../controllers/problem.controller.js"

const router = express.Router()

router.post("/create", verifyToken, createProblem)
router.get("/", verifyToken, getProblems)
router.get("/:problemId", verifyToken, getProblemById)
router.patch("/delete/:problemId", verifyToken, deleteProblem)

export default router;