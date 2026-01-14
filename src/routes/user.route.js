import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { fetchAllUsers } from "../controllers/user.controller.js";
import authorizeRoles from "../middlewares/roles.middleware.js";

const router = express.Router()

router.get("/",verifyToken,authorizeRoles("admin"), fetchAllUsers)

export default router;