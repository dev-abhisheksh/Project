import { Server } from "socket.io";
import app from "./src/app.js";
import connectDB from "./src/utils/db.js";
import dotenv from 'dotenv'
import http from "http"


dotenv.config();

connectDB()

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log("New Client connected:", socket.id)

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
    })
})

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`)
})