import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config()

const app = express()
const PORT = process.env.PORT

// Middleware
app.use(express.json())
app.use(cors()) // Penghubung Backend dengan Frontend dengan PORT berbeda
app.use(helmet()) // Security middleware that sets various HTTP headers
app.use(morgan("dev")) // Log the request

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});