import express from "express";
import { 
    createPnRelation, 
    getPnStructure
} from "../controllers/pnRelationController.js"

const router = express.Router();

router.get("/:rootId", getPnStructure)
router.post("/", createPnRelation)

export default router;