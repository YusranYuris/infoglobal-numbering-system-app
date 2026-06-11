import express from "express";
import { 
    createPnRelation, 
    getPnStructure
} from "../controllers/pnRelationController.js"
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:rootId", authenticate, getPnStructure)
router.post("/", authenticate, createPnRelation)

export default router;