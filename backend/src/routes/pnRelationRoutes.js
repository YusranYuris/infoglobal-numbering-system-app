import express from "express";
import { 
    createPnRelation, 
    deletePnRelation, 
    getPnStructure
} from "../controllers/pnRelationController.js"
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// ------- PN RELATIONS ROUTES -------

// Create PN Relation
router.post("/", authenticate, createPnRelation)

// Get PN Relation Structure
router.get("/:rootId", authenticate, getPnStructure)

// Delete PN Relation
router.delete("/:id", authenticate, deletePnRelation)

export default router;