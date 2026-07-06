import { db } from "../db/index.js";
import { and, eq, inArray } from "drizzle-orm";
import { pnRelations } from "../db/schema/pnRelations.js";
import { buildPnTree } from "../utils/buildPnTree.js";
import { partNumbers } from "../db/schema/partNumbers.js";
import { flattenTreeData } from "../utils/flattenTree.js";
import { findNode } from "../utils/findNode.js";

export const getPnForest = async (req, res) => {
    try {
        const allRelations = await db
            .select({
                idRelations: pnRelations.idRelations,
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
                message: `Data relation tidak ditemukan.`
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
    } = req.body;

    try {
        // First Validation
        if (rootId !== pnCode) {
            const checkRoot = await db
                .select()
                .from(pnRelations)
                .where(
                    eq(pnRelations.rootId, rootId)
                )
            
            if (checkRoot.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: `There is no Root Part Number: ${rootId}`
                })
            }
        }

        // Second Validation
        const checkPnCode = await db
            .select()
            .from(pnRelations)
            .where(
                and(
                    eq(pnRelations.rootId, rootId),
                    eq(pnRelations.pnCode, pnCode),
                )
            )
        
        if (checkPnCode.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Part Number: ${pnCode} is already assigned in Root Part Number: ${rootId} family`
            })
        }

        // Third Validation
        const check = await db
            .select()
            .from(pnRelations)
            .where(
                and(
                    eq(pnRelations.rootId, rootId),
                    eq(pnRelations.parentId, parentId),
                    eq(pnRelations.pnCode, pnCode),
                )
            )
        
        if (check.length > 0) {
            return res.status(400).json({
                success: false,
                message: "The Part Number Relation You Create is already Assigned"
            })
        };

        if (rootId === pnCode && parentId !== pnCode) {
            return res.status(400).json({
                success: false,
                message: "Invalid Assignment"
            })
        }

        let hierarchyPlaceholder = 0;

        if (rootId !== pnCode) {
            const findHierarchy = await db
                .select({hierarchy: pnRelations.hierarchy})
                .from(pnRelations)
                .where(
                    and(
                        eq(pnRelations.rootId, rootId),
                        eq(pnRelations.pnCode, parentId)
                    )
                )

            if (findHierarchy[0].hierarchy === 4) {
                return res.status(400).json({
                    success: false,
                    message: "You cannot assign a Part Number lower than a Great-Grandchild"
                })
            } else {
                hierarchyPlaceholder = findHierarchy[0].hierarchy + 1;
            }
        } else {
            hierarchyPlaceholder = 1;
        }

        const numHierarchy = Number(hierarchyPlaceholder)
        const newPnRelation = await db
            .insert(pnRelations)
            .values({
                rootId: rootId,
                parentId: parentId,
                pnCode: pnCode,
                hierarchy: numHierarchy,
            }).returning();
        
        return res.status(201).json({
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

export const previewDeletePn = async (req, res) => {
    const { idRelations } = req.params;

    try {
        const pnRoot = await db
            .select({
                idRelations: pnRelations.idRelations,
                rootId: pnRelations.rootId,
                parentId: pnRelations.parentId,
                pnCode: pnRelations.pnCode,
                hierarchy: pnRelations.hierarchy,
                description: partNumbers.description,
            })
            .from(pnRelations)
            .where(eq(pnRelations.idRelations, idRelations))
            .leftJoin(
                partNumbers,
                eq(pnRelations.pnCode, partNumbers.idPn)
            );

        const pnFamily = await db
            .select({
                idRelations: pnRelations.idRelations,
                rootId: pnRelations.rootId,
                parentId: pnRelations.parentId,
                pnCode: pnRelations.pnCode,
                hierarchy: pnRelations.hierarchy,
                description: partNumbers.description,
            })
            .from(pnRelations)  
            .where(eq(pnRelations.rootId, pnRoot[0].rootId))
            .leftJoin(
                partNumbers,
                eq(pnRelations.pnCode, partNumbers.idPn)
            );

        if (!pnFamily || pnFamily.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Data branch tidak ditemukan.`
            });
        };

        const tree = buildPnTree(pnFamily);

        const subFamily = findNode(tree[0], pnRoot[0].pnCode);

        const affectedPn = flattenTreeData([subFamily]);

        return res.status(200).json({
            success: true,
            data: {
                pnCode: pnRoot[0].pnCode,
                description: pnRoot[0].description,
                affectedPn: affectedPn.length,
                previewPn: affectedPn.slice(1,)
            }
        })

    } catch (error) {
        console.log("Error in previewDeletePn function", error)
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const deletePnRelation = async (req, res) => {
    const { idRelations } = req.params;

    try {
        const pnRoot = await db
            .select({
                idRelations: pnRelations.idRelations,
                rootId: pnRelations.rootId,
                parentId: pnRelations.parentId,
                pnCode: pnRelations.pnCode,
                hierarchy: pnRelations.hierarchy,
                description: partNumbers.description,
            })
            .from(pnRelations)
            .where(eq(pnRelations.idRelations, idRelations))
            .leftJoin(
                partNumbers,
                eq(pnRelations.pnCode, partNumbers.idPn)
            );

        const pnFamily = await db
            .select({
                idRelations: pnRelations.idRelations,
                rootId: pnRelations.rootId,
                parentId: pnRelations.parentId,
                pnCode: pnRelations.pnCode,
                hierarchy: pnRelations.hierarchy,
                description: partNumbers.description,
            })
            .from(pnRelations)  
            .where(eq(pnRelations.rootId, pnRoot[0].rootId))
            .leftJoin(
                partNumbers,
                eq(pnRelations.pnCode, partNumbers.idPn)
            );

        if (!pnFamily || pnFamily.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Data branch tidak ditemukan.`
            });
        };

        const tree = buildPnTree(pnFamily);

        const subFamily = findNode(tree[0], pnRoot[0].pnCode);

        const affectedPn = flattenTreeData([subFamily]);

        const relationsToDelete = affectedPn.map(
            relations => relations.idRelations
        );

        const deletedRelations = await db
            .delete(pnRelations)
            .where(inArray(pnRelations.idRelations, relationsToDelete))
            .returning()

        res.status(200).json({
            success: true,
            data: {
                mainRelation: deletedRelations[0],
                relationsToDelete: relationsToDelete
            }
        })
            
    } catch (error) {
        console.log("Error in deletePnRelation function", error)
        res.status(500).json({
            success: true,
            data: deletedPnRelation[0]
        });
    }
}