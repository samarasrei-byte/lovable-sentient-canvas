import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Home, 
  Users, 
  Video, 
  Sparkles, 
  Settings, 
  Zap, 
  Target, 
  FileText, 
  Wallet, 
  Activity, 
  UserCircle,
  MessageCircle,
  BarChart3,
  LogOut,
  Camera,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface MenuItem {
  path: string;
  icon: React.ElementType;
  label: string;
}

interface MenuGroup {
  label: string;
  icon: React.ElementType;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    label: "Principal",
    icon: Home,
    items: [
      { path: "/app/dashboard", icon: Home, label: "Dashboard" },
      { path: "/app/meus-produtos", icon: Camera, label: "Meus Produtos" },
    ]
  },
  {
    label: "Criação",
    icon: Sparkles,
    items: [
      { path: "/app/ai-studio", icon: Sparkles, label: "IA Studio" },
      { path: "/app/avatar-studio", icon: UserCircle, label: "Avatar Studio" },
      { path: "/app/liveshop", icon: Video, label: "Live Shop" },
    ]
  },
  {
    label: "Campanhas",
    icon: Target,
    items: [
      { path: "/app/talentos", icon: Users, label: "Talentos" },
      { path: "/app/campanhas", icon: Target, label: "Campanhas" },
      { path: "/app/analytics", icon: BarChart3, label: "Analytics" },
    ]
  },
  {
    label: "Negócios",
    icon: Wallet,
    items: [
      { path: "/app/contratos", icon: FileText, label: "Contratos" },
      { path: "/app/pagamentos", icon: Wallet, label: "Pagamentos" },
      { path: "/app/monitoramento", icon: Activity, label: "Monitoramento" },
    ]
  },
];

const bottomItems: MenuItem[] = [
  { path: "/app/chat", icon: MessageCircle, label: "Chat" },
  { path: "/app/perfil", icon: Settings, label: "Configurações" },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openGroups, setOpenGroups] = useState<string[]>(["Principal", "Criação"]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => 
      prev.includes(label) 
        ? prev.filter(g => g !== label)
        : [...prev, label]
    );
  };

  const isPathActive = (path: string) => location.pathname === path;
  
  const isGroupActive = (group: MenuGroup) => 
    group.items.some(item => isPathActive(item.path));

  // Auto-expand group containing active item
  useEffect(() => {
    menuGroups.forEach(group => {
      if (isGroupActive(group) && !openGroups.includes(group.label)) {
        setOpenGroups(prev => [...prev, group.label]);
      }
    });
  }, [location.pathname]);

  return (
    <aside className="w-56 border-r border-border/20 bg-card/30 backdrop-blur-xl flex flex-col">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 p-5 pb-4 group">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg opacity-30 group-hover:opacity-60 blur-sm transition-all" />
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
        </div>
        <span className="text-base font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          ARCANA
        </span>
      </Link>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuGroups.map((group) => {
          const isOpen = openGroups.includes(group.label);
          const groupActive = isGroupActive(group);
          
          return (
            <Collapsible
              key={group.label}
              open={isOpen}
              onOpenChange={() => toggleGroup(group.label)}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                    groupActive 
                      ? "text-primary bg-primary/5" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <group.icon className="w-4 h-4" />
                    <span>{group.label}</span>
                  </div>
                  <ChevronDown 
                    className={cn(
                      "w-3 h-3 transition-transform duration-200",
                      isOpen && "rotate-180"
                    )} 
                  />
                </button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="pt-1 pl-4 space-y-0.5">
                {group.items.map((item) => {
                  const isActive = isPathActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground/80 hover:text-foreground hover:bg-accent/30"
                      )}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        })}

        {/* Divider */}
        <div className="h-px bg-border/30 my-3" />

        {/* Bottom Items */}
        {bottomItems.map((item) => {
          const isActive = isPathActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground/80 hover:text-foreground hover:bg-accent/30"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 h-9 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
};
