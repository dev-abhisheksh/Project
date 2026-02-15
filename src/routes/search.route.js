import express from "express"
import verifyToken from "../middlewares/auth.middleware.js";
import { search } from "../controllers/search.controller.js";

const router = express.Router();

router.post("/", verifyToken, search)

export default router;