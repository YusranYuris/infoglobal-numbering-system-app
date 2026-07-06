import express from "express";
import {
    getAllPartNumbers,
    createPartNumber,
    getPartNumber,
    updatePartNumber,
    deletePartNumber,
    previewAddPartNumber,
} from "../controllers/partNumberController.js"
import { authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ------- PART NUMBERS ROUTES -------

// Get All Part Numbers
router.get("/", authenticate, getAllPartNumbers);

// Create New Part Number
router.post("/", authenticate, upload.single("pdf"), createPartNumber);

// Preview New Part Number
router.post("/preview", authenticate, previewAddPartNumber)

// Get Part Number
router.get("/:id", authenticate, getPartNumber);

// Update Part Number
router.put("/:id", authenticate, upload.single("pdf"), updatePartNumber);

// Delete Part Number
router.delete("/:id", authenticate, deletePartNumber);

export default router;