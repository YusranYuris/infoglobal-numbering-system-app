import express from "express";
import { createDrawingNumber, getAllDrawingNumber, getDrawingNumber } from "../controllers/drawingNumberController.js"

const router = express.Router();

// All Routes
router.get("/", getAllDrawingNumber)

router.get("/:id", getDrawingNumber)

router.post("/", createDrawingNumber)

export default router;