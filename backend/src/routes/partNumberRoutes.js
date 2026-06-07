import express from "express";
import {
    getAllPartNumbers,
    createPartNumber,
    getPartNumber,
} from "../controllers/partNumberController.js"

const router = express.Router();

router.get("/", getAllPartNumbers);
router.get("/:id", getPartNumber)
router.post("/", createPartNumber);

export default router;