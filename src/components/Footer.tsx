import { Link } from "react-router-dom";
import arcanaLogo from "@/assets/arcana-logo-cropped.png";

export const Footer = () => {
  return (
    <footer className="py-8 px-5 md:px-8 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={arcanaLogo} alt="ARCANA" className="h-6 w-auto object-contain" />
        </Link>
        <div className="text-[10px] text-muted-foreground/30">
          © {new Date().getFullYear()} Arcana. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
