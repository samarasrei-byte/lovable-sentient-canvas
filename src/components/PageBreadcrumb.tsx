import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

const routeLabels: Record<string, string> = {
  "dashboard": "Dashboard",
  "talentos": "Talentos",
  "campanhas": "Campanhas",
  "contratos": "Contratos",
  "pagamentos": "Pagamentos",
  "monitoramento": "Monitoramento",
  "ia-insights": "IA Insights",
  "avatar-studio": "Avatar Studio",
  "liveshop": "Live Shop",
  "consultoria": "Consultoria IA",
  "chat": "Chat",
  "planos": "Planos",
  "perfil": "Perfil",
  "analytics": "Analytics",
  "influencer": "Influencer",
};

export function PageBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="px-6 py-4 border-b border-border/30 bg-card/20 backdrop-blur-sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/app/dashboard" className="flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" />
                <span>Início</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathnames.map((pathname, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const label = routeLabels[pathname] || pathname;

            return (
              <div key={pathname} className="flex items-center gap-1.5">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="font-medium">{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={routeTo}>{label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
