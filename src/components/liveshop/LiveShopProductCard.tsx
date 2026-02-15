import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, TrendingUp, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface LiveProduct {
  id: string;
  name: string;
  price: number;
  original_price?: number | null;
  image_url?: string | null;
  stock: number;
  sold_count: number;
  is_featured: boolean;
}

interface Props {
  product: LiveProduct;
}

export function LiveShopProductCard({ product }: Props) {
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const handleBuy = () => {
    toast.success(`${product.name} adicionado ao carrinho!`, {
      description: `Preço: R$ ${product.price.toFixed(2)}`,
    });
  };

  return (
    <Card className="p-3 md:p-4 bg-card/60 border-border/50 hover:border-primary/30 transition-all group">
      <div className="w-full h-24 md:h-32 rounded-lg mb-3 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-white/50" />
        )}
      </div>

      <h3 className="font-semibold mb-1 text-xs md:text-sm line-clamp-2">{product.name}</h3>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-lg md:text-2xl font-bold text-primary">
          R$ {product.price.toFixed(2)}
        </span>
        {product.original_price && (
          <span className="text-xs text-muted-foreground line-through">
            R$ {product.original_price.toFixed(2)}
          </span>
        )}
      </div>

      {discount > 0 && (
        <Badge variant="outline" className="mb-2 bg-green-500/10 border-green-500/20 text-green-400 text-xs">
          -{discount}% OFF
        </Badge>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>Estoque: {product.stock}</span>
        {product.sold_count > 0 && <span>{product.sold_count} vendidos</span>}
        <TrendingUp className="w-3 h-3 text-green-500" />
      </div>

      <Button onClick={handleBuy} className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-xs md:text-sm">
        <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
        Comprar Agora
      </Button>
    </Card>
  );
}
