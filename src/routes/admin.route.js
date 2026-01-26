import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/roles.middleware.js";
import { approveExpertApplication, expertApplicationRequests } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/expert-applications", verifyToken, authorizeRoles("admin"), expertApplicationRequests)
router.patch("/expert-applications/:applicationId/approve", verifyToken, authorizeRoles("admin"), approveExpertApplication)

export default router;