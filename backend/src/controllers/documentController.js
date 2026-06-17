import { max, and, eq, asc } from "drizzle-orm";
import { db } from "../db/index.js";
import { documents } from "../db/schema/documents.js";

import { uploadFile } from "../utils/uploadFile.js";
import { renameFile } from "../utils/renameFile.js";
import { deleteFile } from "../utils/deleteFile.js";

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

    const pdfFile = req.file;

    if (!productAbbr || !docKind || department === null || !companyAbbr || !year || !description) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    };

    if (isSequenced === true) {
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
        // Mengambil file PDF
        let pdfUrl = null;

        if (pdfFile) {
            pdfUrl = await uploadFile("document", pdfFile, formattedIdDoc, description);
        }

        // Insert ke dalam tabel documents pada database
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
                createdBy: createdBy,
                pdfUrl: pdfUrl,
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

// Untuk update Description dan File PDF pada Document
export const updateDocument = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    const pdfFile = req.file;

    try {
        const updateData = {
            description,
        }

        const formattedIdDoc = await db
            .select()
            .from(documents)
            .where(eq(documents.idDoc, id))
            .limit(1);

        if (formattedIdDoc.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        if (pdfFile) {
            await deleteFile(formattedIdDoc[0].pdfUrl)

            const pdfUrl = await uploadFile("document", pdfFile, formattedIdDoc[0].idDoc, description);

            updateData.pdfUrl = pdfUrl;
        }

        if (formattedIdDoc[0].pdfUrl) {
            // Rename nama file pada Supabase Storage Bucket dan ambil URL
            const pdfUrl = await renameFile("document", formattedIdDoc[0].idDoc, formattedIdDoc[0].description, description);

            updateData.pdfUrl = pdfUrl;
        }

        const updatedDocument = await db
            .update(documents)
            .set(updateData)
            .where(eq(documents.idDoc, id))
            .returning()

        res.status(200).json({
            success: true,
            data: updatedDocument[0]
        });

    } catch (error) {
        console.log("Error in updateDocument function", error)
        res.status(500).json({
            success:false,
            message: "Internal server error"
        })
    }
}

// Untuk delete Document
export const deleteDocument = async (req, res) => {
    const { id } = req.params;

    try {
        const document = await db
            .select()
            .from(documents)
            .where(eq(documents.idDoc, id))
        
        if (document.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        };

        await deleteFile(document[0].pdfUrl)

        const deletedDocument = await db
            .delete(documents)
            .where(eq(documents.idDoc, id))
            .returning()

        res.status(200).json({
            success: true,
            data: deletedDocument[0]
        })

    } catch (error) {
        console.log("Error in deleteDocument function", error)
        res.status(500).json({
            success:false,
            message: "Internal server error"
        })
    }
}