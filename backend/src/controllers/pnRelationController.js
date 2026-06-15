import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { pnRelations } from "../db/schema/pnRelations.js";

export const getPnStructure = async (req, res) => {
    const { rootId } = req.params;

    const rows = await db
        .select()
        .from(pnRelations)
        .where(eq(pnRelations.rootId, rootId));
    
    res.json(rows);
};

export const createPnRelation = async (req, res) => {
    const {
        rootId,
        parentId,
        pnCode,
        hierarchy
    } = req.body;

    try {
        const newPnRelation = await db
            .insert(pnRelations)
            .values({
                rootId: rootId,
                parentId: parentId,
                pnCode: pnCode,
                hierarchy: hierarchy,
            }).returning();
        
        res.status(201).json({
            success: true,
            data: newPnRelation[0]
        });
    } catch (error) {
        console.log("Error in createPnRelation function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const deletePnRelation = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPnRelation = await db
            .delete(pnRelations)
            .where(eq(pnRelations.idRelations, id))
            .returning();
        
        res.status(200).json({
            success: true,
            data: deletedPnRelation[0]
        });
            
    } catch (error) {
        console.log("Error in deletePnRelation function", error)
        res.status(500).json({
            success: true,
            data: deletedPnRelation[0]
        });
    }
}