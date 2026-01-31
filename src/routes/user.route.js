import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { fetchAllUsers } from "../controllers/user.controller.js";
import authorizeRoles from "../middlewares/roles.middleware.js";
import { getUserDashboardStats } from "../controllers/userDashboard.controller.js";

const router = express.Router()

router.get("/", verifyToken, fetchAllUsers)


// --------------------- USER DASHBOARD --------------------
router.get("/stats", verifyToken, getUserDashboardStats)

export default router;