import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import { ArcanaLogo } from "@/components/ArcanaLogo";
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
    <header className="sticky top-0 z-40 lg:hidden">
      <div className="bg-card/95 backdrop-blur-xl border-b border-border/50 safe-area-top overflow-hidden">
        <div className="flex items-center justify-between h-14 px-4 md:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <Link to="/app/dashboard" className="flex-shrink-0">
              <ArcanaLogo iconSize={18} textSize="text-base" />
            </Link>
            <motion.h1 
              key={location.pathname}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-semibold text-foreground truncate text-sm"
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
