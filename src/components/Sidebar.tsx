import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArcanaLogo } from "@/components/ArcanaLogo";
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Palette,
  Lock,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MenuItem {
  path: string;
  icon: React.ElementType;
  label: string;
  comingSoon?: boolean;
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
      { path: "/app/prompt-dashboard", icon: ShoppingBag, label: "Prompt Marketplace" },
      { path: "/app/meus-produtos", icon: Camera, label: "Minhas Criações" },
      { path: "/app/ai-studio", icon: Sparkles, label: "IA Studio" },
      { path: "/app/planos", icon: Wallet, label: "Assinatura" },
    ]
  },
  {
    label: "Em Breve",
    icon: Zap,
    items: [
      { path: "/app/talentos", icon: Users, label: "Talentos", comingSoon: true },
      { path: "/app/liveshop", icon: Video, label: "Live Shop", comingSoon: true },
      { path: "/app/avatar-studio", icon: UserCircle, label: "Avatar Studio", comingSoon: true },
      { path: "/app/campanhas", icon: Target, label: "Campanhas", comingSoon: true },
      { path: "/app/contratos", icon: FileText, label: "Contratos", comingSoon: true },
      { path: "/app/pagamentos", icon: Wallet, label: "Pagamentos", comingSoon: true },
      { path: "/app/monitoramento", icon: Activity, label: "Monitoramento", comingSoon: true },
      { path: "/app/chat", icon: MessageCircle, label: "Chat", comingSoon: true },
    ]
  },
];

const bottomItems: MenuItem[] = [
  { path: "/app/perfil", icon: Settings, label: "Configurações" },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(["Principal"]);

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
    if (isCollapsed) return;
    setOpenGroups(prev => 
      prev.includes(label) 
        ? prev.filter(g => g !== label)
        : [...prev, label]
    );
  };

  const isPathActive = (path: string) => location.pathname === path;
  
  const isGroupActive = (group: MenuGroup) => 
    group.items.some(item => isPathActive(item.path));

  useEffect(() => {
    if (isCollapsed) return;
    menuGroups.forEach(group => {
      if (isGroupActive(group) && !openGroups.includes(group.label)) {
        setOpenGroups(prev => [...prev, group.label]);
      }
    });
  }, [location.pathname, isCollapsed]);

  const IconWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn(
      "transition-all duration-200 group-hover:scale-110",
      className
    )}>
      {children}
    </div>
  );

  const CollapsedMenuItem = ({ item, isActive }: { item: MenuItem; isActive: boolean }) => (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        {item.comingSoon ? (
          <div
            className="group flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 text-muted-foreground/30 cursor-not-allowed relative"
          >
            <IconWrapper>
              <item.icon className="w-5 h-5" />
            </IconWrapper>
          </div>
        ) : (
          <Link
            to={item.path}
            className={cn(
              "group flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200",
              isActive
                ? "bg-primary/15 text-primary shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <IconWrapper>
              <item.icon className="w-5 h-5" />
            </IconWrapper>
          </Link>
        )}
      </TooltipTrigger>
      <TooltipContent side="right" className="font-medium">
        {item.label} {item.comingSoon && "· Em breve"}
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <aside 
        className={cn(
          "border-r border-border/20 bg-card/30 backdrop-blur-xl flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[72px]" : "w-56"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center p-4 pb-3",
          isCollapsed ? "justify-center" : "gap-2"
        )}>
          <Link to="/" className="group flex items-center gap-2">
            <ArcanaLogo iconSize={18} textSize="text-base" showText={!isCollapsed} />
          </Link>
        </div>

        {/* Collapse Toggle */}
        <div className={cn("px-3 mb-2", isCollapsed && "px-2")}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "h-8 text-muted-foreground hover:text-foreground transition-all",
              isCollapsed ? "w-full justify-center px-0" : "w-full justify-between px-2"
            )}
          >
            {!isCollapsed && <span className="text-xs">Recolher</span>}
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation Groups */}
        <nav className={cn(
          "flex-1 space-y-1 overflow-y-auto",
          isCollapsed ? "px-2" : "px-3"
        )}>
          {isCollapsed ? (
            <div className="space-y-2">
              {menuGroups.map((group) => (
                <div key={group.label} className="space-y-1">
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "flex items-center justify-center w-10 h-8 rounded-lg text-xs font-medium",
                        isGroupActive(group) ? "text-primary" : "text-muted-foreground/60"
                      )}>
                        <group.icon className="w-4 h-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {group.label}
                    </TooltipContent>
                  </Tooltip>
                  {group.items.map((item) => (
                    <CollapsedMenuItem 
                      key={item.path} 
                      item={item} 
                      isActive={isPathActive(item.path)} 
                    />
                  ))}
                </div>
              ))}

              <div className="h-px bg-border/30 my-3" />

              {bottomItems.map((item) => (
                <CollapsedMenuItem 
                  key={item.path} 
                  item={item} 
                  isActive={isPathActive(item.path)} 
                />
              ))}
            </div>
          ) : (
            <>
              {menuGroups.map((group) => {
                const isOpen = openGroups.includes(group.label);
                const groupActive = isGroupActive(group);
                const isComingSoonGroup = group.items.every(i => i.comingSoon);
                
                return (
                  <Collapsible
                    key={group.label}
                    open={isOpen}
                    onOpenChange={() => toggleGroup(group.label)}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        className={cn(
                          "group w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                          groupActive 
                            ? "text-primary bg-primary/5" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <IconWrapper>
                            <group.icon className="w-4 h-4" />
                          </IconWrapper>
                          <span>{group.label}</span>
                          {isComingSoonGroup && (
                            <Badge className="text-[8px] px-1.5 py-0 h-4 bg-muted/50 text-muted-foreground border-border/30 font-normal">
                              Em breve
                            </Badge>
                          )}
                        </div>
                        <ChevronDown 
                          className={cn(
                            "w-3 h-3 transition-transform duration-200",
                            isOpen && "rotate-180"
                          )} 
                        />
                      </button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="pt-1 pl-4 space-y-0.5 animate-accordion-down">
                      {group.items.map((item) => {
                        const isActive = isPathActive(item.path);
                        
                        if (item.comingSoon) {
                          return (
                            <div
                              key={item.path}
                              className="group flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground/40 cursor-not-allowed select-none"
                            >
                              <IconWrapper>
                                <item.icon className="w-3.5 h-3.5" />
                              </IconWrapper>
                              <span>{item.label}</span>
                              <Lock className="w-2.5 h-2.5 ml-auto opacity-40" />
                            </div>
                          );
                        }
                        
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                              "group flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-200",
                              isActive
                                ? "bg-primary/10 text-primary font-medium shadow-sm"
                                : "text-muted-foreground/80 hover:text-foreground hover:bg-accent/30"
                            )}
                          >
                            <IconWrapper>
                              <item.icon className="w-3.5 h-3.5" />
                            </IconWrapper>
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}

              <div className="h-px bg-border/30 my-3" />

              {bottomItems.map((item) => {
                const isActive = isPathActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "group flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground/80 hover:text-foreground hover:bg-accent/30"
                    )}
                  >
                    <IconWrapper>
                      <item.icon className="w-4 h-4" />
                    </IconWrapper>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Logout */}
        <div className={cn(
          "border-t border-border/20",
          isCollapsed ? "p-2" : "p-3"
        )}>
          {isCollapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="w-10 h-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Sair
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-2 h-9 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 group"
            >
              <IconWrapper>
                <LogOut className="w-4 h-4" />
              </IconWrapper>
              Sair
            </Button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};
