import { max, and, eq, asc } from "drizzle-orm";
import { db } from "../db/index.js";
import { documents } from "../db/schema/documents.js";

export const getAllDocuments = async (req, res) => {
    try {
        const allDocuments = await db
            .select()
            .from(documents)
            .orderBy(
                asc(documents.productAbbr),
                asc(documents.docKind),
                asc(documents.department),
                asc(documents.year),
                asc(documents.companyAbbr),
                asc(documents.sequence)
            )
        
        res.status(200).json({
            success: true,
            data: allDocuments
        });

    } catch (error) {
        console.log("Error in getAllDocument function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    };
};

export const getDocument = async (req, res) => {
    const { id } = req.params;

    try {
        const document = await db
            .select()
            .from(documents)
            .where(eq(documents.idDoc, id));

        res.status(200).json({
            success: true,
            data: document
        });
        
    } catch (error) {
        console.log("Error in getDocument function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    };
};

export const createDocument = async (req, res) => {
    const {
        productAbbr,
        docKind,
        department,
        companyAbbr,
        year,
        description,
        isSequenced,
        createdBy // Nanti diganti kalo sudah menggunakan JWT
    } = req.body;

    let { sequence } = req.body;

    if (!productAbbr || !docKind || !department || !companyAbbr || !year || !description) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    };

    if (isSequenced) {
        const maxResult = await db
            .select({maxSeq: max(documents.sequence)})
            .from(documents)
            .where(
                and(
                    eq(documents.productAbbr, productAbbr),
                    eq(documents.docKind, docKind),
                    eq(documents.department, department),
                    eq(documents.companyAbbr, companyAbbr),
                    eq(documents.year, year),
                    eq(documents.isSequenced, isSequenced)
                )
            );
        
        sequence = (maxResult[0].maxSeq || 0) + 1;
    };

    const formattedIdDoc = `${productAbbr}-${docKind}${String(sequence).padStart(3, "0")}${String(department).padStart(2, "0")}-${companyAbbr}-${year}`;

    try {
        const newDocument = await db
            .insert(documents)
            .values({
                idDoc: formattedIdDoc,
                productAbbr: productAbbr,
                docKind: docKind,
                sequence: sequence,
                department: department,
                companyAbbr: companyAbbr,
                year: year,
                description: description,
                isSequenced: isSequenced,
                createdBy: createdBy
            }).returning()
        
        res.status(201).json({
            success: true,
            data: newDocument[0]
        })

    } catch (error) {
        console.log("Error in createDocument function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};