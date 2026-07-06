import express from "express";
import { createDrawingNumber, deleteDrawingNumber, getAllDrawingNumber, getDrawingNumber, previewAddDrawingNumber } from "../controllers/drawingNumberController.js"
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// ------- DRAWING NUMBERS ROUTES -------

// Get All Drawing Numbers
router.get("/", authenticate, getAllDrawingNumber)

// Create New Drawing Number
router.post("/", authenticate, createDrawingNumber)

// Preview New Drawing Number
router.post("/preview", authenticate, previewAddDrawingNumber)

// Get Drawing Number
router.get("/:id", authenticate, getDrawingNumber)

// Delete Drawing Number
router.delete("/:id", authenticate, deleteDrawingNumber)

export default router;