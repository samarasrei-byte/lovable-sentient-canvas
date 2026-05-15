import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface GalleryImage {
  id: string;
  name: string;
  category: string;
  example_image_url: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Hypando": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "LinkedIn": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Fashion": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Geral": "bg-green-500/20 text-green-300 border-green-500/30",
  "Arte": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Anime": "bg-red-500/20 text-red-300 border-red-500/30",
  "Cyberpunk": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Aniversário": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Copa do Mundo": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Política": "bg-slate-500/20 text-slate-300 border-slate-500/30",
  "Foto de casais": "bg-rose-500/20 text-rose-300 border-rose-500/30",
  "Profissional": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "Social Media": "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

export const MassiveGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [expanded, setExpanded] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["gallery-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prompts")
        .select("id, name, category, example_image_url")
        .neq("status", "inactive")
        .not("example_image_url", "is", null)
        .order("category")
        .order("display_order");

      if (error) throw error;
      return (data || []).filter(d => d.example_image_url) as GalleryImage[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour cache for gallery
  });

  const categories = useMemo(() => {
    const cats = [...new Set(images.map(i => i.category))].sort();
    return ["Todos", ...cats];
  }, [images]);

  const filtered = useMemo(() => {
    if (selectedCategory === "Todos") return images;
    return images.filter(i => i.category === selectedCategory);
  }, [images, selectedCategory]);

  const displayImages = expanded ? filtered : filtered.slice(0, 20);
  const hasMore = filtered.length > 20;

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section id="galeria" className="relative py-20 md:py-28 px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">GALERIA DE CRIAÇÕES</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight px-4 leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {images.length}+
            </span>{" "}
            Estilos Disponíveis
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Cada imagem abaixo é um estilo que você pode aplicar à sua própria foto.
            Escolha, envie e receba sua versão única.
          </p>
        </header>

        <div className="mb-8 overflow-hidden">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex justify-start sm:justify-center gap-2 pb-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setExpanded(false); }}
                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all shrink-0 ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                      : "bg-card/50 text-muted-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {cat}
                  {cat !== "Todos" && (
                    <span className="ml-1 opacity-60">
                      ({images.filter(i => i.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Masonry-like Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {displayImages.map((img, idx) => (
            <div
              key={img.id}
              className="group cursor-pointer relative rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 aspect-[4/5]"
              onClick={() => setLightboxImage(img)}
            >
              <img
                src={img.example_image_url}
                alt={img.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading={idx < 8 ? "eager" : "lazy"}
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-medium truncate">{img.name}</p>
                  <Badge className={`mt-1 text-[10px] ${CATEGORY_COLORS[img.category] || "bg-muted text-muted-foreground"}`}>
                    {img.category}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More / Less */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors font-medium text-sm"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Mostrar menos
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Ver todos os {filtered.length} estilos
                </>
              )}
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 max-w-lg mx-auto">
          {[
            { value: images.length + "+", label: "Estilos" },
            { value: categories.length - 1, label: "Categorias" },
            { value: "4K", label: "Resolução" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-xl md:text-3xl font-black text-primary leading-none">{stat.value}</div>
              <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mt-1 font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            <img
              src={lightboxImage.example_image_url}
              alt={lightboxImage.name}
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
              <p className="text-white font-medium">{lightboxImage.name}</p>
              <Badge className={`mt-1 ${CATEGORY_COLORS[lightboxImage.category] || ""}`}>
                {lightboxImage.category}
              </Badge>
            </div>
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
