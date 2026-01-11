import express from "express";
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js"
import problemRouter from "./routes/problem.route.js"
import solutionRouter from "./routes/solution.route.js"
import voteRouter from "./routes/vote.route.js"
import reputationRouter from "./routes/reputation.route.js"
import notificationRouter from "./routes/notification.route.js"

dotenv.config();    

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.use("/api/v1/auth", authRouter)
app.use("/api/v1/problems", problemRouter)
app.use("/api/v1/solutions", solutionRouter)
app.use("/api/v1/votes", voteRouter)
app.use("/api/v1/reputations", reputationRouter)
app.use("/api/v1/notifications", notificationRouter)

export default app;