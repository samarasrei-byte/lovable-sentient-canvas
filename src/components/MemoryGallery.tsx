import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Image as ImageIcon, Download, Search, Calendar, Filter,
  Heart, Share2, Sparkles, Eye, Loader2, X, ChevronLeft, ChevronRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { ShareButtons } from "./ShareButtons";

interface MemoryItem {
  id: string;
  prompt_id: string;
  generated_image_url: string | null;
  user_photo_url: string | null;
  generation_status: string;
  created_at: string;
  amount_cents: number;
  prompt_name: string;
  prompt_category: string;
  prompt_example_url: string | null;
}

interface MemoryGalleryProps {
  className?: string;
}

export const MemoryGallery = ({ className = "" }: MemoryGalleryProps) => {
  const [items, setItems] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<MemoryItem | null>(null);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const { data, error } = await supabase
        .from("prompt_purchases")
        .select("id, prompt_id, generated_image_url, user_photo_url, generation_status, created_at, amount_cents, prompts(name, category, example_image_url)")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      const mapped = (data || []).map((item: any) => ({
        id: item.id,
        prompt_id: item.prompt_id,
        generated_image_url: item.generated_image_url,
        user_photo_url: item.user_photo_url,
        generation_status: item.generation_status,
        created_at: item.created_at,
        amount_cents: item.amount_cents,
        prompt_name: item.prompts?.name || "Prompt",
        prompt_category: item.prompts?.category || "",
        prompt_example_url: item.prompts?.example_image_url || null,
      }));

      setItems(mapped);
    } catch (error) {
      console.error("Error loading memories:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(items.map(i => i.prompt_category).filter(Boolean)));

  const filtered = items.filter(item => {
    if (categoryFilter !== "all" && item.prompt_category !== categoryFilter) return false;
    if (search && !item.prompt_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const completedItems = filtered.filter(i => i.generation_status === "completed" && i.generated_image_url);
  const pendingItems = filtered.filter(i => i.generation_status !== "completed");

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    toast.success(favorites.has(id) ? "Removido dos favoritos" : "Adicionado aos favoritos ❤️");
  };

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `arcana-${name.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.click();
    toast.success("Download iniciado!");
  };

  const navigateItem = (direction: 1 | -1) => {
    if (!selectedItem) return;
    const idx = completedItems.findIndex(i => i.id === selectedItem.id);
    const next = completedItems[idx + direction];
    if (next) setSelectedItem(next);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Galeria de Memórias</h2>
          <Badge variant="outline" className="text-[9px] border-primary/30 text-primary">
            {completedItems.length} fotos
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome..."
            className="pl-10 h-10 sm:h-8 text-sm sm:text-xs bg-card/50 border-border/20 rounded-xl"
          />
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-1.5 pb-2">
            <Button
              variant={categoryFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter("all")}
              className="text-[10px] h-9 sm:h-8 px-4 sm:px-3 rounded-xl shrink-0"
            >
              Todos
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={categoryFilter === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(cat)}
                className="text-[10px] h-9 sm:h-8 px-4 sm:px-3 rounded-xl shrink-0 capitalize"
              >
                {cat}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Grid */}
      {completedItems.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-muted-foreground/15 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhuma memória ainda</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Suas fotos geradas aparecerão aqui</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {completedItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card
                className="bg-card/50 border-border/20 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer group relative"
                onClick={() => setSelectedItem(item)}
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img
                    src={item.generated_image_url!}
                    alt={item.prompt_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" className="h-7 text-[10px] gap-1 rounded-lg" onClick={e => { e.stopPropagation(); handleDownload(item.generated_image_url!, item.prompt_name); }}>
                      <Download className="w-3 h-3" /> Baixar
                    </Button>
                    {item.user_photo_url && (
                      <Button size="sm" variant="secondary" className="h-7 text-[10px] gap-1 rounded-lg" onClick={e => { e.stopPropagation(); setSelectedItem(item); setShowBeforeAfter(true); }}>
                        <Eye className="w-3 h-3" /> A/D
                      </Button>
                    )}
                  </div>

                  {/* Favorite button */}
                  <button
                    onClick={e => { e.stopPropagation(); toggleFavorite(item.id); }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors z-10"
                  >
                    <Heart className={`w-3.5 h-3.5 ${favorites.has(item.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>
                </div>
                <div className="p-2.5">
                  <p className="text-[11px] font-bold text-foreground truncate">{item.prompt_name}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    {new Date(item.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pending items */}
      {pendingItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin" />
            {pendingItems.length} geração(ões) em andamento
          </p>
        </div>
      )}

      {/* Lightbox / Detail modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { setSelectedItem(null); setShowBeforeAfter(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => { setSelectedItem(null); setShowBeforeAfter(false); }}
                className="absolute top-2 right-2 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Navigation arrows */}
              <button
                onClick={() => navigateItem(-1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateItem(1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                {/* Before/After or Single image */}
                {showBeforeAfter && selectedItem.user_photo_url && selectedItem.generated_image_url ? (
                  <BeforeAfterSlider
                    beforeImage={selectedItem.user_photo_url}
                    afterImage={selectedItem.generated_image_url}
                    className="aspect-[4/5] w-full"
                  />
                ) : (
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src={selectedItem.generated_image_url!}
                      alt={selectedItem.prompt_name}
                      className="w-full object-contain max-h-[65vh]"
                    />
                  </div>
                )}

                {/* Info bar */}
                <div className="bg-card/90 backdrop-blur-sm rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{selectedItem.prompt_name}</h3>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(selectedItem.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                        {" · "}
                        {selectedItem.prompt_category}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {selectedItem.user_photo_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                          className="text-[10px] h-7 gap-1 rounded-lg"
                        >
                          <Eye className="w-3 h-3" />
                          {showBeforeAfter ? "Ver foto" : "Antes/Depois"}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleDownload(selectedItem.generated_image_url!, selectedItem.prompt_name)}
                        className="text-[10px] h-7 gap-1 rounded-lg"
                      >
                        <Download className="w-3 h-3" /> Baixar
                      </Button>
                    </div>
                  </div>

                  {/* Share */}
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1.5">Compartilhar:</p>
                    <ShareButtons imageUrl={selectedItem.generated_image_url!} title={selectedItem.prompt_name} compact />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
