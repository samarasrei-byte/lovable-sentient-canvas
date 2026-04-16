import { Link } from "react-router-dom";
import { ArcanaLogo } from "@/components/ArcanaLogo";

export const Footer = () => {
  return (
    <footer className="py-8 px-5 md:px-8 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <ArcanaLogo iconSize={14} textSize="text-sm" />
        </Link>
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground/50">
          <Link to="/termos" className="hover:text-muted-foreground transition-colors">
            Termos de Uso
          </Link>
          <span>•</span>
          <Link to="/privacidade" className="hover:text-muted-foreground transition-colors">
            Política de Privacidade
          </Link>
        </div>
        <div className="text-[10px] text-muted-foreground/30">
          © {new Date().getFullYear()} Arcana. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
