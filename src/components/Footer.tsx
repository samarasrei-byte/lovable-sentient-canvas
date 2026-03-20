import { Zap } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative py-10 px-4 sm:px-6 overflow-hidden border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary/50" />
            <span className="text-sm font-semibold text-foreground/70">ARCANA</span>
          </div>
          <div className="text-xs text-muted-foreground/40">
            © 2025 Arcana. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};
