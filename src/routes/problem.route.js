import express from "express"
import verifyToken from "../middlewares/auth.middleware.js"
import authorizeRoles from "../middlewares/roles.middleware.js"
import { createProblem, deleteProblem, getMyProblems, getProblemById, getProblems, toggleDeleteProblemVisibility } from "../controllers/problem.controller.js"
import { upload } from "../middlewares/upload.moddleware.js"

const router = express.Router()

router.post("/create", verifyToken, upload.single("bannerImage"), createProblem)
router.get("/", verifyToken, getProblems)
router.patch("/delete/:problemId", verifyToken, deleteProblem)
router.patch("/toggle/:problemId", verifyToken, authorizeRoles("admin"), toggleDeleteProblemVisibility)
router.get("/my", verifyToken, getMyProblems)
router.get("/:problemId", verifyToken, getProblemById)

export default router;