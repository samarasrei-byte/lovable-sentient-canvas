import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LiveShopTopBar, LiveShopVideoArea, LiveShopChat, LiveShopProductCard } from "@/components/liveshop";
import { useIsMobile } from "@/hooks/use-mobile";

const DEMO_SESSION_ID = "a0000000-0000-0000-0000-000000000001";

interface LiveProduct {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  stock: number;
  sold_count: number;
  is_featured: boolean;
}

export default function LiveShop() {
  const isMobile = useIsMobile();
  const [viewers, setViewers] = useState(1247);
  const [likes, setLikes] = useState(3456);
  const [presenterType, setPresenterType] = useState<"avatar" | "influencer">("avatar");
  const [presenterName, setPresenterName] = useState("Luna AI");
  const [products, setProducts] = useState<LiveProduct[]>([]);
  const [showProducts, setShowProducts] = useState(false);
  const [mobileTab, setMobileTab] = useState<"video" | "chat" | "products">("video");

  // Load products from DB
  useEffect(() => {
    const loadProducts = async () => {
      const { data } = await supabase
        .from("live_products")
        .select("*")
        .eq("session_id", DEMO_SESSION_ID)
        .order("display_order");

      if (data) setProducts(data);
    };
    loadProducts();
  }, []);

  // Simulate viewer fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((prev) => Math.max(0, prev + Math.floor(Math.random() * 10 - 3)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLike = () => {
    setLikes((prev) => prev + 1);
  };

  const togglePresenter = () => {
    const next = presenterType === "avatar" ? "influencer" : "avatar";
    setPresenterType(next);
    setPresenterName(next === "avatar" ? "Luna AI" : "Ana Silva");
    toast.success(next === "avatar" ? "Trocado para Avatar IA" : "Trocado para Influencer Real");
  };

  // ── Mobile Layout ──
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <LiveShopTopBar
          title="Black Friday Especial 🔥"
          isLive
          viewers={viewers}
          likes={likes}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {mobileTab === "video" && (
            <LiveShopVideoArea
              presenterType={presenterType}
              presenterName={presenterName}
              likesCount={likes}
              onLike={handleLike}
              onTogglePresenter={togglePresenter}
            />
          )}
          {mobileTab === "chat" && (
            <LiveShopChat sessionId={DEMO_SESSION_ID} className="flex-1" />
          )}
          {mobileTab === "products" && (
            <ScrollArea className="flex-1 p-3">
              <div className="grid grid-cols-2 gap-3">
                {products.map((p) => (
                  <LiveShopProductCard key={p.id} product={p} />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Mobile Bottom Tab Bar */}
        <div className="border-t border-border/50 bg-card/80 backdrop-blur-sm flex">
          {(["video", "chat", "products"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={`flex-1 py-3 text-xs font-semibold transition-colors ${
                mobileTab === tab
                  ? "text-primary border-t-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              {tab === "video" && "📺 Ao Vivo"}
              {tab === "chat" && "💬 Chat"}
              {tab === "products" && "🛍️ Produtos"}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Desktop Layout ──
  return (
    <div className="h-screen flex flex-col bg-background">
      <LiveShopTopBar
        title="Black Friday Especial 🔥"
        isLive
        viewers={viewers}
        likes={likes}
        showProductsToggle
        onToggleProducts={() => setShowProducts(!showProducts)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Products */}
        <div className="w-80 border-r border-border/50 bg-card/30 backdrop-blur-sm flex flex-col">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Produtos em Destaque</h2>
            </div>
            <p className="text-sm text-muted-foreground">Compre agora com desconto exclusivo</p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {products.map((p) => (
                <LiveShopProductCard key={p.id} product={p} />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Center: Video */}
        <div className="flex-1 flex flex-col">
          <LiveShopVideoArea
            presenterType={presenterType}
            presenterName={presenterName}
            likesCount={likes}
            onLike={handleLike}
            onTogglePresenter={togglePresenter}
          />
        </div>

        {/* Right: Chat */}
        <div className="w-96 border-l border-border/50 bg-card/30 backdrop-blur-sm flex flex-col">
          <LiveShopChat sessionId={DEMO_SESSION_ID} className="flex-1" />
        </div>
      </div>
    </div>
  );
}
