import express from "express";
import { 
    createDocument, 
    deleteDocument, 
    getAllDocuments, 
    getDocument, 
    updateDocument
} from "../controllers/documentController.js"
import { authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getAllDocuments)
router.get("/:id", authenticate, getDocument)
router.post("/", authenticate, upload.single("pdf"), createDocument)
router.put("/:id", authenticate, upload.single("pdf"), updateDocument)
router.delete("/:id", authenticate, deleteDocument)

export default router;