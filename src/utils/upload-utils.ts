import { supabase } from "@/integrations/supabase/client";
import heic2any from "heic2any";
import { toast } from "sonner";

/**
 * World-class image processing utility
 * Handles HEIC conversion, size validation, and Supabase Storage upload
 */
export const processAndUploadImage = async (
  file: File,
  bucket: string = "user-photos",
  folder: string = "uploads"
): Promise<{ url: string | null; error: string | null }> => {
  try {
    let fileToUpload = file;

    // 1. Handle HEIC/HEIF (common on iOS)
    if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif")) {
      console.log("HEIC detected, converting...");
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8,
        });
        
        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        fileToUpload = new File([blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
          type: "image/jpeg",
        });
      } catch (err) {
        console.error("HEIC conversion failed:", err);
        return { url: null, error: "Falha ao converter imagem HEIC. Tente JPG ou PNG." };
      }
    }

    // 2. Size Validation (Max 10MB)
    if (fileToUpload.size > 10 * 1024 * 1024) {
      return { url: null, error: "Imagem muito grande. Limite de 10MB." };
    }

    // 3. Generate unique path
    const fileExt = fileToUpload.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // 4. Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileToUpload, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { url: null, error: "Falha no upload para o servidor." };
    }

    // 5. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (err: any) {
    console.error("Processing error:", err);
    return { url: null, error: err.message || "Erro inesperado ao processar imagem." };
  }
};
