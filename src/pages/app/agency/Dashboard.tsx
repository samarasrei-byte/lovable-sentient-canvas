import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  MessageSquare, 
  Bell, 
  Plus,
  Filter,
  Download,
  Calendar,
  Eye,
  Edit,
  Copy,
  Archive,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Instagram,
  Facebook,
  Youtube,
  Search,
  Star,
  Sparkles,
  CreditCard,
  FileText,
  Settings,
  ChevronDown,
  TrendingDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AgencyDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header Premium */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Agency Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Arcana Agency
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Pro Plan</Badge>
                  <span>ID: AG-2024-001</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Campanha
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
              </Button>

              {/* Financeiro */}
              <Button variant="ghost" size="icon">
                <CreditCard className="w-5 h-5" />
              </Button>

              {/* Chat */}
              <Button variant="ghost" size="icon" className="relative">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-success rounded-full animate-pulse" />
              </Button>

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=agency" />
                      <AvatarFallback>AG</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="w-4 h-4 mr-2" />
                    Relatórios
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 relative z-10">
        {/* KPIs Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Campanhas Ativas */}
          <Card className="group relative overflow-hidden backdrop-blur-sm bg-card/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Campanhas Ativas
              </CardTitle>
              <Target className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                24
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-success">+12%</span> vs. mês anterior
              </p>
            </CardContent>
          </Card>

          {/* Total Gasto */}
          <Card className="group relative overflow-hidden backdrop-blur-sm bg-card/50 border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Investido
              </CardTitle>
              <DollarSign className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                R$ 487,2K
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-success">+8.4%</span> este mês
              </p>
            </CardContent>
          </Card>

          {/* ROI Médio */}
          <Card className="group relative overflow-hidden backdrop-blur-sm bg-card/50 border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                ROI Médio
              </CardTitle>
              <BarChart3 className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                342%
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-success">+24%</span> performance
              </p>
            </CardContent>
          </Card>

          {/* Influenciadores */}
          <Card className="group relative overflow-hidden backdrop-blur-sm bg-card/50 border-success/20 hover:border-success/40 transition-all duration-300 hover:shadow-lg hover:shadow-success/20 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Influenciadores
              </CardTitle>
              <Users className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-success to-secondary bg-clip-text text-transparent">
                156
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-success">+18</span> novos este mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Target className="w-4 h-4 mr-2" />
              Campanhas
            </TabsTrigger>
            <TabsTrigger value="influencers" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Users className="w-4 h-4 mr-2" />
              Influenciadores
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <TrendingUp className="w-4 h-4 mr-2" />
              Métricas
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <DollarSign className="w-4 h-4 mr-2" />
              Pagamentos
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="backdrop-blur-sm bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Campanhas em Aprovação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <Progress value={45} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">45% concluídas</p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    Engajamento Médio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.4%</div>
                  <Progress value={84} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Acima da média</p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    Tickets Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <Progress value={15} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Baixa prioridade</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="backdrop-blur-sm bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>Últimas 24 horas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { action: "Nova campanha criada", campaign: "Summer Collection 2024", time: "2 horas atrás", type: "success" },
                  { action: "Métricas enviadas", campaign: "Fitness Challenge", time: "4 horas atrás", type: "info" },
                  { action: "Pagamento aprovado", campaign: "Tech Review Series", time: "6 horas atrás", type: "success" },
                  { action: "Campanha finalizada", campaign: "Beauty Launch", time: "8 horas atrás", type: "default" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-success animate-pulse' : 
                      activity.type === 'info' ? 'bg-secondary' : 'bg-muted'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.campaign}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            {/* Filters */}
            <Card className="backdrop-blur-sm bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar campanhas..." 
                      className="bg-background/50 pl-10"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[180px] bg-background/50">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="pending">Em Análise</SelectItem>
                      <SelectItem value="completed">Finalizada</SelectItem>
                      <SelectItem value="rejected">Rejeitada</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[180px] bg-background/50">
                      <SelectValue placeholder="Plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 gap-4">
              {[
                { 
                  name: "Summer Collection 2024", 
                  status: "active", 
                  platform: "instagram", 
                  budget: "R$ 45.000",
                  influencers: 12,
                  progress: 65,
                  roi: "+285%"
                },
                { 
                  name: "Fitness Challenge", 
                  status: "pending", 
                  platform: "tiktok", 
                  budget: "R$ 32.000",
                  influencers: 8,
                  progress: 40,
                  roi: "Em análise"
                },
                { 
                  name: "Tech Review Series", 
                  status: "active", 
                  platform: "youtube", 
                  budget: "R$ 68.000",
                  influencers: 15,
                  progress: 80,
                  roi: "+412%"
                },
                { 
                  name: "Beauty Launch", 
                  status: "completed", 
                  platform: "instagram", 
                  budget: "R$ 28.000",
                  influencers: 10,
                  progress: 100,
                  roi: "+298%"
                },
              ].map((campaign, i) => (
                <Card key={i} className="backdrop-blur-sm bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold">{campaign.name}</h3>
                          <Badge 
                            className={`
                              ${campaign.status === 'active' ? 'bg-success/20 text-success border-success/50' : ''}
                              ${campaign.status === 'pending' ? 'bg-accent/20 text-accent border-accent/50' : ''}
                              ${campaign.status === 'completed' ? 'bg-muted/20 text-muted-foreground border-muted/50' : ''}
                              ${campaign.status === 'rejected' ? 'bg-destructive/20 text-destructive border-destructive/50' : ''}
                            `}
                          >
                            {campaign.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {campaign.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {campaign.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {campaign.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                            {campaign.status === 'active' ? 'Ativa' : 
                             campaign.status === 'pending' ? 'Em Análise' : 
                             campaign.status === 'completed' ? 'Finalizada' : 'Rejeitada'}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            {campaign.platform === 'instagram' && <Instagram className="w-3 h-3" />}
                            {campaign.platform === 'tiktok' && <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>}
                            {campaign.platform === 'youtube' && <Youtube className="w-3 h-3" />}
                            {campaign.platform}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Orçamento</p>
                            <p className="font-semibold">{campaign.budget}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Influenciadores</p>
                            <p className="font-semibold flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {campaign.influencers}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">ROI</p>
                            <p className="font-semibold text-success">{campaign.roi}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Progresso</p>
                            <div className="flex items-center gap-2">
                              <Progress value={campaign.progress} className="h-2 flex-1" />
                              <span className="text-xs font-semibold">{campaign.progress}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Exportar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="w-4 h-4 mr-2" />
                              Arquivar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Influencers Tab */}
          <TabsContent value="influencers" className="space-y-6">
            {/* Filters */}
            <Card className="backdrop-blur-sm bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar influenciadores..." 
                      className="bg-background/50 pl-10"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[180px] bg-background/50">
                      <SelectValue placeholder="Nicho" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="fashion">Moda</SelectItem>
                      <SelectItem value="tech">Tecnologia</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="beauty">Beleza</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[180px] bg-background/50">
                      <SelectValue placeholder="Plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Influencers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Ana Silva", username: "@anasilva", niche: "Moda", followers: "245K", engagement: "8.4%", price: "R$ 5.000", rating: 4.9, platforms: ["instagram", "tiktok"] },
                { name: "Carlos Tech", username: "@carlostech", niche: "Tecnologia", followers: "180K", engagement: "7.2%", price: "R$ 4.200", rating: 4.8, platforms: ["youtube", "instagram"] },
                { name: "Beatriz Fit", username: "@beatrizfit", niche: "Fitness", followers: "320K", engagement: "9.1%", price: "R$ 6.800", rating: 5.0, platforms: ["instagram", "facebook"] },
                { name: "Diego Games", username: "@diegogames", niche: "Gaming", followers: "450K", engagement: "12.3%", price: "R$ 8.500", rating: 4.9, platforms: ["youtube", "tiktok"] },
                { name: "Elena Beauty", username: "@elenabeauty", niche: "Beleza", followers: "280K", engagement: "8.8%", price: "R$ 5.800", rating: 4.7, platforms: ["instagram"] },
                { name: "Felipe Travel", username: "@felipetravel", niche: "Viagens", followers: "195K", engagement: "6.9%", price: "R$ 4.500", rating: 4.8, platforms: ["instagram", "youtube"] },
              ].map((influencer, i) => (
                <Card key={i} className="group backdrop-blur-sm bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-16 h-16 ring-2 ring-primary/20">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${influencer.username}`} />
                        <AvatarFallback>{influencer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{influencer.name}</h3>
                        <p className="text-sm text-muted-foreground">{influencer.username}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-accent text-accent" />
                          <span className="text-xs font-semibold">{influencer.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Seguidores</span>
                        <span className="font-semibold">{influencer.followers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Engajamento</span>
                        <span className="font-semibold text-success">{influencer.engagement}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Preço médio</span>
                        <span className="font-semibold">{influencer.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline">{influencer.niche}</Badge>
                      {influencer.platforms.map(platform => (
                        <div key={platform} className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center">
                          {platform === 'instagram' && <Instagram className="w-3 h-3" />}
                          {platform === 'tiktok' && <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>}
                          {platform === 'youtube' && <Youtube className="w-3 h-3" />}
                          {platform === 'facebook' && <Facebook className="w-3 h-3" />}
                        </div>
                      ))}
                    </div>

                    <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Convidar para Campanha
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="backdrop-blur-sm bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Performance por Plataforma</CardTitle>
                  <CardDescription>Alcance total últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { platform: "Instagram", reach: "2.8M", engagement: "8.4%", color: "from-[#f09433] to-[#e6683c]" },
                    { platform: "TikTok", reach: "3.2M", engagement: "12.3%", color: "from-[#00f2ea] to-[#ff0050]" },
                    { platform: "YouTube", reach: "1.5M", engagement: "6.9%", color: "from-[#ff0000] to-[#cc0000]" },
                    { platform: "Facebook", reach: "980K", engagement: "5.2%", color: "from-[#1877f2] to-[#0c63d4]" },
                  ].map((platform, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{platform.platform}</span>
                        <span className="text-muted-foreground">{platform.reach}</span>
                      </div>
                      <div className="relative h-3 bg-muted/20 rounded-full overflow-hidden">
                        <div 
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${platform.color} rounded-full transition-all duration-500`}
                          style={{ width: `${parseInt(platform.engagement) * 8}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Engajamento: <span className="text-success font-semibold">{platform.engagement}</span>
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>ROI Comparativo</CardTitle>
                  <CardDescription>Top 5 campanhas do mês</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Tech Review Series", roi: "+412%", investment: "R$ 68K", color: "success" },
                    { name: "Beauty Launch", roi: "+298%", investment: "R$ 28K", color: "success" },
                    { name: "Summer Collection", roi: "+285%", investment: "R$ 45K", color: "success" },
                    { name: "Fitness Challenge", roi: "+156%", investment: "R$ 32K", color: "accent" },
                    { name: "Gaming Series", roi: "+89%", investment: "R$ 22K", color: "secondary" },
                  ].map((campaign, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                      <div>
                        <p className="text-sm font-medium">{campaign.name}</p>
                        <p className="text-xs text-muted-foreground">{campaign.investment}</p>
                      </div>
                      <Badge className={`bg-${campaign.color}/20 text-${campaign.color} border-${campaign.color}/50`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {campaign.roi}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="backdrop-blur-sm bg-card/50 border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Métricas Detalhadas</CardTitle>
                    <CardDescription>Análise completa de performance</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Exportar Relatório
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: "CPM Médio", value: "R$ 12,50", change: "-8%", trend: "down" },
                    { label: "CPC Médio", value: "R$ 2,80", change: "-12%", trend: "down" },
                    { label: "CPA Médio", value: "R$ 45,00", change: "-5%", trend: "down" },
                    { label: "Crescimento", value: "+24%", change: "+6%", trend: "up" },
                  ].map((metric, i) => (
                    <div key={i} className="text-center p-4 rounded-lg bg-muted/20">
                      <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                      <p className="text-2xl font-bold mb-1">{metric.value}</p>
                      <p className={`text-xs flex items-center justify-center gap-1 ${
                        metric.trend === 'up' ? 'text-success' : 'text-destructive'
                      }`}>
                        {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {metric.change}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="backdrop-blur-sm bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pagamentos Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">R$ 127,5K</div>
                  <p className="text-xs text-muted-foreground mt-1">12 pagamentos aguardando aprovação</p>
                  <Button className="w-full mt-4" variant="outline">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprovar Tudo
                  </Button>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pagamentos Processados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">R$ 384,2K</div>
                  <p className="text-xs text-muted-foreground mt-1">48 pagamentos este mês</p>
                  <Button className="w-full mt-4" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Ver Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Próximos Vencimentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground mt-1">Próximos 7 dias</p>
                  <Button className="w-full mt-4" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Ver Calendário
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="backdrop-blur-sm bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Histórico de Pagamentos</CardTitle>
                <CardDescription>Últimas transações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { influencer: "Ana Silva", campaign: "Summer Collection", amount: "R$ 5.000", status: "completed", date: "25/11/2024" },
                    { influencer: "Carlos Tech", campaign: "Tech Review", amount: "R$ 4.200", status: "completed", date: "24/11/2024" },
                    { influencer: "Beatriz Fit", campaign: "Fitness Challenge", amount: "R$ 6.800", status: "pending", date: "23/11/2024" },
                    { influencer: "Diego Games", campaign: "Gaming Series", amount: "R$ 8.500", status: "pending", date: "22/11/2024" },
                    { influencer: "Elena Beauty", campaign: "Beauty Launch", amount: "R$ 5.800", status: "completed", date: "21/11/2024" },
                  ].map((payment, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${payment.influencer}`} />
                          <AvatarFallback>{payment.influencer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{payment.influencer}</p>
                          <p className="text-xs text-muted-foreground">{payment.campaign}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{payment.amount}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline"
                            className={`text-xs ${
                              payment.status === 'completed' ? 'bg-success/20 text-success border-success/50' : 
                              'bg-accent/20 text-accent border-accent/50'
                            }`}
                          >
                            {payment.status === 'completed' ? 'Pago' : 'Pendente'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{payment.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
