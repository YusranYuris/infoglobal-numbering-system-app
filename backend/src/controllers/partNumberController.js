import { db } from "../db/index.js";
import { partNumbers } from "../db/schema/partNumbers.js";
import { and, eq, max } from "drizzle-orm";

import { uploadFile } from "../utils/uploadFile.js";
import { deleteFile } from "../utils/deleteFile.js";
import { renameFile } from "../utils/renameFile.js";

export const getAllPartNumbers = async (req, res) => {
    try {
        const allPartNumbers = await db
            .select()
            .from(partNumbers);

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

export const getPartNumber = async (req, res) => {
    const { id } = req.params;

    try {
        const partNumber = await db
            .select()
            .from(partNumbers)
            .where(eq(partNumbers.idPn, id))
        
        res.status(200).json({
            success: true,
            data: partNumber
        })

    } catch (error) {
        console.log("Error in getPartNumber function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const createPartNumber = async (req, res) => {
    const {
        kindCode,
        categoryCode,
        functionCode,
        designationCode,
        isSequenced,
        description,
        createdBy
    } = req.body;

    let { sequence } = req.body;
    
    const pdfFile = req.file;

    if (!kindCode || !categoryCode || !functionCode || !designationCode || !description || !createdBy) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    };

    if (isSequenced === 'true') {
        console.log(isSequenced)
        const maxResult = await db
            .select({maxSeq: max(partNumbers.sequence)})
            .from(partNumbers)
            .where(
                and(
                    eq(partNumbers.kindCode, kindCode),
                    eq(partNumbers.categoryCode, categoryCode),
                    eq(partNumbers.functionCode, functionCode),
                    eq(partNumbers.designationCode, designationCode),
                    eq(partNumbers.isSequenced, true)
                )
            );
        
        sequence = (maxResult[0].maxSeq || 0) + 1;
    };

    console.log(sequence)
    
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
}

// Untuk update Description dan File PDF pada Part Number
export const updatePartNumber = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
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

            const pdfUrl = await uploadFile("part-number", pdfFile, formattedPartNumber[0].idPn, description)

            updateData.pdfUrl = pdfUrl;

        }

        if (formattedPartNumber[0].pdfUrl) {
            const pdfUrl = await renameFile("part-number", formattedPartNumber[0].idPn, formattedPartNumber[0].description, description)

            updateData.pdfUrl = pdfUrl
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