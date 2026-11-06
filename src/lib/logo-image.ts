/**
 * Converte um arquivo de imagem em um data URL PNG reduzido (máx. 512px),
 * para ser salvo junto ao cliente e desenhado nos vídeos sem problemas de CORS.
 */
export const MAX_LOGO_FILE_BYTES = 5 * 1024 * 1024;

export async function fileToLogoDataUrl(file: File, maxSide = 512): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Envie um arquivo de imagem (PNG, JPG, SVG ou WebP).");
  if (file.size > MAX_LOGO_FILE_BYTES) throw new Error("O logo deve ter no máximo 5MB.");
  const src = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Não foi possível ler esta imagem."));
      el.src = src;
    });
    const w0 = img.naturalWidth || maxSide;
    const h0 = img.naturalHeight || maxSide;
    const scale = Math.min(1, maxSide / Math.max(w0, h0));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(w0 * scale));
    canvas.height = Math.max(1, Math.round(h0 * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Seu navegador não suporta o processamento do logo.");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(src);
  }
}
