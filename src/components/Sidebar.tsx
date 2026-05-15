import { memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
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
  LogOut,
  MessageCircle,
  ShoppingBag,
  CreditCard
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
  { path: "/app/minhas-compras", icon: CreditCard, label: "Minhas Compras" },
  { path: "/app/chamados", icon: MessageCircle, label: "Meus Chamados" },
  { path: "/app/perfil", icon: Settings, label: "Perfil" },
  { path: "/app/em-breve", icon: Sparkles, label: "Em breve", badge: "NOVO" },
];

const adminMenuItems: MenuItem[] = [
  { path: "/admin", icon: Zap, label: "Admin Panel" },
  { path: "/admin/support", icon: MessageCircle, label: "Suporte (Admin)" },
  { path: "/admin/users", icon: Users, label: "Usuários" },
];

export const Sidebar = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, isAdmin, isPro, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <aside className="hidden md:flex w-64 border-r border-border/30 bg-card/40 backdrop-blur-xl p-5 flex-col min-h-screen">
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
          <span className="text-[10px] text-muted-foreground -mt-0.5">Premium AI Visuals</span>
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
            <span>{isPro ? 'Ilimitado' : '6 fotos/mês'}</span>
            {!isPro && (
              <Link to="/app/planos" className="text-primary hover:underline font-bold">
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
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/10"
                  : "text-muted-foreground/80 hover:text-foreground hover:bg-accent/50 border border-transparent"
              }`}
            >
              <item.icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`} />
              <span className="text-xs font-medium tracking-wide flex-1">{item.label}</span>
              {item.badge && (
                <Badge 
                  variant={isPro ? "default" : "outline"} 
                  className={`text-[8px] px-1.5 py-0 ${isPro ? 'bg-primary' : 'border-primary/50 text-primary'}`}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}

        {/* Admin Menu */}
        {isAdmin && (
          <div className="mt-8 space-y-1">
            <div className="px-3 mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Admin</span>
            </div>
            {adminMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-secondary/10 text-secondary border border-secondary/20 shadow-lg shadow-secondary/10"
                      : "text-muted-foreground/80 hover:text-foreground hover:bg-accent/50 border border-transparent"
                  }`}
                >
                  <item.icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`} />
                  <span className="text-xs font-medium tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Upgrade CTA */}
      {!isPro && (
        <div className="px-2 mb-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold">Assinar Pro</span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-3">
              Gerações em HD, mais créditos e suporte prioritário.
            </p>
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-primary to-secondary text-xs h-8"
              onClick={() => navigate("/app/planos")}
            >
              Ver Planos
            </Button>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="pt-4 border-t border-border/30">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 px-3 py-2 text-muted-foreground/80 hover:text-destructive hover:bg-destructive/10 h-9"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs font-medium tracking-wide">Sair</span>
        </Button>
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";
