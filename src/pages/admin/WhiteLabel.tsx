import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
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
import { 
  Palette, 
  Upload, 
  Save, 
  Eye, 
  Sparkles,
  Building2,
  Globe,
  Mail,
  Phone,
  CheckCircle,
  DollarSign,
  Users,
  Key,
  Settings,
  BarChart3,
  Code,
  Crown,
  Plus,
  Trash,
  Copy,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminWhiteLabel = () => {
  const { toast } = useToast();
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [brandConfig, setBrandConfig] = useState({
    agencyName: "Sua Agência",
    primaryColor: "#A855F7",
    secondaryColor: "#06B6D4",
    accentColor: "#F59E0B",
    logo: "",
    favicon: "",
    customDomain: "",
    supportEmail: "",
    supportPhone: "",
    termsUrl: "",
    privacyUrl: "",
    welcomeMessage: "",
    platformFee: 10,
    emailFromName: "Sua Agência",
    emailFromAddress: "no-reply@suaagencia.com",
  });

  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Produção", key: "sk_live_abc123...", created: "2024-01-15", lastUsed: "Há 2 horas" },
    { id: "2", name: "Desenvolvimento", key: "sk_test_xyz789...", created: "2024-01-10", lastUsed: "Há 1 dia" },
  ]);

  const [pricingPlans, setPricingPlans] = useState([
    { id: "1", name: "Starter", price: 299, campaigns: 5, influencers: 10, active: true },
    { id: "2", name: "Professional", price: 899, campaigns: 20, influencers: 50, active: true },
    { id: "3", name: "Enterprise", price: 2499, campaigns: -1, influencers: -1, active: true },
  ]);

  const agencies = [
    { 
      id: "1", 
      name: "Digital Masters", 
      domain: "app.digitalmasters.com.br", 
      clients: 42, 
      revenue: 45000,
      status: "active",
      plan: "Enterprise"
    },
    { 
      id: "2", 
      name: "Growth Hub", 
      domain: "platform.growthhub.com", 
      clients: 38, 
      revenue: 32000,
      status: "active",
      plan: "Professional"
    },
    { 
      id: "3", 
      name: "Social Plus", 
      domain: "app.socialplus.io", 
      clients: 25, 
      revenue: 18000,
      status: "trial",
      plan: "Starter"
    },
  ];

  const handleSave = () => {
    toast({
      title: "Configurações salvas!",
      description: "As personalizações foram aplicadas com sucesso.",
    });
  };

  const handlePreview = () => {
    toast({
      title: "Visualização gerada",
      description: "Abrindo preview em nova aba...",
    });
  };

  const generateApiKey = () => {
    const newKey = {
      id: Date.now().toString(),
      name: `API Key ${apiKeys.length + 1}`,
      key: `sk_live_${Math.random().toString(36).substr(2, 24)}`,
      created: new Date().toLocaleDateString(),
      lastUsed: "Nunca"
    };
    setApiKeys([...apiKeys, newKey]);
    toast({
      title: "API Key gerada!",
      description: "Guarde a chave em local seguro.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência.",
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-4 animate-fade-in">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              White Label Master Edition
            </span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-artist bg-clip-text text-transparent mb-2">
            Plataforma White Label
          </h1>
          <p className="text-muted-foreground text-lg">
            Configure e gerencie agências parceiras com total personalização
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePreview} className="hover-scale">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* KPIs Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: "Agências Ativas", 
            value: agencies.filter(a => a.status === "active").length.toString(), 
            change: "+3 este mês",
            icon: Building2, 
            gradient: "from-primary to-primary/70" 
          },
          { 
            label: "Clientes Totais", 
            value: agencies.reduce((sum, a) => sum + a.clients, 0).toString(), 
            change: "+28 este mês",
            icon: Users, 
            gradient: "from-secondary to-secondary/70" 
          },
          { 
            label: "Receita Mensal", 
            value: `R$ ${(agencies.reduce((sum, a) => sum + a.revenue, 0) / 1000).toFixed(0)}K`, 
            change: "+18% vs mês anterior",
            icon: DollarSign, 
            gradient: "from-artist to-artist/70" 
          },
          { 
            label: "Domínios Ativos", 
            value: agencies.filter(a => a.domain).length.toString(), 
            change: "100% uptime",
            icon: Globe, 
            gradient: "from-green-500 to-green-600" 
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="relative group animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`} />
              <Card className="relative p-6 border-border/50 bg-card/60 backdrop-blur-xl">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} inline-flex mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Configuration Tabs */}
      <Tabs defaultValue="agencies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:inline-flex">
          <TabsTrigger value="agencies">Agências</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="pricing">Precificação</TabsTrigger>
          <TabsTrigger value="apis">APIs</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        {/* Agencies Tab */}
        <TabsContent value="agencies" className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Agências Gerenciadas</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Agência
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Nova Agência</DialogTitle>
                  <DialogDescription>
                    Configure uma nova agência white label
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome da Agência</Label>
                      <Input placeholder="Nome da agência" />
                    </div>
                    <div className="space-y-2">
                      <Label>Domínio</Label>
                      <Input placeholder="app.agencia.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Principal</Label>
                      <Input type="email" placeholder="contato@agencia.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Plano</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="starter">Starter</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Comissão (%)</Label>
                    <Input type="number" placeholder="10" min="0" max="50" />
                    <p className="text-xs text-muted-foreground">
                      Percentual de comissão da Arcana sobre cada transação
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancelar</Button>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    Criar Agência
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {agencies.map((agency, idx) => (
              <div 
                key={idx} 
                className="relative group animate-fade-in" 
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
                <Card className="relative p-6 border-border/50 bg-card/60 backdrop-blur-xl hover:border-primary/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
                        <Building2 className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold">{agency.name}</h3>
                          <Badge className={
                            agency.status === 'active' 
                              ? 'bg-green-500/10 text-green-500 border-green-500/30' 
                              : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                          }>
                            {agency.status === 'active' ? 'Ativa' : 'Trial'}
                          </Badge>
                          <Badge variant="outline">{agency.plan}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          {agency.domain}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Clientes</p>
                        <p className="text-2xl font-bold">{agency.clients}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Receita Mensal</p>
                        <p className="text-2xl font-bold text-green-500">
                          R$ {(agency.revenue / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Configurar
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6 animate-fade-in">
          <Card className="p-6 border-border/50 bg-card/60 backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Identidade Visual
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="agencyName">Nome da Agência</Label>
                <Input
                  id="agencyName"
                  value={brandConfig.agencyName}
                  onChange={(e) => setBrandConfig({ ...brandConfig, agencyName: e.target.value })}
                  placeholder="Digite o nome da sua agência"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex gap-3">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={brandConfig.primaryColor}
                      onChange={(e) => setBrandConfig({ ...brandConfig, primaryColor: e.target.value })}
                      className="w-20 h-12 cursor-pointer"
                    />
                    <Input
                      value={brandConfig.primaryColor}
                      onChange={(e) => setBrandConfig({ ...brandConfig, primaryColor: e.target.value })}
                      className="flex-1 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Cor Secundária</Label>
                  <div className="flex gap-3">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={brandConfig.secondaryColor}
                      onChange={(e) => setBrandConfig({ ...brandConfig, secondaryColor: e.target.value })}
                      className="w-20 h-12 cursor-pointer"
                    />
                    <Input
                      value={brandConfig.secondaryColor}
                      onChange={(e) => setBrandConfig({ ...brandConfig, secondaryColor: e.target.value })}
                      className="flex-1 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Cor de Destaque</Label>
                  <div className="flex gap-3">
                    <Input
                      id="accentColor"
                      type="color"
                      value={brandConfig.accentColor}
                      onChange={(e) => setBrandConfig({ ...brandConfig, accentColor: e.target.value })}
                      className="w-20 h-12 cursor-pointer"
                    />
                    <Input
                      value={brandConfig.accentColor}
                      onChange={(e) => setBrandConfig({ ...brandConfig, accentColor: e.target.value })}
                      className="flex-1 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Logo da Agência</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arraste e solte ou clique para fazer upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, SVG ou JPG (recomendado: 200x50px)
                    </p>
                    <Button variant="outline" className="mt-4">
                      Selecionar Arquivo
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Ícone do site (32x32px)
                    </p>
                    <Button variant="outline" size="sm">
                      Selecionar Favicon
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preview das Cores</Label>
                <div className="grid grid-cols-3 gap-4 p-6 bg-muted/30 rounded-xl">
                  <div 
                    className="h-24 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: brandConfig.primaryColor }}
                  >
                    Primária
                  </div>
                  <div 
                    className="h-24 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: brandConfig.secondaryColor }}
                  >
                    Secundária
                  </div>
                  <div 
                    className="h-24 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: brandConfig.accentColor }}
                  >
                    Destaque
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/50 bg-card/60 backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Domínio Customizado
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customDomain">Domínio Personalizado</Label>
                <Input
                  id="customDomain"
                  value={brandConfig.customDomain}
                  onChange={(e) => setBrandConfig({ ...brandConfig, customDomain: e.target.value })}
                  placeholder="app.suaagencia.com"
                />
              </div>

              <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <AlertCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Configuração DNS</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Adicione os seguintes registros DNS no seu provedor de domínio:
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-background/50 p-4 rounded-lg font-mono text-sm">
                    <div className="grid grid-cols-3 gap-4 mb-2 text-muted-foreground text-xs">
                      <span>TIPO</span>
                      <span>NOME</span>
                      <span>VALOR</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <span>CNAME</span>
                      <span>app</span>
                      <span>arcana-platform.lovable.app</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      SSL Automático Habilitado
                    </Badge>
                    <Badge variant="outline">
                      Certificado Let's Encrypt
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6 animate-fade-in">
          <Card className="p-6 border-border/50 bg-card/60 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Planos e Precificação
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure os planos oferecidos para suas agências
                </p>
              </div>
              <Button className="bg-gradient-to-r from-primary to-secondary">
                <Plus className="w-4 h-4 mr-2" />
                Novo Plano
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {pricingPlans.map((plan, idx) => (
                <div 
                  key={plan.id}
                  className="relative group animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
                  <Card className="relative p-6 border-border/50 bg-card/60 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      <Switch checked={plan.active} />
                    </div>
                    <div className="mb-6">
                      <p className="text-4xl font-bold text-primary mb-1">
                        R$ {plan.price}
                      </p>
                      <p className="text-sm text-muted-foreground">/mês</p>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>
                          {plan.campaigns === -1 ? 'Campanhas ilimitadas' : `${plan.campaigns} campanhas`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>
                          {plan.influencers === -1 ? 'Influencers ilimitados' : `${plan.influencers} influencers`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Analytics em tempo real</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Suporte prioritário</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Editar Plano
                    </Button>
                  </Card>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-border/50 bg-card/60 backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-6">Comissões e Revenue Share</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Taxa da Plataforma (%)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={brandConfig.platformFee}
                    onChange={(e) => setBrandConfig({ ...brandConfig, platformFee: Number(e.target.value) })}
                    min="0"
                    max="50"
                    className="w-32"
                  />
                  <p className="text-sm text-muted-foreground">
                    Taxa cobrada pela Arcana sobre cada transação das agências
                  </p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl">
                <h3 className="font-semibold mb-4">Simulação de Revenue</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Transação de Exemplo</p>
                    <p className="text-2xl font-bold">R$ 10.000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Taxa Arcana ({brandConfig.platformFee}%)</p>
                    <p className="text-2xl font-bold text-primary">
                      R$ {(10000 * brandConfig.platformFee / 100).toFixed(0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Valor para Agência</p>
                    <p className="text-2xl font-bold text-green-500">
                      R$ {(10000 * (100 - brandConfig.platformFee) / 100).toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* APIs Tab */}
        <TabsContent value="apis" className="space-y-6 animate-fade-in">
          <Card className="p-6 border-border/50 bg-card/60 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  API Keys e Integrações
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerencie chaves de API para integrações externas
                </p>
              </div>
              <Button onClick={generateApiKey} className="bg-gradient-to-r from-primary to-secondary">
                <Plus className="w-4 h-4 mr-2" />
                Gerar Nova Key
              </Button>
            </div>

            <div className="space-y-4">
              {apiKeys.map((key, idx) => (
                <div 
                  key={key.id}
                  className="relative group animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
                  <div className="relative p-4 border border-border/50 rounded-xl bg-background/50 hover:bg-muted/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{key.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            Criada em {key.created}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-muted px-3 py-1 rounded font-mono">
                            {key.key}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(key.key)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Último uso: {key.lastUsed}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-border/50 bg-card/60 backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Documentação da API
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">Endpoint Base</h3>
                <code className="text-sm">https://api.arcana.com/v1/</code>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-border/50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">Autenticação</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Inclua sua API key no header:
                  </p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block">
                    Authorization: Bearer {'{'}your_api_key{'}'}
                  </code>
                </div>
                <div className="p-4 border border-border/50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">Rate Limiting</h4>
                  <p className="text-xs text-muted-foreground">
                    1000 requisições por hora
                  </p>
                  <p className="text-xs text-muted-foreground">
                    5000 requisições por dia
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Code className="w-4 h-4 mr-2" />
                Ver Documentação Completa
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-6 animate-fade-in">
          <Card className="p-6 border-border/50 bg-card/60 backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Configuração de Email
            </h2>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nome do Remetente</Label>
                  <Input
                    value={brandConfig.emailFromName}
                    onChange={(e) => setBrandConfig({ ...brandConfig, emailFromName: e.target.value })}
                    placeholder="Sua Agência"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email do Remetente</Label>
                  <Input
                    type="email"
                    value={brandConfig.emailFromAddress}
                    onChange={(e) => setBrandConfig({ ...brandConfig, emailFromAddress: e.target.value })}
                    placeholder="no-reply@suaagencia.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email de Suporte</Label>
                <Input
                  type="email"
                  value={brandConfig.supportEmail}
                  onChange={(e) => setBrandConfig({ ...brandConfig, supportEmail: e.target.value })}
                  placeholder="suporte@suaagencia.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Mensagem de Boas-vindas</Label>
                <Textarea
                  value={brandConfig.welcomeMessage}
                  onChange={(e) => setBrandConfig({ ...brandConfig, welcomeMessage: e.target.value })}
                  placeholder="Mensagem que aparecerá no primeiro acesso dos clientes..."
                  rows={4}
                />
              </div>

              <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl">
                <h3 className="font-semibold mb-4">Preview do Email</h3>
                <div className="bg-white text-black p-6 rounded-lg">
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold" style={{ color: brandConfig.primaryColor }}>
                      {brandConfig.emailFromName}
                    </h2>
                  </div>
                  <p className="mb-4">Olá,</p>
                  <p className="mb-4">{brandConfig.welcomeMessage || "Mensagem de boas-vindas aparecerá aqui..."}</p>
                  <p className="text-sm text-gray-600">
                    Atenciosamente,<br />
                    Equipe {brandConfig.emailFromName}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 animate-fade-in">
          <Card className="p-6 border-border/50 bg-card/60 backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Analytics White Label
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Google Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Integre com Google Analytics 4
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Facebook Pixel</h3>
                  <p className="text-sm text-muted-foreground">
                    Rastreamento de conversões
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Hotjar</h3>
                  <p className="text-sm text-muted-foreground">
                    Gravação de sessões e heatmaps
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6 animate-fade-in">
          <Card className="p-6 border-border/50 bg-card/60 backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-6">Configurações Avançadas</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Modo Manutenção</h3>
                  <p className="text-sm text-muted-foreground">
                    Exibir página de manutenção para todas as agências
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">2FA Obrigatório</h3>
                  <p className="text-sm text-muted-foreground">
                    Forçar autenticação de dois fatores para todos os usuários
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Logs de Auditoria</h3>
                  <p className="text-sm text-muted-foreground">
                    Registrar todas as ações importantes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>URLs Legais</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    value={brandConfig.termsUrl}
                    onChange={(e) => setBrandConfig({ ...brandConfig, termsUrl: e.target.value })}
                    placeholder="https://suaagencia.com/termos"
                  />
                  <Input
                    value={brandConfig.privacyUrl}
                    onChange={(e) => setBrandConfig({ ...brandConfig, privacyUrl: e.target.value })}
                    placeholder="https://suaagencia.com/privacidade"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminWhiteLabel;
