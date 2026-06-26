import express from "express";
import { 
    createPnRelation, 
    deletePnRelation, 
    getPnForest,
    getTree,
    previewDeletePn, 
} from "../controllers/pnRelationController.js"
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// ------- PN RELATIONS ROUTES -------

// Create PN Relation
router.post("/", authenticate, createPnRelation)

// Get PN Relation Structure
router.get("/", authenticate, getPnForest)

// Get PN Relation Tree 
router.get("/:rootId/tree", authenticate, getTree)

// Get PN Preview Delete
router.get("/:idRelations/preview-delete", authenticate, previewDeletePn)

// Delete PN Relation
router.delete("/:idRelations", authenticate, deletePnRelation)

export default router;