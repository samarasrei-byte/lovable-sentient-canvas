import { Link, useLocation } from "react-router-dom";
import { Home, Users, Video, CreditCard, Sparkles } from "lucide-react";

const menuItems = [
  { path: "/app/dashboard", icon: Home, label: "Dashboard" },
  { path: "/app/talentos", icon: Users, label: "Talentos" },
  { path: "/app/liveshop", icon: Video, label: "Live Shop" },
  { path: "/app/consultoria", icon: Sparkles, label: "Consultoria IA" },
  { path: "/app/planos", icon: CreditCard, label: "Planos" },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-border/50 bg-card/30 backdrop-blur-sm p-6">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
        <span className="text-xl font-bold text-foreground">ARCANA</span>
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
