import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ZoomIn, ZoomOut, Maximize2, RotateCw, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FullScreenImageViewerProps {
  image: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const FullScreenImageViewer = ({ image, isOpen, onClose, title = "Visualização 4K" }: FullScreenImageViewerProps) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `arcana-render-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Imagem salva com sucesso!");
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Arcana AI Render',
          text: 'Confira esta imagem gerada com Arcana AI!',
          url: image
        });
      } else {
        await navigator.clipboard.writeText(image);
        toast.success("Link copiado para a área de transferência!");
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-8"
        >
          {/* Header Controls */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-10"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 mb-1">Arcana Studio Pro</span>
              <h3 className="text-white font-bold text-sm md:text-base">{title}</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setRotation(r => r + 90)}
                className="text-white hover:bg-white/10 rounded-full"
              >
                <RotateCw className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleShare}
                className="text-white hover:bg-white/10 rounded-full"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-white hover:bg-white/10 rounded-full bg-white/5"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </motion.div>

          {/* Main Viewer */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <motion.div
              drag={scale > 1}
              dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
              style={{ scale, rotate: rotation }}
              className="relative w-full h-full flex items-center justify-center pointer-events-auto"
            >
              <motion.img
                layoutId={`image-${image}`}
                src={image}
                alt="Full View"
                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              />
            </motion.div>
          </div>

          {/* Bottom Controls */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 p-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 z-10"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setScale(s => Math.max(1, s - 0.5))}
              className="text-white hover:bg-white/10 rounded-full"
            >
              <ZoomOut className="w-5 h-5" />
            </Button>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-white text-[10px] font-mono min-w-[3ch] text-center">
              {Math.round(scale * 100)}%
            </span>
            <div className="w-px h-4 bg-white/10" />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setScale(s => Math.min(4, s + 0.5))}
              className="text-white hover:bg-white/10 rounded-full"
            >
              <ZoomIn className="w-5 h-5" />
            </Button>
            <div className="w-px h-8 bg-white/10" />
            <Button 
              onClick={handleDownload}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 gap-2 font-bold shadow-lg shadow-primary/20"
            >
              <Download className="w-4 h-4" /> Download
            </Button>
          </motion.div>

          {/* Safari Safe Area Spacers */}
          <div className="h-[env(safe-area-inset-bottom)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
