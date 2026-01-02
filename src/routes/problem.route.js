import express from "express"
import verifyToken from "../middlewares/auth.middleware.js"
import authorizeRoles from "../middlewares/roles.middleware.js"
import { createProblem } from "../controllers/problem.controller.js"

const router = express.Router()

router.post("/create", verifyToken, createProblem)

export default router;