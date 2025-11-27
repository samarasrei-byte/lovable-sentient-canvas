import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ShowcaseImage {
  id: string;
  template_name: string;
  product_name: string;
  image_url: string;
  likes_count: number;
  created_at: string;
}

export const PublicShowcase = () => {
  const [images, setImages] = useState<ShowcaseImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  useEffect(() => {
    fetchShowcaseImages();
    loadLikedImages();
  }, [sortBy]);

  const loadLikedImages = () => {
    const liked = localStorage.getItem('arcana_liked_images');
    if (liked) {
      setLikedImages(new Set(JSON.parse(liked)));
    }
  };

  const fetchShowcaseImages = async () => {
    try {
      const orderBy = sortBy === 'recent' ? 'created_at' : 'likes_count';
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('is_public', true)
        .order(orderBy, { ascending: false })
        .limit(12);

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

  if (loading) {
    return (
      <section className="py-24 px-6 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 w-64 bg-muted animate-pulse rounded-lg mx-auto mb-4" />
            <div className="h-6 w-96 bg-muted animate-pulse rounded-lg mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Galeria Pública</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Criações da Comunidade
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Veja o que outros criadores estão produzindo com nosso AI Studio
          </motion.p>

          <div className="flex items-center justify-center gap-2">
            <Button
              variant={sortBy === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('recent')}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Mais Recentes
            </Button>
            <Button
              variant={sortBy === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('popular')}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Mais Curtidas
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
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
                    <h3 className="text-white font-semibold text-lg">
                      {image.product_name}
                    </h3>
                  </div>
                </div>
                
                <div className="p-4 flex items-center justify-between">
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
        </div>
      </div>
    </section>
  );
};
