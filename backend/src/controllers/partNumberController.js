import { db } from "../db/index.js";
import { partNumbers } from "../db/schema/partNumbers.js";
import { and, asc, eq, max } from "drizzle-orm";

import { uploadFile } from "../utils/uploadFile.js";
import { deleteFile } from "../utils/deleteFile.js";
import { renameFile } from "../utils/renameFile.js";

export const getAllPartNumbers = async (req, res) => {
    try {
        const allPartNumbers = await db
            .select()
            .from(partNumbers)
            .orderBy(
                asc(partNumbers.idPn)
            )

        res.status(200).json({
            success: true,
            data: allPartNumbers
        });

    } catch (error) {
        console.log("Error in getAllPartNumber function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    };
};

export const createPartNumber = async (req, res) => {
    const {
        kindCode,
        categoryCode,
        functionCode,
        designationCode,
        sequence,
        isSequenced,
        description,
        createdBy
    } = req.body;
    
    const pdfFile = req.file;

    if (!kindCode || !categoryCode || !functionCode || !designationCode || !description || !createdBy) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    };
    
    const formattedSequence = String(sequence).padStart(3, "0");

    const formattedIdPn = `${kindCode + categoryCode + functionCode}-${designationCode + formattedSequence}`;

    try {
        // Mengambil file PDF
        let pdfUrl = null;

        if (pdfFile) {
            pdfUrl = await uploadFile("part-number", pdfFile, formattedIdPn, description);
        }

        // Insert ke dalam tabel part_numbers pada database
        const newPartNumber = await db
            .insert(partNumbers)
            .values({
                idPn: formattedIdPn,
                kindCode: kindCode,
                categoryCode: categoryCode,
                functionCode: functionCode,
                designationCode: designationCode,
                isSequenced: isSequenced,
                sequence: sequence,
                description: description,
                createdBy: createdBy,
                pdfUrl: pdfUrl
            }).returning();
            
        res.status(201).json({
            success: true,
            data: newPartNumber[0],
        });

    } catch (error) {
        console.log("Error in createPartNumber function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    };
};

export const previewAddPartNumber = async (req, res) => {
    const {
        kindCode,
        categoryCode,
        functionCode,
        designationCode,
        sequence,
        description,
        createdBy
    } = req.body;

    try {
        if (!kindCode || !categoryCode || !functionCode || !designationCode || !description || !createdBy) {
            return res.status(400).json({
                valid: false,
                message: "All fields are required"
            });
        };

        // If User Input the Sequence
        if (sequence) {
            const check = await db
                .select()
                .from(partNumbers)
                .where(
                    and(
                        eq(partNumbers.kindCode, kindCode),
                        eq(partNumbers.categoryCode, categoryCode),
                        eq(partNumbers.functionCode, functionCode),
                        eq(partNumbers.designationCode, designationCode),
                        eq(partNumbers.sequence, sequence)
                    )
                )
            // If the Sequence is already taken
            if (check.length > 0) {
                const sequences = await db
                    .select({
                        sequence: partNumbers.sequence,
                    })
                    .from(partNumbers)
                    .where(
                        and(
                            eq(partNumbers.kindCode, kindCode),
                            eq(partNumbers.categoryCode, categoryCode),
                            eq(partNumbers.functionCode, functionCode),
                            eq(partNumbers.designationCode, designationCode),
                        )
                    )
                    .orderBy(partNumbers.sequence);
                
                let next = 1;
                for (const row of sequences) {
                    if (row.sequence === next) {
                        next++;
                    } else if (row.sequence > next) {
                        break;
                    }
                };

                const formattedPn = `${kindCode + categoryCode + functionCode}-${designationCode + String(next).padStart(3, "0")}`;

                res.status(200).json({
                    valid: true,
                    chosen: true,
                    pn: formattedPn,
                    sequence: next
                });
            } else {
                const formattedPn = `${kindCode + categoryCode + functionCode}-${designationCode + String(sequence).padStart(3, "0")}`;

                res.status(200).json({
                    valid: true,
                    chosen: false,
                    pn: formattedPn,
                    sequence: sequence
                });
            }
        } else {
            // If User didn't input the Sequence
            const sequences = await db
                .select({
                    sequence: partNumbers.sequence,
                })
                .from(partNumbers)
                .where(
                    and(
                        eq(partNumbers.kindCode, kindCode),
                        eq(partNumbers.categoryCode, categoryCode),
                        eq(partNumbers.functionCode, functionCode),
                        eq(partNumbers.designationCode, designationCode),
                    )
                )
                .orderBy(partNumbers.sequence);
            
            let next = 1;
            for (const row of sequences) {
                if (row.sequence === next) {
                    next++;
                } else if (row.sequence > next) {
                    break;
                }
            };

            const formattedPn = `${kindCode + categoryCode + functionCode}-${designationCode + String(next).padStart(3, "0")}`;

            res.status(200).json({
                valid: true,
                chosen: false,
                pn: formattedPn,
                sequence: next
            });
        }
    } catch (error) {
        console.log("Error in previewAddPartNumber function", error)
        res.status(500).json({
            success:false,
            message: "Internal server error"
        })
    }
}

export const getPartNumber = async (req, res) => {
    const { id } = req.params;

    try {
        const partNumber = await db
            .select()
            .from(partNumbers)
            .where(eq(partNumbers.idPn, id))
        
        res.status(200).json({
            success: true,
            data: partNumber[0]
        })

    } catch (error) {
        console.log("Error in getPartNumber function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Untuk update Description dan File PDF pada Part Number
export const updatePartNumber = async (req, res) => {
    const { id } = req.params;
    const { description, pdfUrl } = req.body;
    const pdfFile = req.file;

    try {
        const updateData = {
            description
        }

        const formattedPartNumber = await db
            .select()
            .from(partNumbers)
            .where(eq(partNumbers.idPn, id))
            .limit(1)
        
        if (!formattedPartNumber.length) {
            return res.status(404).json({
                success: false,
                message: "Part Number not found"
            });
        }

        if (pdfFile) {
            await deleteFile(formattedPartNumber[0].pdfUrl)

            const pdfLink = await uploadFile("part-number", pdfFile, formattedPartNumber[0].idPn, description)

            updateData.pdfUrl = pdfLink;

        }

        if (formattedPartNumber[0].pdfUrl) {
            if (!pdfFile && !pdfUrl) {
                await deleteFile(formattedPartNumber[0].pdfUrl)
                updateData.pdfUrl = pdfUrl
            } else {
                const pdfLink = await renameFile("part-number", formattedPartNumber[0].idPn, formattedPartNumber[0].description, description)

                updateData.pdfUrl = pdfLink
            }
        }

        const updatedPartNumber = await db
            .update(partNumbers)
            .set(updateData)
            .where(eq(partNumbers.idPn, id))
            .returning()
        
        res.status(200).json({
            success: true,
            data: updatedPartNumber[0]
        });

    } catch (error) {
        console.log("Error in updatePartNumber function", error)
        res.status(500).json({
            success:false,
            message: "Internal server error"
        })
    }
}

// Untuk delete Part Number
export const deletePartNumber = async (req, res) => {
    const { id } = req.params;
    
    try {
        const partNumber = await db
            .select()
            .from(partNumbers)
            .where(eq(partNumbers.idPn, id))
        
        if (!partNumber.length) {
            return res.status(404).json({
                success: false,
                message: "Part Number not found"
            });
        }
    
        await deleteFile(partNumber[0].pdfUrl)

        const deletedPartNumber = await db
            .delete(partNumbers)
            .where(eq(partNumbers.idPn, id))
            .returning()

        res.status(200).json({
            success: true,
            data: deletedPartNumber[0]
        })

    } catch (error) {
        console.log("Error in deletePartNumber function", error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}