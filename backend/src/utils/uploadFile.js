import { supabase } from "../config/supabase.js";

export const uploadFile = async (folder, file, code, description) => {
    const fileName = `${code} ${description}`;
    
    const { data, error } = await supabase.storage
        .from("infoglobal-document-files")
        .upload(
            `${folder}/${fileName}`,
            file.buffer,
            {
                contentType: file.mimetype,
            }
        );
    
    if (error) {
        throw error;
    }

    return supabase.storage
        .from("infoglobal-document-files")
        .getPublicUrl(data.path)
        .data.publicUrl;
};