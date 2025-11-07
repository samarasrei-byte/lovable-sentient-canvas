import { Heart } from "lucide-react";

const links = [
  { label: "Sobre", href: "#" },
  { label: "Crie", href: "#" },
  { label: "Avatares", href: "#" },
  { label: "Marketplace", href: "#" },
  { label: "Contato", href: "#" },
];

export const Footer = () => {
  return (
    <footer className="relative py-16 px-6 overflow-hidden">
      {/* Liquid Black Background */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* CTA */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Join the Sensory Future
          </h3>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-8 mb-12">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-lg"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary animate-pulse" fill="currentColor" />
            <span>© 2067 LOVABLE</span>
          </div>
          
          <div className="text-center md:text-right">
            A division of Human Emotion Systems
          </div>
        </div>
      </div>
    </footer>
  );
};
