import app from "./src/app.js";
import connectDB from "./src/utils/db.js";
import dotenv from 'dotenv'

dotenv.config();

connectDB()

app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`)
})