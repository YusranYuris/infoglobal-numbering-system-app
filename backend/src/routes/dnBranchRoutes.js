import express from "express";
import {
    createBranch, 
    getAllBranch,
    getBranch
} from "../controllers/dnBranchController.js"
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getAllBranch);
router.get("/:id",  authenticate, getBranch)
router.post("/",  authenticate, createBranch);

export default router;