import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Home, 
  Image,
  Camera,
  Users, 
  Palette,
  Sparkles, 
  Video, 
  Settings, 
  Zap, 
  UserCircle,
  FolderOpen,
  Coins,
  Crown,
  Lock,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  path: string;
  icon: React.ElementType;
  label: string;
  badge?: string;
  proOnly?: boolean;
}

const userMenuItems: MenuItem[] = [
  { path: "/app/dashboard", icon: Home, label: "Home" },
  { path: "/app/minhas-fotos", icon: Image, label: "Minhas Fotos" },
  { path: "/app/minhas-compras", icon: Coins, label: "Minhas Compras" },
  { path: "/app/chamados", icon: MessageCircle, label: "Meus Chamados" },
  { path: "/app/perfil", icon: Settings, label: "Perfil" },
  { path: "/app/em-breve", icon: Sparkles, label: "Em breve", badge: "NOVO" },
];

const adminMenuItems: MenuItem[] = [
  { path: "/admin/dashboard", icon: Zap, label: "Admin Panel" },
  { path: "/admin/chamados", icon: MessageCircle, label: "Suporte (Admin)" },
  { path: "/admin/usuarios", icon: Users, label: "Usuários" },
];

export const SidebarArcana2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userPlan, setUserPlan] = useState<string>("basic");

  useEffect(() => {
    checkUserPlan();
  }, []);

  const checkUserPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      setUserPlan(subscription?.plan || "basic");
    } catch (error) {
      console.error("Error checking user plan:", error);
    }
  };

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

  const isPro = userPlan === "professional" || userPlan === "enterprise";

  return (
    <aside className="w-64 border-r border-border/30 bg-card/40 backdrop-blur-xl p-5 flex flex-col">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 mb-8 group px-2">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg opacity-40 group-hover:opacity-70 blur-sm transition-all duration-300" />
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center shadow-glow">
            <Zap className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-wide bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            ARCANA
          </span>
          <span className="text-[10px] text-muted-foreground -mt-0.5">Criação Visual com IA</span>
        </div>
      </Link>

      {/* Plan Badge */}
      <div className="px-2 mb-6">
        <div className={`p-3 rounded-xl ${isPro ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30' : 'bg-muted/50'}`}>
          <div className="flex items-center gap-2 mb-1">
            {isPro ? (
              <Crown className="w-4 h-4 text-primary" />
            ) : (
              <Sparkles className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">{isPro ? 'Plano PRO' : 'Plano Basic'}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{isPro ? '400' : '120'} créditos/mês</span>
            {!isPro && (
              <Link to="/app/planos" className="text-primary hover:underline">
                Upgrade
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {userMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isLocked = item.proOnly && !isPro;
          
          return (
            <Link
              key={item.path}
              to={isLocked ? "/app/planos" : item.path}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 shadow-lg shadow-primary/10"
                  : isLocked
                  ? "text-muted-foreground/50 hover:bg-muted/30 border border-transparent"
                  : "text-muted-foreground/80 hover:text-foreground hover:bg-accent/50 border border-transparent"
              }`}
            >
              {isLocked ? (
                <Lock className="w-4 h-4" />
              ) : (
                <item.icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`} />
              )}
              <span className="text-xs font-medium tracking-wide flex-1">{item.label}</span>
              {item.badge && (
                <Badge 
                  variant={isPro ? "default" : "outline"} 
                  className={`text-[10px] px-1.5 py-0 ${isPro ? 'bg-primary' : 'border-primary/50 text-primary'}`}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA */}
      {!isPro && (
        <div className="px-2 mb-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold">Upgrade para PRO</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Desbloqueie animações, mais créditos e recursos exclusivos.
            </p>
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-primary to-secondary"
              onClick={() => navigate("/app/planos")}
            >
              Ver planos
            </Button>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="pt-4 border-t border-border/30">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 px-3 py-2.5 text-muted-foreground/80 hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs font-medium tracking-wide">Sair</span>
        </Button>
      </div>
    </aside>
  );
};
