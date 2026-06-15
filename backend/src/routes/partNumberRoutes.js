import express from "express";
import {
    getAllPartNumbers,
    createPartNumber,
    getPartNumber,
    updatePartNumber,
    deletePartNumber,
} from "../controllers/partNumberController.js"
import { authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getAllPartNumbers);
router.post("/", authenticate, upload.single("pdf"), createPartNumber);
router.get("/:id", authenticate, getPartNumber);
router.put("/:id", authenticate, upload.single("pdf"), updatePartNumber);
router.delete("/:id", authenticate, deletePartNumber);

export default router;