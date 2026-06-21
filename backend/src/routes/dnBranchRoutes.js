import express from "express";
import {
    createBranch, 
    deleteBranch, 
    getAllBranch,
    getBranch,
    getTree,
    previewDelete,
    updateBranch
} from "../controllers/dnBranchController.js"
import { authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ------- DRAWING NUMBER BRANCHES ROUTES -------

// Get All Branch
router.get("/", authenticate, getAllBranch);

// Create New Branch
router.post("/", authenticate, upload.single("pdf"), createBranch);

// Get Tree
router.get("/:rootId/tree", authenticate, getTree)

// Preview Delete
router.get("/:id/preview-delete", authenticate, previewDelete)

// Get Branch
router.get("/:id",  authenticate, getBranch);

// Update Branch
router.put("/:id", authenticate, upload.single("pdf"), updateBranch);

// Delete Branch
router.delete("/:id", authenticate, deleteBranch);

export default router;