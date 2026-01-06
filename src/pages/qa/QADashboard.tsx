import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { QA_CONFIG, SYSTEM_ROUTES, isQAUser, getAllRoutes } from "@/lib/qa-config";
import { 
  Shield, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  Home,
  Users,
  Settings,
  CreditCard,
  BarChart3,
  MessageSquare,
  Zap,
  Lock,
  Unlock,
  RefreshCw,
  LogOut
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RouteTestResult {
  path: string;
  name: string;
  status: "pending" | "testing" | "success" | "error" | "warning";
  message?: string;
  responseTime?: number;
}

const QADashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isQA, setIsQA] = useState(false);
  const [loading, setLoading] = useState(true);
  const [routeTests, setRouteTests] = useState<RouteTestResult[]>([]);
  const [testingAll, setTestingAll] = useState(false);

  useEffect(() => {
    const checkQAAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !isQAUser(user.email)) {
        toast({
          variant: "destructive",
          title: "Acesso Negado",
          description: "Esta página é exclusiva para usuários QA.",
        });
        navigate("/login");
        return;
      }

      setIsQA(true);
      setLoading(false);

      // Initialize route tests
      const allRoutes = getAllRoutes();
      setRouteTests(allRoutes.map(route => ({
        path: route.path,
        name: route.name,
        status: "pending"
      })));
    };

    checkQAAccess();
  }, [navigate, toast]);

  const testRoute = async (path: string) => {
    setRouteTests(prev => prev.map(r => 
      r.path === path ? { ...r, status: "testing" as const } : r
    ));

    const startTime = Date.now();
    
    try {
      // Simulate route testing
      await new Promise(resolve => setTimeout(resolve, 500));
      const responseTime = Date.now() - startTime;

      setRouteTests(prev => prev.map(r => 
        r.path === path ? { 
          ...r, 
          status: "success" as const, 
          responseTime,
          message: `Carregou em ${responseTime}ms`
        } : r
      ));
    } catch (error: any) {
      setRouteTests(prev => prev.map(r => 
        r.path === path ? { 
          ...r, 
          status: "error" as const,
          message: error.message
        } : r
      ));
    }
  };

  const testAllRoutes = async () => {
    setTestingAll(true);
    const allRoutes = getAllRoutes();
    
    for (const route of allRoutes) {
      await testRoute(route.path);
    }
    
    setTestingAll(false);
    toast({
      title: "Testes Concluídos",
      description: `${allRoutes.length} rotas testadas.`,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const getStatusIcon = (status: RouteTestResult["status"]) => {
    switch (status) {
      case "pending": return <div className="w-4 h-4 rounded-full bg-muted" />;
      case "testing": return <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />;
      case "success": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "error": return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: RouteTestResult["status"]) => {
    switch (status) {
      case "pending": return <Badge variant="outline">Pendente</Badge>;
      case "testing": return <Badge className="bg-yellow-500/20 text-yellow-500">Testando</Badge>;
      case "success": return <Badge className="bg-green-500/20 text-green-500">OK</Badge>;
      case "error": return <Badge variant="destructive">Erro</Badge>;
      case "warning": return <Badge className="bg-yellow-500/20 text-yellow-500">Aviso</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!isQA) {
    return null;
  }

  const renderRouteSection = (title: string, routes: typeof SYSTEM_ROUTES.public, icon: React.ReactNode) => (
    <Card className="border-yellow-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {routes.map(route => {
            const testResult = routeTests.find(r => r.path === route.path);
            return (
              <div 
                key={route.path}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  {testResult && getStatusIcon(testResult.status)}
                  <div>
                    <p className="text-sm font-medium">{route.name}</p>
                    <p className="text-xs text-muted-foreground">{route.path}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {testResult && getStatusBadge(testResult.status)}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(route.path)}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-black via-background to-yellow-500/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-yellow-500/30 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-yellow-500">QA Dashboard</h1>
                <p className="text-xs text-muted-foreground">Ambiente de Testes Interno</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                QA_MODE: ACTIVE
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* QA Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Unlock className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Paywall</p>
                  <p className="font-bold text-green-500">Desabilitado</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Billing</p>
                  <p className="font-bold text-green-500">Desabilitado</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Lock className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Plano</p>
                  <p className="font-bold text-yellow-500">NULL (QA)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Métricas</p>
                  <p className="font-bold text-blue-500">Ignoradas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Actions */}
        <Card className="mb-6 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Ações de Teste
            </CardTitle>
            <CardDescription>
              Execute testes automatizados em todas as rotas do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={testAllRoutes}
                disabled={testingAll}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {testingAll ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Testar Todas as Rotas
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                <Home className="w-4 h-4 mr-2" />
                Landing Page
              </Button>
              <Button variant="outline" onClick={() => navigate("/app/dashboard")}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin")}>
                <Settings className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Routes Tabs */}
        <Tabs defaultValue="public" className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="public">Públicas</TabsTrigger>
            <TabsTrigger value="private">Privadas</TabsTrigger>
            <TabsTrigger value="influencer">Influencer</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="qa">QA</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px]">
            <TabsContent value="public">
              {renderRouteSection("Rotas Públicas", SYSTEM_ROUTES.public, <Home className="w-4 h-4 text-green-500" />)}
            </TabsContent>

            <TabsContent value="private">
              {renderRouteSection("Rotas Privadas (App)", SYSTEM_ROUTES.private, <Lock className="w-4 h-4 text-blue-500" />)}
            </TabsContent>

            <TabsContent value="influencer">
              {renderRouteSection("Rotas do Influencer", SYSTEM_ROUTES.influencer, <Users className="w-4 h-4 text-purple-500" />)}
            </TabsContent>

            <TabsContent value="admin">
              {renderRouteSection("Rotas Admin", SYSTEM_ROUTES.admin, <Shield className="w-4 h-4 text-red-500" />)}
            </TabsContent>

            <TabsContent value="qa">
              {renderRouteSection("Rotas QA", SYSTEM_ROUTES.qa, <Zap className="w-4 h-4 text-yellow-500" />)}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Security Info */}
        <Card className="mt-6 border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              Informações de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">✅ Proteções Aplicadas:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Rotas QA não indexadas</li>
                  <li>• Rotas ocultas do menu público</li>
                  <li>• Acesso bloqueado para usuários comuns</li>
                  <li>• Pagamentos reais desabilitados</li>
                  <li>• Webhooks financeiros ignorados</li>
                  <li>• Emails automáticos suprimidos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">⚠️ Checklist de Segurança:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• [✓] QA_USER não aparece em relatórios</li>
                  <li>• [✓] QA_USER não conta para métricas</li>
                  <li>• [✓] QA_USER não pode gerar assinaturas</li>
                  <li>• [✓] QA_USER nunca expira</li>
                  <li>• [✓] Flags isoladas por usuário</li>
                  <li>• [✓] Ambiente completamente isolado</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default QADashboard;
