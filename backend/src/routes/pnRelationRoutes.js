import express from "express";
import { 
    createPnRelation, 
    deletePnRelation, 
    getPnForest,
    getTree, 
} from "../controllers/pnRelationController.js"
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// ------- PN RELATIONS ROUTES -------

// Create PN Relation
router.post("/", authenticate, createPnRelation)

// Get PN Relation Structure
router.get("/", authenticate, getPnForest)

router.get("/:rootId/tree", authenticate, getTree)

// Delete PN Relation
router.delete("/:id", authenticate, deletePnRelation)

export default router;