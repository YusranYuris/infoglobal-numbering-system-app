import express from "express";
import { 
    createDocument, 
    deleteDocument, 
    getAllDocuments, 
    getDocument, 
    previewAddDocument, 
    updateDocument
} from "../controllers/documentController.js"
import { authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ------- DOCUMENTS ROUTES -------

// Get All Documents
router.get("/", authenticate, getAllDocuments)

// Create New Document
router.post("/", authenticate, upload.single("pdf"), createDocument)

// Preview New Document Number
router.post("/preview", authenticate, previewAddDocument)

// Get Document
router.get("/:id", authenticate, getDocument)

// Update Document
router.put("/:id", authenticate, upload.single("pdf"), updateDocument)

// Delete Document
router.delete("/:id", authenticate, deleteDocument)

export default router;