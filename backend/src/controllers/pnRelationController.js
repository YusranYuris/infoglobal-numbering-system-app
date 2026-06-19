import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { pnRelations } from "../db/schema/pnRelations.js";
import { buildPnTree } from "../utils/buildPnTree.js";
import { partNumbers } from "../db/schema/partNumbers.js";
import { flattenTreeData } from "../utils/flattenTree.js";

export const getPnForest = async (req, res) => {
    try {
        const allRelations = await db
            .select({
                rootId: pnRelations.rootId,
                parentId: pnRelations.parentId,
                pnCode: pnRelations.pnCode,
                hierarchy: pnRelations.hierarchy,
                description: partNumbers.description,
                createdBy: partNumbers.createdBy,
                pdfUrl: partNumbers.pdfUrl,
            })
            .from(pnRelations)
            .leftJoin(
                partNumbers,
                eq(pnRelations.pnCode, partNumbers.idPn)
            );

        
        if (!allRelations || allRelations.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Data branch dengan tidak ditemukan.`
            });
        };

        const forestBeta = buildPnTree(allRelations)

        const forest = flattenTreeData(forestBeta)


        res.status(200).json({
            success: true,
            data: forest
        });
    } catch (error) {
        console.log("Error in getPnForest function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
    
};

export const createPnRelation = async (req, res) => {
    const {
        rootId,
        parentId,
        pnCode,
        hierarchy
    } = req.body;

    try {
        const numHierarchy = Number(hierarchy)
        const newPnRelation = await db
            .insert(pnRelations)
            .values({
                rootId: rootId,
                parentId: parentId,
                pnCode: pnCode,
                hierarchy: numHierarchy,
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

export const getTree = async (req, res) => {
    const {rootId} = req.params;

    try {
        const family = await db
            .select({
                rootId: pnRelations.rootId,
                parentId: pnRelations.parentId,
                pnCode: pnRelations.pnCode,
                hierarchy: pnRelations.hierarchy,
                description: partNumbers.description,
                createdBy: partNumbers.createdBy,
                pdfUrl: partNumbers.pdfUrl,
            })
            .from(pnRelations)
            .where(eq(pnRelations.rootId, rootId))
            .leftJoin(
                partNumbers,
                eq(pnRelations.pnCode, partNumbers.idPn)
            );
        
        if (!family || family.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Data branch dengan tidak ditemukan.`
            });
        };

        const tree = buildPnTree(family)

        res.status(200).json({
            success: true,
            data: tree[0]
        });
    } catch (error) {
        console.log("Error in getTree function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
    
};

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