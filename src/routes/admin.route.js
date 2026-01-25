import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/roles.middleware.js";
import { expertApplicationRequests } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/expert-applications", verifyToken, authorizeRoles("admin"), expertApplicationRequests)

export default router;