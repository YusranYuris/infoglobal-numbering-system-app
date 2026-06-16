import express from "express";
import { createDrawingNumber, deleteDrawingNumber, getAllDrawingNumber, getDrawingNumber } from "../controllers/drawingNumberController.js"
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// ------- DRAWING NUMBERS ROUTES -------

// Get All Drawing Numbers
router.get("/", authenticate, getAllDrawingNumber)

// Create New Drawing Numbers
router.post("/", authenticate, createDrawingNumber)

// Get Drawing Number
router.get("/:id", authenticate, getDrawingNumber)

// Delete Drawing Number
router.delete("/:id", authenticate, deleteDrawingNumber)

export default router;