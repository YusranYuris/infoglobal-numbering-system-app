import express from "express";
import {
    createBranch, 
    getAllBranch,
    getBranch
} from "../controllers/dnBranchController.js"

const router = express.Router();

router.get("/", getAllBranch);
router.get("/:id", getBranch)
router.post("/", createBranch);

export default router;