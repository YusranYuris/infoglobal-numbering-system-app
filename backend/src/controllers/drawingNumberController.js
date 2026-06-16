import { db } from "../db/index.js";
import { drawingNumbers, dnBranches } from "../db/schema/index.js";
import { and, eq, max } from "drizzle-orm";

export const getAllDrawingNumber = async (req, res) => {
    try {
        const allDrawingNumbers = await db
            .select()
            .from(drawingNumbers);
        
        res.status(200).json({
            success: true,
            data: allDrawingNumbers
        });
        
    } catch (error) {
        console.log("Error in getAllDrawingNumber function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getDrawingNumber = async (req, res) => {
    const { id } = req.params;
    
    try {
        const drawingNumber = await db
            .select()
            .from(drawingNumbers)
            .where(eq(drawingNumbers.idDn, id))

        res.status(200).json({
            success: true,
            data: drawingNumber[0]
        })

    } catch (error) {
        console.log("Error in getDrawingNumber function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createDrawingNumber = async (req, res) => {
    let { 
        drawingKind, 
        kindCode, 
        categoryCode, 
        functionCode, 
        designationCode, 
        sequence, 
        description,
        isSequenced,
        createdBy
    } = req.body; //Nanti yang createdBy diedit kalau udah pake JWT

    if (!drawingKind || !kindCode || !categoryCode || !functionCode || !designationCode || !description || !createdBy) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    };
    
    if (isSequenced) {
        const maxResult = await db
            .select({maxSeq: max(drawingNumbers.sequence)})
            .from(drawingNumbers)
            .where(
                and(
                    eq(drawingNumbers.drawingKind, drawingKind),
                    eq(drawingNumbers.kindCode, kindCode),
                    eq(drawingNumbers.categoryCode, categoryCode),
                    eq(drawingNumbers.functionCode, functionCode),
                    eq(drawingNumbers.designationCode, designationCode),
                    eq(drawingNumbers.isSequenced, isSequenced)
                )
            );
        
        sequence = (maxResult[0].maxSeq || 0) + 1;
    };

    const formattedSequence = String(sequence).padStart(3, "0");

    const formattedIdDn = `${drawingKind}-${kindCode + categoryCode + functionCode}-${designationCode + formattedSequence}`;

    try {
        const newDrawingNumber = await db
            .insert(drawingNumbers)
            .values({
                idDn: formattedIdDn,
                drawingKind: drawingKind,
                kindCode: kindCode,
                categoryCode: categoryCode,
                functionCode: functionCode,
                designationCode: designationCode,
                isSequenced: isSequenced,
                sequence: sequence,
                description: description,
                createdBy: createdBy,
            }).returning();
        
        const formattedBranch = `${formattedIdDn}-00-000`
        
        const newBranch = await db
            .insert(dnBranches)
            .values({
                idBranch: formattedBranch,
                rootId: formattedIdDn,
                group: 0,
                subGroup: 0,
                subSg: 0,
                description: description,
                createdBy: createdBy,
                pdfUrl: null
            }).returning();
            
        res.status(201).json({
            success: true,
            data: {
                drawingNumber: newDrawingNumber[0],
                branch: newBranch[0]
            }
        });

    } catch (error) {
        console.log("Error in createDrawingNumber function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    };
};

export const deleteDrawingNumber = async (req, res) => {
    const { id } = req.params;

    try {
        const drawingNumber = await db
            .select()
            .from(drawingNumbers)
            .where(eq(drawingNumbers.idDn, id))

        if (drawingNumber.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Drawing Number not found"
            })
        };

        const deletedPartNumber = await db
            .delete(drawingNumbers)
            .where(eq(drawingNumbers.idDn, id))
            .returning()

        res.status(200).json({
            success: true,
            data: deletedPartNumber[0]
        })
        
    } catch (error) {
        console.log("Error in deletePartNumber function", error)
        res.status(500).json({
            success:false,
            message: "Internal server error"
        })
    }
}