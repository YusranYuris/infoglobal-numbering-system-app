import { db } from "../db/index.js";

import { uploadFile } from "../utils/uploadFile.js";

import { dnBranches } from "../db/schema/dnBranches.js";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { deleteFile } from "../utils/deleteFile.js";
import { renameFile } from "../utils/renameFile.js";
import { drawingNumbers } from "../db/schema/drawingNumbers.js";
import { buildDnTree } from "../utils/buildDnTree.js";
import { check } from "drizzle-orm/gel-core";

// Get All Branch for Drawing Number Table
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

// Create New Branch for Drawing Number Branch Form
export const createBranch = async (req, res) => {
    let {
        rootId,
        group,
        subGroup,
        subSg,
        description,
        createdBy
    } = req.body;

    const pdfFile = req.file;

    console.log(rootId)
    console.log(group)
    console.log(description)
    console.log(createdBy)

    // First Validation (Checking if there is empty values)
    if (!rootId || !group===null || !description || !createdBy){
        console.log("All fields are required (Missing fields detected)")
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    // Second Validation (Checking if Sub-Group is null and Sub-SG is not null which violates the rull)
    if (!subGroup && subSg) {
        console.log("Sub-Group field is null but Sub-SG field is not null. This action will violate the rules of Drawing Number")
        return res.status(400).json({
            success: false,
            message: "Invalid Assignment"
        });
    }

    const numSubGroup = subGroup ? Number(subGroup) : 0;
    const numSubSg = subSg ? Number(subSg) : 0;

    // Third Validation (Checking for Duplicate)
    const checkDuplicate = await db
        .select()
        .from(dnBranches)
        .where(
            and(
                eq(dnBranches.rootId, rootId),
                eq(dnBranches.group, group),
                eq(dnBranches.subGroup, numSubGroup),
                eq(dnBranches.subSg, numSubSg),
            )
        )
    
    if (checkDuplicate.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Drawing Number: ${checkDuplicate[0].idBranch} is already assigned`
        });
    }

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
        // Receiving the Uploaded PDF File
        let pdfUrl = null;

        if (pdfFile) {
            // Uploading File to Supabase Storage Bucket and receiving the file URL
            pdfUrl = await uploadFile("drawing-number", pdfFile, formattedBranch, description);
        }

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

// Get the Family Tree of a certain Drawing Number
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
        
        // Using the utils for Building a Drawing Number Tree
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

// Get all the affected Drawing Number for the Delete Modal
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
                previewBranches: affectedBranch.slice(1,)
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

// Get a single Drawing Number Branch for the Edit Modal
export const getBranch = async (req, res) => {
    const { id } = req.params;

    try {
        const branch = await db
            .select()
            .from(dnBranches)
            .where(eq(dnBranches.idBranch, id));
        
        res.status(200).json({
            success: true,
            data: branch[0]
        });

    } catch (error) {
        console.log("Error in getBranch function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a selected branch for the Edit Action
export const updateBranch = async (req, res) => {
    const { id } = req.params;
    const { description, pdfUrl } = req.body;
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

        // If User insert a new PDF file, the system will delete the original file in the storage and upload the new one
        if (pdfFile) {
            await deleteFile(formattedBranch[0].pdfUrl)

            const pdfUrl = await uploadFile("drawing-number", pdfFile, formattedBranch[0].idBranch, description);

            updateData.pdfUrl = pdfUrl;
        }

        // Drawing Number originally have a PDF Attachment
        if (formattedBranch[0].pdfUrl) {
            
            // If User only remove the original PDF File
            if (!pdfFile && !pdfUrl) {
                await deleteFile(formattedBranch[0].pdfUrl)
                updateData.pdfUrl = pdfUrl
            } else {
                // If the User only change the Description, automatically it will change the original PDF file name
                const pdfLink = await renameFile("drawing-number", formattedBranch[0].idPn, formattedBranch[0].description, description)

                updateData.pdfUrl = pdfLink
            }
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
            message: error.message
        })
    }
}

// Delete a selected Drawing Number for the Delete Action
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

        // Searching for an Affected Branch if this Drawing Number Branch is deleted
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
        } else {
            affectedBranch = [dnBranch[0]]
        }

        // Deleting every PDF Attachment for all of the Affected Branch (If Available)
        for (const branch of affectedBranch) {
            await deleteFile(branch.pdfUrl)
        };

        // Mapping all the Affected Branches ID
        const branchesToDelete = affectedBranch.map(
            branches => branches.idBranch
        );

        // Delete All Branch based on ID
        const deletedBranches = await db
            .delete(dnBranches)
            .where(inArray(dnBranches.idBranch, branchesToDelete))
            .returning()

        res.status(200).json({
            success: true,
            data: {
                mainBranch: deletedBranches[0],
                branchesToDelete: branchesToDelete
            }
        })

    } catch (error) {
        console.log("Error in deleteBranch function", error)
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}