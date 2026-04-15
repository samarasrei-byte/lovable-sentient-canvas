import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="py-8 px-5 md:px-8 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary/60 to-secondary/60 flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-xs font-semibold text-foreground/50 tracking-tight">ARCANA</span>
        </Link>
        <div className="text-[10px] text-muted-foreground/30">
          © {new Date().getFullYear()} Arcana. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
