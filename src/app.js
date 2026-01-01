import express from "express";
import dotenv from 'dotenv'

dotenv.config();

const app = express();

app.use("/",(req , res)=>{
    res.send("Welcome to home page")
})

export default app;