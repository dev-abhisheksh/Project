import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/roles.middleware.js";
import { getNotifications, readNotifications } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", verifyToken, authorizeRoles("expert"), getNotifications)
router.patch("/:notificationId/read", verifyToken, authorizeRoles("expert"), readNotifications)

export default router;