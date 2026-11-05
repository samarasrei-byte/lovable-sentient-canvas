import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutTemplate, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchTemplates } from "@/lib/batch-api";

export default function TemplatesGallery() {
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["video-templates"],
    queryFn: fetchTemplates,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Modelos de vídeo de marketing usados na Produção em Lote.
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-primary to-secondary">
          <Link to="/app/producao-em-lote/nova">
            Usar em produção
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {templates.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {template.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {template.duration_seconds}s · 9:16
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{template.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {template.description}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
