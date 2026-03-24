import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Settings, 
  Shield, 
  FileText,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BarChart3,
  UserCog,
  LifeBuoy,
  Bell,
  Home
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mainMenuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Usuários", url: "/admin/users", icon: UserCog },
  { title: "Prompts", url: "/admin/prompts", icon: Sparkles },
  { title: "Assinaturas", url: "/admin/plans", icon: DollarSign },
  { title: "Financeiro", url: "/admin/financial-dashboard", icon: BarChart3 },
];

const systemMenuItems = [
  { title: "Suporte", url: "/admin/support", icon: LifeBuoy },
  { title: "Logs", url: "/admin/logs", icon: FileText },
  { title: "Configurações", url: "/admin/settings", icon: Settings },
];

export const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <aside className={`
      ${collapsed ? 'w-[72px]' : 'w-[260px]'} 
      bg-card/80 backdrop-blur-xl border-r border-border/50
      transition-all duration-300 ease-in-out
      flex flex-col
      relative
      min-h-screen
    `}>
      {/* Logo */}
      <div className={`${collapsed ? 'px-3' : 'px-5'} py-5 border-b border-border/30`}>
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 to-accent/30 rounded-xl blur-sm" />
            <div className="relative bg-gradient-to-br from-primary/10 to-accent/5 p-2.5 rounded-xl border border-primary/20">
              <Zap className="w-5 h-5 text-primary" />
            </div>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ARCANA
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-3 top-[68px] h-6 w-6 bg-card border-border/50 rounded-full z-10 shadow-sm hover:bg-muted"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-6 overflow-y-auto">
        {/* Main */}
        <div className={`${collapsed ? 'px-2' : 'px-3'} space-y-1`}>
          {!collapsed && (
            <p className="text-[10px] font-semibold text-muted-foreground/70 px-3 mb-2 tracking-widest uppercase">
              Gerenciamento
            </p>
          )}
          {mainMenuItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.end}
              className={`
                flex items-center gap-3 
                ${collapsed ? 'justify-center px-2' : 'px-3'} 
                py-2.5 rounded-lg 
                text-muted-foreground text-sm font-medium
                hover:text-foreground hover:bg-muted/60
                transition-all duration-150
              `}
              activeClassName="bg-primary/10 text-primary border border-primary/15 shadow-sm"
            >
              <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
        </div>

        {/* System */}
        <div className={`${collapsed ? 'px-2' : 'px-3'} space-y-1`}>
          {!collapsed && (
            <>
              <div className="mx-3 mb-3 border-t border-border/30" />
              <p className="text-[10px] font-semibold text-muted-foreground/70 px-3 mb-2 tracking-widest uppercase">
                Sistema
              </p>
            </>
          )}
          {collapsed && <div className="mx-1 mb-2 border-t border-border/30" />}
          {systemMenuItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              className={`
                flex items-center gap-3 
                ${collapsed ? 'justify-center px-2' : 'px-3'} 
                py-2.5 rounded-lg 
                text-muted-foreground text-sm font-medium
                hover:text-foreground hover:bg-muted/60
                transition-all duration-150
              `}
              activeClassName="bg-accent/10 text-accent border border-accent/15 shadow-sm"
            >
              <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Back to site */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-muted/60 transition-all duration-150 w-full"
          >
            <Home className="h-[18px] w-[18px] flex-shrink-0" />
            <span>Voltar ao site</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <div className={`${collapsed ? 'px-2' : 'px-3'} pb-4 pt-2 border-t border-border/30`}>
        <div className={`
          ${collapsed ? 'justify-center p-2' : 'px-3 py-2.5'} 
          flex items-center gap-3 rounded-lg 
          bg-gradient-to-r from-primary/5 to-accent/5
          border border-primary/10
        `}>
          <div className="relative flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-card" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">Super Admin</p>
              <p className="text-[10px] text-muted-foreground truncate">admin@arcana.com.br</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
