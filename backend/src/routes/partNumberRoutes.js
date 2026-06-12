import express from "express";
import {
    getAllPartNumbers,
    createPartNumber,
    getPartNumber,
} from "../controllers/partNumberController.js"
import { authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getAllPartNumbers);
router.get("/:id", authenticate, getPartNumber)
router.post("/", authenticate, upload.single("pdf"), createPartNumber);

export default router;