import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Crown,
  Globe,
  Palette,
  Settings,
  Key,
  BarChart3,
  Mail,
  Upload,
  Save,
  Eye,
  Sparkles,
  Code,
  Shield,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Copy,
  Plus,
  Trash,
  ExternalLink,
  Zap,
  Target,
  Award,
  Activity,
  CreditCard,
  FileText,
  Bell,
  Lock
} from "lucide-react";

export default function WhiteLabelDashboard() {
  const { domain } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'whitelabel');
    setLoading(false);
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, []);

  const [agencyConfig, setAgencyConfig] = useState({
    name: "Growth Agency Pro",
    domain: domain || "growthhub.com",
    logo: "",
    primaryColor: "#10b981",
    secondaryColor: "#06b6d4",
    supportEmail: "suporte@growthhub.com",
    customDomain: "app.growthhub.com",
    monthlyRevenue: 125000,
    activeClients: 48,
    totalCampaigns: 156,
    conversionRate: 8.4
  });

  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Produção", key: "wl_live_abc123xyz...", created: "2024-01-15", lastUsed: "Há 2 horas", requests: 12458 },
    { id: "2", name: "Staging", key: "wl_test_def456uvw...", created: "2024-01-10", lastUsed: "Há 5 dias", requests: 3421 },
  ]);

  const [pricingPlans, setPricingPlans] = useState([
    { id: "1", name: "Starter", price: 299, campaigns: 5, influencers: 10, revenue: 35000, clients: 12, active: true },
    { id: "2", name: "Professional", price: 899, campaigns: 20, influencers: 50, revenue: 62000, clients: 24, active: true },
    { id: "3", name: "Enterprise", price: 2499, campaigns: -1, influencers: -1, revenue: 28000, clients: 12, active: true },
  ]);

  const stats = [
    {
      title: "Receita Mensal",
      value: `R$ ${agencyConfig.monthlyRevenue.toLocaleString()}`,
      change: "+R$ 15K",
      trend: "up",
      icon: DollarSign,
      gradient: "from-whitelabel-primary to-whitelabel-secondary"
    },
    {
      title: "Clientes Ativos",
      value: agencyConfig.activeClients,
      change: "+8 este mês",
      trend: "up",
      icon: Users,
      gradient: "from-whitelabel-secondary to-whitelabel-accent"
    },
    {
      title: "Campanhas Totais",
      value: agencyConfig.totalCampaigns,
      change: "+23 este mês",
      trend: "up",
      icon: Target,
      gradient: "from-whitelabel-accent to-whitelabel-primary"
    },
    {
      title: "Taxa Conversão",
      value: `${agencyConfig.conversionRate}%`,
      change: "+1.2%",
      trend: "up",
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-600"
    }
  ];

  const generateApiKey = () => {
    const newKey = {
      id: String(apiKeys.length + 1),
      name: `API Key ${apiKeys.length + 1}`,
      key: `wl_${Math.random().toString(36).substr(2, 9)}_${Math.random().toString(36).substr(2, 9)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: "Nunca",
      requests: 0
    };
    setApiKeys([...apiKeys, newKey]);
    toast({
      title: "API Key Gerada",
      description: "Nova chave de API criada com sucesso!",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Chave copiada para a área de transferência",
    });
  };

  const saveChanges = () => {
    toast({
      title: "Configurações Salvas",
      description: "Suas alterações foram aplicadas com sucesso!",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">White Label Master</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            {agencyConfig.name}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {agencyConfig.domain}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-primary/20">
            <Eye className="w-4 h-4 mr-2" />
            Pré-visualizar
          </Button>
          <Button onClick={saveChanges} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            <Save className="w-4 h-4 mr-2" />
            Salvar Tudo
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="relative group">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500`} />
              <Card className="relative border-border/50 bg-card/80 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      {stat.title}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <p className="text-sm flex items-center gap-1 text-green-500">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto">
          <TabsTrigger value="branding">
            <Palette className="w-4 h-4 mr-2" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="clients">
            <Users className="w-4 h-4 mr-2" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <CreditCard className="w-4 h-4 mr-2" />
            Planos
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="w-4 h-4 mr-2" />
            API
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Config
          </TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Customização Visual
              </CardTitle>
              <CardDescription>Personalize a identidade da sua plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="agencyName">Nome da Agência</Label>
                  <Input
                    id="agencyName"
                    value={agencyConfig.name}
                    onChange={(e) => setAgencyConfig({...agencyConfig, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customDomain">Domínio Customizado</Label>
                  <div className="flex gap-2">
                    <Input
                      id="customDomain"
                      value={agencyConfig.customDomain}
                      onChange={(e) => setAgencyConfig({...agencyConfig, customDomain: e.target.value})}
                    />
                    <Button variant="outline" size="icon">
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={agencyConfig.primaryColor}
                      onChange={(e) => setAgencyConfig({...agencyConfig, primaryColor: e.target.value})}
                      className="h-12 w-20"
                    />
                    <Input
                      value={agencyConfig.primaryColor}
                      readOnly
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={agencyConfig.secondaryColor}
                      onChange={(e) => setAgencyConfig({...agencyConfig, secondaryColor: e.target.value})}
                      className="h-12 w-20"
                    />
                    <Input
                      value={agencyConfig.secondaryColor}
                      readOnly
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Logo Upload</Label>
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
              </div>

              <div className="p-6 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Pré-visualização do Tema
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="h-12 flex-1 rounded-lg" style={{background: agencyConfig.primaryColor}} />
                    <div className="h-12 flex-1 rounded-lg" style={{background: agencyConfig.secondaryColor}} />
                  </div>
                  <Button className="w-full" style={{background: agencyConfig.primaryColor}}>
                    Botão Primário Exemplo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DNS Configuration */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Configuração DNS
              </CardTitle>
              <CardDescription>Configure seu domínio personalizado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm">Type: A</p>
                    <p className="font-mono text-sm">Name: @</p>
                    <p className="font-mono text-sm text-primary">Value: 185.158.133.1</p>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Ativo
                  </Badge>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm">Type: CNAME</p>
                    <p className="font-mono text-sm">Name: www</p>
                    <p className="font-mono text-sm text-primary">Value: {agencyConfig.customDomain}</p>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Ativo
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Gerenciar Clientes
                  </CardTitle>
                  <CardDescription>Lista de clientes da sua agência</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Cliente
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Tech Startup Inc", plan: "Enterprise", campaigns: 12, revenue: "R$ 28.5K", status: "active" },
                  { name: "Fashion Brand Co", plan: "Professional", campaigns: 8, revenue: "R$ 15.2K", status: "active" },
                  { name: "Food Delivery App", plan: "Starter", campaigns: 3, revenue: "R$ 8.9K", status: "active" },
                ].map((client, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/20 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{client.name}</h3>
                        <p className="text-sm text-muted-foreground">{client.campaigns} campanhas ativas</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{client.plan}</Badge>
                        <div className="text-right">
                          <p className="font-bold text-primary">{client.revenue}</p>
                          <p className="text-xs text-muted-foreground">Receita mensal</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Planos de Preço
              </CardTitle>
              <CardDescription>Configure os planos disponíveis para seus clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingPlans.map((plan) => (
                  <div key={plan.id} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                    <Card className="relative border-border/50 bg-card/80">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {plan.name}
                          <Switch checked={plan.active} />
                        </CardTitle>
                        <div className="text-3xl font-bold text-primary">
                          R$ {plan.price}
                          <span className="text-sm text-muted-foreground">/mês</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                          <p className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            {plan.campaigns === -1 ? 'Campanhas Ilimitadas' : `${plan.campaigns} Campanhas`}
                          </p>
                          <p className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            {plan.influencers === -1 ? 'Influencers Ilimitados' : `${plan.influencers} Influencers`}
                          </p>
                        </div>
                        <div className="pt-4 border-t border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Performance</p>
                          <p className="font-bold text-primary">R$ {plan.revenue.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{plan.clients} clientes ativos</p>
                        </div>
                        <Button variant="outline" className="w-full">
                          <Settings className="w-4 h-4 mr-2" />
                          Editar Plano
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    API Keys
                  </CardTitle>
                  <CardDescription>Gerencie as chaves de API da sua plataforma</CardDescription>
                </div>
                <Button onClick={generateApiKey} className="bg-gradient-to-r from-primary to-secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  Gerar Nova Chave
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="p-4 rounded-xl border border-border/50 bg-background/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{key.name}</h3>
                      <p className="text-xs text-muted-foreground">Criado em {key.created}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{key.requests.toLocaleString()} requests</Badge>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(key.key)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 font-mono text-sm flex items-center justify-between">
                    <span>{key.key}</span>
                    <Badge className="ml-2 bg-green-500/10 text-green-500 border-green-500/20">
                      Última uso: {key.lastUsed}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* API Documentation */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Documentação da API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm font-mono mb-2">Endpoint Base:</p>
                <p className="text-sm font-mono text-primary">https://api.{agencyConfig.domain}/v1</p>
              </div>
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Ver Documentação Completa
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Analytics Integrado
              </CardTitle>
              <CardDescription>Configure ferramentas de análise para seus clientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border/50 bg-background/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Google Analytics</h3>
                    <Switch defaultChecked />
                  </div>
                  <Input placeholder="G-XXXXXXXXXX" className="mb-2" />
                  <p className="text-xs text-muted-foreground">Tracking ID do Google Analytics 4</p>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-background/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Meta Pixel</h3>
                    <Switch />
                  </div>
                  <Input placeholder="Pixel ID" className="mb-2" />
                  <p className="text-xs text-muted-foreground">Facebook Pixel ID</p>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-background/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Hotjar</h3>
                    <Switch />
                  </div>
                  <Input placeholder="Site ID" className="mb-2" />
                  <p className="text-xs text-muted-foreground">Hotjar Site ID</p>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-background/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Custom Script</h3>
                    <Switch />
                  </div>
                  <Textarea placeholder="Cole seu script aqui..." className="mb-2 h-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Configurações Avançadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50">
                <div>
                  <h3 className="font-semibold">Autenticação 2FA Obrigatória</h3>
                  <p className="text-sm text-muted-foreground">Requerer autenticação de dois fatores para todos os usuários</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50">
                <div>
                  <h3 className="font-semibold">Modo Manutenção</h3>
                  <p className="text-sm text-muted-foreground">Ativar página de manutenção para seus clientes</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50">
                <div>
                  <h3 className="font-semibold">Logs de Auditoria</h3>
                  <p className="text-sm text-muted-foreground">Registrar todas as ações dos usuários</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50">
                <div>
                  <h3 className="font-semibold">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Enviar notificações por email para eventos importantes</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-3">
                <Label>Email de Suporte</Label>
                <Input
                  value={agencyConfig.supportEmail}
                  onChange={(e) => setAgencyConfig({...agencyConfig, supportEmail: e.target.value})}
                />
              </div>

              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-destructive mb-1">Zona de Perigo</h3>
                    <p className="text-sm text-muted-foreground mb-3">Ações irreversíveis</p>
                    <Button variant="destructive" size="sm">
                      <Trash className="w-4 h-4 mr-2" />
                      Excluir Agência
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
