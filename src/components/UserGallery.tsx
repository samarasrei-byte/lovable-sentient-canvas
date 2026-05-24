import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, Download, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface UserImage {
  id: string;
  template_name: string;
  product_name: string;
  image_url: string;
  created_at: string;
}

interface UserGalleryProps {
  onReuse?: (image: UserImage) => void;
}

export const UserGallery = ({ onReuse }: UserGalleryProps) => {
  const [images, setImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserImages();
  }, []);

  const fetchUserImages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        const localImages = localStorage.getItem('arcana_user_generated');
        if (localImages) {
          try {
            setImages(JSON.parse(localImages));
          } catch (e) {
            console.error('Failed to parse local images:', e);
            localStorage.removeItem('arcana_user_generated');
          }
        }
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching user images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (imageUrl: string, productName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `arcana-${productName}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download iniciado!");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) return null;

  return (
    <Card className="p-6 border-2 border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <History className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Suas Criações</h3>
          <p className="text-sm text-muted-foreground">
            Suas fotos geradas ficam salvas para sempre
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group overflow-hidden hover:shadow-lg transition-all">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={image.image_url}
                  alt={image.product_name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-2 opacity-60 cursor-not-allowed"
                      disabled
                    >
                      <Edit className="h-3 w-3" />
                      Em Breve
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDownload(image.image_url, image.product_name)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold truncate">
                    {image.template_name === 'Criança' || image.template_name === 'Bebê' 
                      ? `${image.product_name} (${image.template_name})`
                      : image.product_name}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {new Date(image.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};