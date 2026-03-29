import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Share2, Download, Copy, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  imageUrl: string;
  title?: string;
  compact?: boolean;
}

export const ShareButtons = ({ imageUrl, title = "Minha foto gerada com IA", compact = false }: ShareButtonsProps) => {
  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${title} ✨\n\nCriada com Arcana AI\n${imageUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareToInstagram = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "arcana-ai.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title, text: "Criada com Arcana AI ✨" });
      } else {
        await navigator.clipboard.writeText(imageUrl);
        toast.success("Link copiado! Cole no Instagram Stories");
      }
    } catch {
      await navigator.clipboard.writeText(imageUrl);
      toast.success("Link copiado! Cole no Instagram Stories");
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(imageUrl);
    toast.success("Link copiado!");
  };

  const nativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: "Criada com Arcana AI ✨", url: imageUrl });
      } else {
        copyLink();
      }
    } catch {
      // User cancelled
    }
  };

  if (compact) {
    return (
      <div className="flex gap-1.5">
        <Button variant="outline" size="sm" onClick={shareToWhatsApp} className="gap-1 text-[10px] h-7 px-2">
          <MessageCircle className="w-3 h-3" /> WhatsApp
        </Button>
        <Button variant="outline" size="sm" onClick={shareToInstagram} className="gap-1 text-[10px] h-7 px-2">
          <Share2 className="w-3 h-3" /> Stories
        </Button>
        <Button variant="outline" size="sm" onClick={copyLink} className="gap-1 text-[10px] h-7 px-2">
          <Copy className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={shareToWhatsApp} className="gap-2 text-xs rounded-xl">
        <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
      </Button>
      <Button variant="outline" size="sm" onClick={shareToInstagram} className="gap-2 text-xs rounded-xl">
        <Share2 className="w-4 h-4 text-pink-500" /> Instagram
      </Button>
      <Button variant="outline" size="sm" onClick={nativeShare} className="gap-2 text-xs rounded-xl">
        <Share2 className="w-4 h-4" /> Compartilhar
      </Button>
      <Button variant="outline" size="sm" onClick={copyLink} className="gap-2 text-xs rounded-xl">
        <Copy className="w-4 h-4" /> Copiar Link
      </Button>
    </div>
  );
};
