import express from "express";
import {
    getAllPartNumbers,
    createPartNumber,
    getPartNumber,
} from "../controllers/partNumberController.js"
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getAllPartNumbers);
router.get("/:id", authenticate, getPartNumber)
router.post("/", authenticate, createPartNumber);

export default router;