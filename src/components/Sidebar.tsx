import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Home, 
  Users, 
  Video, 
  CreditCard, 
  Sparkles, 
  Settings, 
  Zap, 
  Target, 
  FileText, 
  Wallet, 
  Activity, 
  Brain, 
  UserCircle,
  MessageCircle
} from "lucide-react";

const brandMenuItems = [
  { path: "/app/dashboard", icon: Home, label: "Dashboard" },
  { path: "/app/talentos", icon: Users, label: "Talentos" },
  { path: "/app/campanhas", icon: Target, label: "Campanhas" },
  { path: "/app/contratos", icon: FileText, label: "Contratos" },
  { path: "/app/pagamentos", icon: Wallet, label: "Pagamentos" },
  { path: "/app/monitoramento", icon: Activity, label: "Monitoramento" },
  { path: "/app/ia-insights", icon: Brain, label: "IA Insights" },
  { path: "/app/avatar-studio", icon: UserCircle, label: "Avatar Studio" },
  { path: "/app/liveshop", icon: Video, label: "Live Shop" },
  { path: "/app/consultoria", icon: Sparkles, label: "Consultoria IA" },
  { path: "/app/chat", icon: MessageCircle, label: "Chat" },
  { path: "/app/planos", icon: CreditCard, label: "Planos" },
  { path: "/app/perfil", icon: Settings, label: "Perfil" },
];

const influencerMenuItems = [
  { path: "/app/dashboard", icon: Home, label: "Dashboard" },
  { path: "/app/influencer/analytics", icon: Brain, label: "Analytics" },
  { path: "/app/influencer/contratos", icon: FileText, label: "Contratos" },
  { path: "/app/influencer/pagamentos", icon: Wallet, label: "Pagamentos" },
  { path: "/app/influencer/monitoramento", icon: Activity, label: "Monitoramento" },
  { path: "/app/avatar-studio", icon: UserCircle, label: "Avatar Studio" },
  { path: "/app/consultoria", icon: Sparkles, label: "Consultoria IA" },
  { path: "/app/chat", icon: MessageCircle, label: "Chat" },
  { path: "/app/perfil", icon: Settings, label: "Perfil" },
];

export const Sidebar = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState<string>("brand");

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      setUserRole(roleData?.role || "brand");
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  };

  const menuItems = userRole === "influencer" ? influencerMenuItems : brandMenuItems;

  return (
    <aside className="w-60 border-r border-border/30 bg-card/40 backdrop-blur-xl p-5">
      <Link to="/" className="flex items-center gap-2.5 mb-10 group px-2">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg opacity-40 group-hover:opacity-70 blur-sm transition-all duration-300" />
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center shadow-glow">
            <Zap className="w-5 h-5 text-white" />
          </div>
        </div>
        <span className="text-lg font-bold tracking-wide bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
          ARCANA
        </span>
      </Link>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 shadow-lg shadow-primary/10"
                  : "text-muted-foreground/80 hover:text-foreground hover:bg-accent/50 border border-transparent"
              }`}
            >
              <item.icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`} />
              <span className="text-xs font-medium tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
