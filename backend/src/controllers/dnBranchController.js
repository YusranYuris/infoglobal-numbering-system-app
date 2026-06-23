import { db } from "../db/index.js";

import { uploadFile } from "../utils/uploadFile.js";

import { dnBranches } from "../db/schema/dnBranches.js";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { deleteFile } from "../utils/deleteFile.js";
import { renameFile } from "../utils/renameFile.js";
import { drawingNumbers } from "../db/schema/drawingNumbers.js";
import { buildDnTree } from "../utils/buildDnTree.js";

export const getAllBranch = async (req, res) => {
    try {
        const allBranch = await db
            .select()
            .from(dnBranches)
            .orderBy(
                asc(dnBranches.rootId),
                asc(dnBranches.group),
                asc(dnBranches.subGroup),
                asc(dnBranches.subSg)
            );
        
        res.status(200).json({
            success: true,
            data: allBranch,
        });

    } catch (error) {
        console.log("Error in getAllBranch function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    };
};

export const createBranch = async (req, res) => {
    let {
        rootId,
        group,
        subGroup,
        subSg,
        description,
        createdBy
    } = req.body;  //Nanti yang createdBy diedit kalau udah pake JWT

    const pdfFile = req.file;

    if (!rootId || group===null || !description || !createdBy)
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });

    const numSubGroup = subGroup ? Number(subGroup) : 0;
    const numSubSg = subSg ? Number(subSg) : 0;

    const formattedGroup = String(group).padStart(2, "0");

    let formattedGroupSubGroupSubSG = ""

    if (numSubSg === 0) {
        if (numSubGroup === 0) {
            formattedGroupSubGroupSubSG = `${formattedGroup}-000`;
        } else {
            formattedGroupSubGroupSubSG = `${formattedGroup}-${String(numSubGroup).padStart(3, "0")}`;
        };
    } else {
        formattedGroupSubGroupSubSG = `${formattedGroup}-${numSubGroup + String(numSubSg).padStart(2, "0")}`;
    };
    
    const formattedBranch = String(`${rootId}-${formattedGroupSubGroupSubSG}`);

    try {
        // Mengambil file PDF
        let pdfUrl = null;

        if (pdfFile) {
            pdfUrl = await uploadFile("drawing-number", pdfFile, formattedBranch, description);
        }

        // Insert ke dalam tabel dn_branch pada database
        const newBranch = await db
            .insert(dnBranches)
            .values({
                idBranch: formattedBranch,
                rootId: rootId,
                group: group,
                subGroup: numSubGroup,
                subSg: numSubSg,
                description: description,
                createdBy: createdBy,
                pdfUrl: pdfUrl
            }).returning();
        res.status(201).json({
            success: true,
            data: newBranch[0],
        });

    } catch (error) {
        console.log("Error in createBranch function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    };
};

export const getTree = async (req, res) => {
    const { rootId } = req.params;

    try {
        const family = await db
            .select()
            .from(dnBranches)
            .where(eq(dnBranches.rootId, rootId))
        
        if (!family || family.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Data branch dengan rootId ${id} tidak ditemukan.`
            });
        }
        
        const tree = buildDnTree(family);

        res.status(200).json({
            success: true,
            data: tree
        });

    } catch (error) {
        console.log("Error in getTree function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const previewDeleteBranch = async (req, res) => {
    const { id } = req.params;

    try {
        const dnBranch = await db
            .select()
            .from(dnBranches)
            .where(eq(dnBranches.idBranch, id))
        
        if (!dnBranch.length) {
            return res.status(404).json({
                success: false,
                message: "Branch Not Found"
            });
        };

        let affectedBranch = []

        if (dnBranch[0].group === 0) {
            affectedBranch = await db
                .select()
                .from(dnBranches)
                .where(eq(dnBranches.rootId, dnBranch[0].rootId))
                .orderBy(
                    asc(dnBranches.group),
                    asc(dnBranches.subGroup),
                    asc(dnBranches.subSg)
                );

        } else if (dnBranch[0].subGroup === 0) {
            affectedBranch = await db
                .select()
                .from(dnBranches)
                .where(and(
                    eq(dnBranches.rootId, dnBranch[0].rootId),
                    eq(dnBranches.group, dnBranch[0].group)
                ))
                .orderBy(
                    asc(dnBranches.group),
                    asc(dnBranches.subGroup),
                    asc(dnBranches.subSg)
                );
                
        } else if (dnBranch[0].subSg === 0) {
            affectedBranch = await db
                .select()
                .from(dnBranches)
                .where(and(
                    eq(dnBranches.rootId, dnBranch[0].rootId),
                    eq(dnBranches.group, dnBranch[0].group),
                    eq(dnBranches.subGroup, dnBranch[0].subGroup),
                ))
                .orderBy(
                    asc(dnBranches.group),
                    asc(dnBranches.subGroup),
                    asc(dnBranches.subSg)
                );
        };

        return res.status(200).json({
            success: true,
            data: {
                idBranch: dnBranch[0].idBranch,
                description: dnBranch[0].description,
                affectedBranch: affectedBranch.length,
                previewBranches: affectedBranch.slice(1, 6)
            }
        })

    } catch (error) {
        console.log("Error in previewDeleteBranch function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getBranch = async (req, res) => {
    const { id } = req.params;

    try {
        const branch = await db
            .select()
            .from(dnBranches)
            .where(eq(dnBranches.idBranch, id));
        
        res.status(200).json({
            success: true,
            data: branch
        });

    } catch (error) {
        console.log("Error in getBranch function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Untuk update Description dan File PDF pada Drawing Number Branch
export const updateBranch = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    const pdfFile = req.file;

    try {
        const updateData = {
            description,
        }

        const formattedBranch = await db
            .select()
            .from(dnBranches)
            .where(eq(dnBranches.idBranch, id))
            .limit(1);

        if (!formattedBranch.length) {
            return res.status(404).json({
                success: false,
                message: "Branch not found"
            });
        }

        if (pdfFile) {
            await deleteFile(formattedBranch[0].pdfUrl)

            const pdfUrl = await uploadFile("drawing-number", pdfFile, formattedBranch[0].idBranch, description);

            updateData.pdfUrl = pdfUrl;
        }

        if (formattedBranch[0].pdfUrl) {
            // Rename nama file pada Supabase Storage Bucket dan ambil URL
            const pdfUrl = await renameFile("drawing-number" , formattedBranch[0].idBranch, formattedBranch[0].description, description)

            updateData.pdfUrl = pdfUrl;
        }

        const updatedBranch = await db
            .update(dnBranches)
            .set(updateData)
            .where(eq(dnBranches.idBranch, id))
            .returning()
        
        if (!formattedBranch[0].group && !formattedBranch[0].subGroup && !formattedBranch[0].subSg) {
            await db
                .update(drawingNumbers)
                .set({description: description})
                .where(eq(drawingNumbers.idDn, formattedBranch[0].rootId))
        }

        res.status(200).json({
            success: true,
            data: updatedBranch[0]
        });

    } catch (error) {
        console.log("Error in updateBranch function", error)
        res.status(500).json({
            success:false,
            message: "Internal server error"
        })
    }
}

// Untuk delete branch Drawing Number
export const deleteBranch = async (req, res) => {
    const { id } = req.params;

    try {
        const dnBranch = await db
            .select()
            .from(dnBranches)
            .where(eq(dnBranches.idBranch, id))
        
        if (dnBranch.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Branch not found"
            });
        };

        let affectedBranch = []

        if (dnBranch[0].group === 0) {
            affectedBranch = await db
                .select()
                .from(dnBranches)
                .where(eq(dnBranches.rootId, dnBranch[0].rootId))
                .orderBy(
                    asc(dnBranches.group),
                    asc(dnBranches.subGroup),
                    asc(dnBranches.subSg)
                );

        } else if (dnBranch[0].subGroup === 0) {
            affectedBranch = await db
                .select()
                .from(dnBranches)
                .where(and(
                    eq(dnBranches.rootId, dnBranch[0].rootId),
                    eq(dnBranches.group, dnBranch[0].group)
                ))
                .orderBy(
                    asc(dnBranches.group),
                    asc(dnBranches.subGroup),
                    asc(dnBranches.subSg)
                );
                
        } else if (dnBranch[0].subSg === 0) {
            affectedBranch = await db
                .select()
                .from(dnBranches)
                .where(and(
                    eq(dnBranches.rootId, dnBranch[0].rootId),
                    eq(dnBranches.group, dnBranch[0].group),
                    eq(dnBranches.subGroup, dnBranch[0].subGroup),
                ))
                .orderBy(
                    asc(dnBranches.group),
                    asc(dnBranches.subGroup),
                    asc(dnBranches.subSg)
                );
        };

        for (const branch of affectedBranch) {
            await deleteFile(branch.pdfUrl)
        };

        const branchesToDelete = affectedBranch.map(
            branches => branches.idBranch
        );

        const deletedBranches = await db
            .delete(dnBranches)
            .where(inArray(dnBranches.idBranch, branchesToDelete))
            .returning()

        res.status(200).json({
            success: true,
            data: deletedBranches
        })

    } catch (error) {
        console.log("Error in deleteBranch function", error)
        res.status(500).json({
            success:false,
            message: "Internal server error"
        })
    }
}