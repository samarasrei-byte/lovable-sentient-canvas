import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Megaphone, 
  DollarSign, 
  Settings, 
  Shield, 
  FileText,
  Zap,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const adminMenuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Influenciadores", url: "/admin/influencers", icon: Users },
  { title: "Marcas", url: "/admin/brands", icon: Building2 },
  { title: "Campanhas", url: "/admin/campaigns", icon: Megaphone },
  { title: "Financeiro", url: "/admin/financial", icon: DollarSign },
  { title: "Suporte", url: "/admin/support", icon: Shield },
  { title: "Logs", url: "/admin/logs", icon: FileText },
  { title: "Configurações", url: "/admin/settings", icon: Settings },
];

export const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`
      ${collapsed ? 'w-20' : 'w-64'} 
      bg-card border-r border-border 
      transition-all duration-300 
      flex flex-col
      relative
    `}>
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-primary/20 rounded-lg blur" />
            <div className="relative bg-primary/10 p-2 rounded-lg border border-primary/30">
              <Zap className="w-6 h-6 text-accent animate-pulse" />
            </div>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                ARCANA
              </h1>
              <p className="text-xs text-muted-foreground">Oracle Admin</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 bg-card border border-border rounded-full z-10"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {adminMenuItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.end}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            activeClassName="bg-primary/10 text-primary font-semibold border border-primary/20"
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className={`
          ${collapsed ? 'justify-center' : ''} 
          flex items-center gap-3 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20
        `}>
          <Shield className="h-5 w-5 text-accent flex-shrink-0" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-accent">Super Admin</p>
              <p className="text-xs text-muted-foreground truncate">Master Access</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
