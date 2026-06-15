import { supabase } from "../config/supabase.js";

export const deleteFile = async (pdfUrl) => {
    if (!pdfUrl) return;

    const marker ="/object/public/infoglobal-document-files/"
    const rawPath = pdfUrl.split(marker)[1];
    const path = decodeURIComponent(rawPath);

    if (!path) {
        throw new Error("Invalid Supabase URL");
    }

    const { error } = await supabase.storage
        .from("infoglobal-document-files")
        .remove([path]);

    if (error) {
        throw error;
    }
};