import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Radio, Share2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface Props {
  title: string;
  isLive: boolean;
  viewers: number;
  likes: number;
  onToggleProducts?: () => void;
  showProductsToggle?: boolean;
}

export function LiveShopTopBar({ title, isLive, viewers, likes, onToggleProducts, showProductsToggle }: Props) {
  const handleShare = () => {
    const liveLink = `${window.location.origin}/live/black-friday-especial`;
    navigator.clipboard.writeText(liveLink);
    toast.success("Link copiado para área de transferência!");
  };

  return (
    <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm px-3 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {isLive && (
            <Badge className="bg-red-500 animate-pulse flex-shrink-0">
              <Radio className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">AO VIVO</span>
            </Badge>
          )}
          <h1 className="text-sm md:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-6 text-xs md:text-sm flex-shrink-0">
          {showProductsToggle && (
            <Button variant="outline" size="sm" className="md:hidden" onClick={onToggleProducts}>
              <ShoppingCart className="w-4 h-4" />
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleShare} className="hidden sm:flex">
            <Share2 className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden md:inline">Compartilhar</span>
          </Button>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            <span className="font-semibold">{viewers.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
            <span className="font-semibold">{likes.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
