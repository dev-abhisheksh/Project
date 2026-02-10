import express from "express"
import verifyToken from "../middlewares/auth.middleware.js"
import authorizeRoles from "../middlewares/roles.middleware.js"
import { createProblem, deleteProblem, getMyProblems, getPinnedProblems, getProblemById, getProblems, toggleDeleteProblemVisibility, togglePinProblem, updateMyProblem } from "../controllers/problem.controller.js"
import { upload } from "../middlewares/upload.moddleware.js"
import { checkBan } from "../middlewares/checkBan.middleware.js"

const router = express.Router()

router.post("/create", verifyToken, checkBan, upload.single("bannerImage"), createProblem)
router.get("/", verifyToken, getProblems)
router.patch("/:problemId/edit", verifyToken, upload.single("bannerImage"), updateMyProblem)
router.patch("/delete/:problemId", verifyToken, deleteProblem)
router.patch("/toggle/:problemId", verifyToken, authorizeRoles("admin"), toggleDeleteProblemVisibility)
router.get("/my", verifyToken, getMyProblems)

router.get("/get-pinned", verifyToken, getPinnedProblems)
router.patch("/pin/:problemId", verifyToken, togglePinProblem)

router.get("/:problemId", verifyToken, getProblemById)

export default router;