import express from "express";
import { 
    createDocument, 
    getAllDocuments, 
    getDocument 
} from "../controllers/documentController.js"

const router = express.Router();

router.get("/", getAllDocuments)
router.get("/:id", getDocument)
router.post("/", createDocument)

export default router;