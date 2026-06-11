import express from "express";
import { createDrawingNumber, getAllDrawingNumber, getDrawingNumber } from "../controllers/drawingNumberController.js"
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All Routes
router.get("/", authenticate, getAllDrawingNumber)

router.get("/:id", authenticate, getDrawingNumber)

router.post("/", authenticate, createDrawingNumber)

export default router;