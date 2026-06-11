import express from "express";
import { 
    createDocument, 
    getAllDocuments, 
    getDocument 
} from "../controllers/documentController.js"
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getAllDocuments)
router.get("/:id", authenticate, getDocument)
router.post("/", authenticate, createDocument)

export default router;