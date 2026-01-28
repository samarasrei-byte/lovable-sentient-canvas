import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const TrustedBrands = () => {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/15 to-transparent" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto relative z-10 text-center"
      >
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Marcas que confiam</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
          Empoderamos marcas que acreditam na{" "}
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            nova economia criativa
          </span>
        </h2>
        
        <p className="text-muted-foreground text-lg font-light max-w-2xl mx-auto">
          Junte-se às marcas que estão moldando o futuro da conexão entre tecnologia e humanidade.
        </p>
      </motion.div>
    </section>
  );
};
