import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ShowcaseImage {
  id: string;
  template_name: string;
  product_name: string;
  image_url: string;
  likes_count: number;
  created_at: string;
}

export const CommunityCarousel = () => {
  const [images, setImages] = useState<ShowcaseImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchShowcaseImages();
    loadLikedImages();
  }, []);

  const loadLikedImages = () => {
    const liked = localStorage.getItem('arcana_liked_images');
    if (liked) {
      setLikedImages(new Set(JSON.parse(liked)));
    }
  };

  const fetchShowcaseImages = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('is_public', true)
        .order('likes_count', { ascending: false })
        .limit(9);

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching showcase images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (imageId: string) => {
    if (likedImages.has(imageId)) {
      toast.info("Você já curtiu esta imagem!");
      return;
    }

    try {
      const fingerprint = getFingerprint();
      
      const { error: likeError } = await supabase
        .from('image_likes')
        .insert({
          image_id: imageId,
          user_fingerprint: fingerprint
        });

      if (likeError) {
        if (likeError.code === '23505') {
          toast.info("Você já curtiu esta imagem!");
          return;
        }
        throw likeError;
      }

      const { error: updateError } = await supabase
        .from('generated_images')
        .update({ likes_count: images.find(img => img.id === imageId)!.likes_count + 1 })
        .eq('id', imageId);

      if (updateError) throw updateError;

      const newLiked = new Set(likedImages);
      newLiked.add(imageId);
      setLikedImages(newLiked);
      localStorage.setItem('arcana_liked_images', JSON.stringify([...newLiked]));

      setImages(images.map(img => 
        img.id === imageId ? { ...img, likes_count: img.likes_count + 1 } : img
      ));

      toast.success("Curtiu! ❤️");
    } catch (error) {
      console.error('Error liking image:', error);
      toast.error("Erro ao curtir. Tente novamente.");
    }
  };

  const getFingerprint = () => {
    let fingerprint = localStorage.getItem('arcana_fingerprint');
    if (!fingerprint) {
      fingerprint = `fp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem('arcana_fingerprint', fingerprint);
    }
    return fingerprint;
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 3 >= images.length ? 0 : prev + 3));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 3 < 0 ? Math.max(0, images.length - 3) : prev - 3));
  };

  if (loading) return null;
  if (images.length === 0) return null;

  const visibleImages = images.slice(currentIndex, currentIndex + 3);

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Criações da Comunidade</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Inspirações Recentes
          </h2>
          
          <p className="text-muted-foreground max-w-xl mx-auto">
            Veja o que outros criadores estão produzindo
          </p>
        </div>

        <div className="relative">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="shrink-0 h-12 w-12 rounded-full shadow-lg"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="grid md:grid-cols-3 gap-6 flex-1">
              <AnimatePresence mode="wait">
                {visibleImages.map((image) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <img
                          src={image.image_url}
                          alt={image.product_name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <Badge variant="secondary" className="mb-2">
                            {image.template_name}
                          </Badge>
                          <h3 className="text-white font-semibold">
                            {image.product_name}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="p-3 flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(image.id)}
                          className={`flex items-center gap-2 ${
                            likedImages.has(image.id) ? 'text-red-500' : 'text-muted-foreground'
                          } hover:text-red-500 transition-colors`}
                        >
                          <Heart 
                            className={`h-4 w-4 ${likedImages.has(image.id) ? 'fill-current' : ''}`}
                          />
                          <span className="text-sm font-medium">{image.likes_count || 0}</span>
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          {new Date(image.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="shrink-0 h-12 w-12 rounded-full shadow-lg"
              disabled={currentIndex + 3 >= images.length}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(images.length / 3) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * 3)}
                className={`h-2 rounded-full transition-all ${
                  Math.floor(currentIndex / 3) === i 
                    ? 'w-8 bg-primary' 
                    : 'w-2 bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
