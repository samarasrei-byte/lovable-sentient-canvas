import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import arcanaLogo from "@/assets/arcana-logo-cropped.png";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
}

export const MobileHeader = ({ title, showBack }: MobileHeaderProps) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Get page title based on route
  const getPageTitle = () => {
    if (title) return title;
    
    const routes: Record<string, string> = {
      "/app/dashboard": "Dashboard",
      "/app/ai-studio": "Criar com IA",
      "/app/talentos": "Talentos",
      "/app/analytics": "Analytics",
      "/app/perfil": "Perfil",
      "/app/campanhas": "Campanhas",
      "/app/contratos": "Contratos",
      "/app/pagamentos": "Pagamentos",
    };

    return routes[location.pathname] || "ARCANA";
  };

  return (
    <header className="sticky top-0 z-40 md:hidden">
      <div className="bg-card/95 backdrop-blur-xl border-b border-border/50 safe-area-top">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Link to="/app/dashboard" className="flex items-center gap-2">
              <img src={arcanaLogo} alt="ARCANA" className="h-8 w-auto object-contain" />
            </Link>
            <motion.h1 
              key={location.pathname}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-semibold text-foreground"
            >
              {getPageTitle()}
            </motion.h1>
          </div>

          <div className="flex items-center gap-1">
            <NotificationsDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};
