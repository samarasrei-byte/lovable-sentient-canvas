import React from 'react';
import { motion } from 'framer-motion';
import { Upload, ImageIcon, Sparkles, ShieldCheck, Info, Camera, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PremiumUploadAreaProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  image: string | null;
  type: 'product' | 'logo';
  onRemove: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const PremiumUploadArea = ({ onUpload, image, type, onRemove, inputRef }: PremiumUploadAreaProps) => {
  const isProduct = type === 'product';

  return (
    <div className="relative group">
      {/* Animated background glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${isProduct ? 'from-primary/20 via-secondary/20 to-primary/20' : 'from-secondary/20 via-primary/20 to-secondary/20'} rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000`} />
      
      <div 
        className={`relative overflow-hidden transition-all duration-700 border-2 border-dashed rounded-[2rem] bg-card/40 backdrop-blur-xl ${
          image 
            ? isProduct ? 'border-primary/50' : 'border-secondary/50' 
            : 'border-muted-foreground/20 hover:border-primary/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onUpload}
          className="hidden"
        />

        <div className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[420px]">
          {image ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center"
            >
              <div className="relative w-full aspect-square max-w-[280px] rounded-3xl overflow-hidden bg-background/50 shadow-2xl mb-8 group/preview">
                <img src={image} alt="Upload Preview" className="w-full h-full object-contain" />
                <div 
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-all duration-500 flex items-center justify-center cursor-pointer"
                  onClick={() => inputRef.current?.click()}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm shadow-xl"
                  >
                    Trocar Imagem
                  </motion.div>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <Badge className={`px-4 py-1.5 rounded-full gap-2 border-none ${isProduct ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Ativo validado pelo motor</span>
                </Badge>
                
                <button 
                  onClick={onRemove}
                  className="text-muted-foreground hover:text-destructive transition-colors text-xs font-medium uppercase tracking-widest flex items-center gap-2"
                >
                  Remover Ativo
                </button>
              </div>
            </motion.div>
          ) : (
            <div 
              className="flex flex-col items-center text-center cursor-pointer"
              onClick={() => inputRef.current?.click()}
            >
              {/* Central Icon with HUD effect */}
              <div className="relative mb-8">
                <motion.div 
                  animate={{ 
                    rotate: [0, 360],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 border border-primary/20 rounded-full border-dashed"
                />
                <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center ${isProduct ? 'bg-primary/10 shadow-[0_0_30px_-10px_hsl(var(--primary)/0.3)]' : 'bg-secondary/10 shadow-[0_0_30px_-10px_hsl(var(--secondary)/0.3)]'}`}>
                  {isProduct ? <Camera className="w-10 h-10 text-primary" /> : <Sparkles className="w-10 h-10 text-secondary" />}
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-black mb-3 tracking-tighter uppercase italic">
                {isProduct ? 'Upload do Produto' : 'Logo da Marca'}
              </h3>
              
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-8">
                {isProduct 
                  ? 'Capture a essência do seu item. Recomendamos fundo neutro e iluminação natural.'
                  : 'Sua identidade visual aplicada automaticamente em todas as composições.'}
              </p>

              {isProduct && (
                <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-8">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                    <Lightbulb className="w-3 h-3 text-yellow-500" />
                    Luz Suave
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                    <ImageIcon className="w-3 h-3 text-blue-500" />
                    Fundo Limpo
                  </div>
                </div>
              )}

              <Badge variant="outline" className={`rounded-full px-8 py-2 border-primary/20 ${isProduct ? 'bg-primary/5 text-primary shadow-lg shadow-primary/5' : 'bg-secondary/5 text-secondary shadow-lg shadow-secondary/5'}`}>
                {isProduct ? 'Inicie aqui' : 'Opcional'}
              </Badge>
            </div>
          )}
        </div>

        {/* Floating guidance for product */}
        {isProduct && !image && (
          <div className="absolute top-6 right-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                    <Info className="w-4 h-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-black/90 text-white border-primary/20 p-4 max-w-xs rounded-2xl">
                  <p className="font-bold mb-1">Dica de Especialista:</p>
                  <p className="text-xs text-muted-foreground">Coloque sua melhor foto, com boa iluminação, de frente e com qualidade alta para ter o melhor resultado final.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
};
