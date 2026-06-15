import express from "express";
import { 
    createPnRelation, 
    getPnStructure
} from "../controllers/pnRelationController.js"
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// ------- PN RELATIONS ROUTES -------

// Create PN Relation
router.post("/", authenticate, createPnRelation)

// Get PN Relation Structure
router.get("/:rootId", authenticate, getPnStructure)

export default router;