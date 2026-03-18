import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative py-12 px-6 overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground">ARCANA</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© 2025 Arcana</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
