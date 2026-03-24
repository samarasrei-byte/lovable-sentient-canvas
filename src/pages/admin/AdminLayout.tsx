import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { LogOut, Bell, Search, Command } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const routeTitles: Record<string, { title: string; description: string }> = {
  "/admin": { title: "Dashboard", description: "Visão geral da plataforma" },
  "/admin/users": { title: "Usuários", description: "Gerenciar contas e permissões" },
  "/admin/prompts": { title: "Prompts", description: "Gerenciar prompts do marketplace" },
  "/admin/plans": { title: "Assinaturas", description: "Planos e configurações de preços" },
  "/admin/financial-dashboard": { title: "Financeiro", description: "Receitas, pagamentos e saques" },
  "/admin/support": { title: "Suporte", description: "Tickets e atendimento" },
  "/admin/logs": { title: "Logs", description: "Registro de atividades do sistema" },
  "/admin/settings": { title: "Configurações", description: "Preferências da plataforma" },
};

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const currentRoute = routeTitles[location.pathname] || { title: "Admin", description: "" };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logout realizado", description: "Até logo!" });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b border-border/40 bg-card/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground leading-tight">{currentRoute.title}</h2>
              <p className="text-[11px] text-muted-foreground">{currentRoute.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input 
                placeholder="Buscar..." 
                className="h-8 w-48 pl-8 pr-8 text-xs bg-muted/40 border-border/30 focus:w-64 transition-all"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-muted-foreground/60 bg-muted/60 px-1.5 py-0.5 rounded font-mono">
                ⌘K
              </kbd>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="h-8 w-8 relative">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>

            {/* Logout */}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 text-xs text-muted-foreground hover:text-foreground">
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Sair
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
