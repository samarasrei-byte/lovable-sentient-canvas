import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative py-8 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Heart className="w-4 h-4 text-primary" fill="currentColor" />
          <span className="text-muted-foreground">
            © 2025 ARCANA
          </span>
        </div>
      </div>
    </footer>
  );
};
