import { db } from "../db/index.js";
import { partNumbers } from "../db/schema/partNumbers.js";
import { and, eq, max } from "drizzle-orm";

import { uploadFile } from "../utils/uploadFile.js";

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

    if (!kindCode || !categoryCode || !functionCode || !designationCode || !description || !createdBy) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    };

    if (isSequenced) {
        const maxResult = await db
            .select({maxSeq: max(partNumbers.sequence)})
            .from(partNumbers)
            .where(
                and(
                    eq(partNumbers.kindCode, kindCode),
                    eq(partNumbers.categoryCode, categoryCode),
                    eq(partNumbers.functionCode, functionCode),
                    eq(partNumbers.designationCode, designationCode),
                )
            );
        
        sequence = (maxResult[0].maxSeq || 0) + 1;
    };
    
    const formattedSequence = String(sequence).padStart(3, "0");

    const formattedIdPn = `${kindCode + categoryCode + functionCode}-${designationCode + formattedSequence}`;

    try {
        // Mengambil file PDF
        let pdfUrl = null;

        if (pdfFile) {
            pdfUrl = await uploadFile("drawing-number", pdfFile, formattedIdPn, description);
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