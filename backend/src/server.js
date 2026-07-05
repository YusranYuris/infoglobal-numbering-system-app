import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import homeRoutes from "./routes/homeRoutes.js"
import dnBranchRoutes from "./routes/dnBranchRoutes.js"
import documentRoutes from "./routes/documentRoutes.js"
import drawingNumberRoutes from "./routes/drawingNumberRoutes.js"
import partNumberRoutes from "./routes/partNumberRoutes.js"
import pnRelationRoutes from "./routes/pnRelationRoutes.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT

// Middleware
app.use(express.json())
app.use(cors()) // Penghubung Backend dengan Frontend dengan PORT berbeda
app.use(helmet()) // Security middleware that sets various HTTP headers
app.use(morgan("dev")) // Log the request

app.use("/api/v1/home", homeRoutes)
app.use("/api/v1/dn-branches", dnBranchRoutes)
app.use("/api/v1/documents", documentRoutes)
app.use("/api/v1/drawing-numbers", drawingNumberRoutes)
app.use("/api/v1/part-numbers", partNumberRoutes)
app.use("/api/v1/pn-relations", pnRelationRoutes)
app.use("/api/v1/users", userRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});