import { supabase } from "../config/supabase.js";

export const renameFile = async (folder, code, oldDescription, newDescription) => {
    // Susun nama file lama dan nama file baru
    const oldFileName = `${code} ${oldDescription}`;
    const newFileName = `${code} ${newDescription}`;

    const oldPath = `${folder}/${oldFileName}`;
    const newPath = `${folder}/${newFileName}`;

    // Jika nama tidak berubah, langsung return public URL lama agar hemat resource
    if (oldPath === newPath) {
        return supabase.storage
            .from("infoglobal-document-files")
            .getPublicUrl(oldPath)
            .data.publicUrl;
    }

    // Fungsi .move() untuk me-rename/memindahkan file
    const { data, error } = await supabase.storage
        .from("infoglobal-document-files")
        .move(oldPath, newPath);

    if (error) {
        throw error;
    }

    // Ambil dan kembalikan Public URL yang baru
    return supabase.storage
        .from("infoglobal-document-files")
        .getPublicUrl(newPath)
        .data.publicUrl;
};