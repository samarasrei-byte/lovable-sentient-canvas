import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Heart, 
  RefreshCw, 
  Trash2, 
  ImageIcon, 
  Loader2, 
  Search,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface UserImage {
  id: string;
  image_url: string;
  template_name: string;
  created_at: string;
  is_favorite: boolean;
  original_purchase_id?: string;
}

export const MyPhotos = () => {
  const [images, setImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  useEffect(() => {
    loadImages();
  }, [filter]);

  const loadImages = async () => {
    setLoading(true);
    if (!user) return;

    let query = supabase
      .from("generated_images" as any)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (filter === "favorites") {
      query = query.eq("is_favorite", true);
    }

    const { data, error } = await (query as any);

    if (error) {
      toast.error("Erro ao carregar fotos");
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const toggleFavorite = async (id: string, currentState: boolean) => {
    const { error } = await (supabase
      .from("generated_images" as any)
      .update({ is_favorite: !currentState } as any)
      .eq("id", id) as any);

    if (error) {
      toast.error("Erro ao atualizar favorito");
    } else {
      setImages(prev => prev.map(img => img.id === id ? { ...img, is_favorite: !currentState } : img));
      toast.success(currentState ? "Removido dos favoritos" : "Adicionado aos favoritos");
    }
  };

  const handleDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Erro ao baixar imagem");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Minhas Fotos</h2>
          <p className="text-sm text-muted-foreground">Sua galeria pessoal de gerações</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('all')}
            className="rounded-xl"
          >
            Todas
          </Button>
          <Button 
            variant={filter === 'favorites' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('favorites')}
            className="rounded-xl gap-2"
          >
            <Heart className={`w-4 h-4 ${filter === 'favorites' ? 'fill-current' : ''}`} />
            Favoritos
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-border/40 bg-transparent">
          <div className="flex flex-col items-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground font-medium">Nenhuma foto encontrada</p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              {filter === 'favorites' ? 'Você ainda não favoritou nenhuma foto.' : 'Comece a gerar imagens para vê-las aqui.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="group relative aspect-[4/5] overflow-hidden rounded-2xl border-border/20 bg-card/40 hover:border-primary/30 transition-all duration-300">
                  <img 
                    src={img.image_url} 
                    alt={img.template_name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className={`h-8 w-8 rounded-lg bg-black/40 backdrop-blur-md hover:bg-black/60 ${img.is_favorite ? 'text-red-500' : 'text-white'}`}
                        onClick={() => toggleFavorite(img.id, img.is_favorite)}
                      >
                        <Heart className={`w-4 h-4 ${img.is_favorite ? 'fill-current' : ''}`} />
                      </Button>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 p-3 space-y-2">
                      <p className="text-[11px] font-bold text-white truncate">{img.template_name}</p>
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 h-8 text-[10px] rounded-lg bg-primary hover:bg-primary/90"
                          onClick={() => handleDownload(img.image_url, img.template_name)}
                        >
                          <Download className="w-3.5 h-3.5 mr-1.5" />
                          Baixar HD
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
