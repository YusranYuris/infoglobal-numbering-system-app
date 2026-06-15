import express from "express";
import {
    createBranch, 
    deleteBranch, 
    getAllBranch,
    getBranch,
    updateBranch
} from "../controllers/dnBranchController.js"
import { authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getAllBranch);
router.get("/:id",  authenticate, getBranch);
router.post("/", authenticate, upload.single("pdf"), createBranch);
router.put("/:id", authenticate, upload.single("pdf"), updateBranch)
router.delete("/:id", authenticate, deleteBranch);

export default router;