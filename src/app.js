import express from "express";
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js"

dotenv.config();

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.use("/api/v1/auth", authRouter)

export default app;