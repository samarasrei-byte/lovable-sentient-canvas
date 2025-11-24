import { Link, useLocation } from "react-router-dom";
import { Home, Users, Video, CreditCard, Sparkles, Settings, Zap, Target, FileText, Wallet, Activity, Brain } from "lucide-react";

const menuItems = [
  { path: "/app/dashboard", icon: Home, label: "Dashboard" },
  { path: "/app/talentos", icon: Users, label: "Talentos" },
  { path: "/app/campanhas", icon: Target, label: "Campanhas" },
  { path: "/app/contratos", icon: FileText, label: "Contratos" },
  { path: "/app/pagamentos", icon: Wallet, label: "Pagamentos" },
  { path: "/app/monitoramento", icon: Activity, label: "Monitoramento" },
  { path: "/app/ia-insights", icon: Brain, label: "IA Insights" },
  { path: "/app/liveshop", icon: Video, label: "Live Shop" },
  { path: "/app/consultoria", icon: Sparkles, label: "Consultoria IA" },
  { path: "/app/planos", icon: CreditCard, label: "Planos" },
  { path: "/app/perfil", icon: Settings, label: "Perfil" },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-border/50 bg-card/30 backdrop-blur-sm p-6">
      <Link to="/" className="flex items-center gap-2 mb-8 group">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg opacity-30 group-hover:opacity-50 blur transition duration-300" />
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
          ARCANA
        </span>
      </Link>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
