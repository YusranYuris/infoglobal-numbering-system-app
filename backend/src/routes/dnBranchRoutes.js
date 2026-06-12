import express from "express";
import {
    createBranch, 
    getAllBranch,
    getBranch
} from "../controllers/dnBranchController.js"
import { authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getAllBranch);
router.get("/:id",  authenticate, getBranch)
router.post("/", authenticate, upload.single("pdf"), createBranch);

export default router;