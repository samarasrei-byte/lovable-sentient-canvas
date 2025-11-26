import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Home, 
  Users, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Plug, 
  Palette, 
  Shield, 
  Key, 
  HelpCircle,
  Settings,
  Plus,
  Search,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Globe,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

const menuItems = [
  { icon: Home, label: "Dashboard", value: "dashboard" },
  { icon: Building2, label: "Tenants", value: "tenants" },
  { icon: Users, label: "Subcontas", value: "subaccounts" },
  { icon: Users, label: "Clientes", value: "clients" },
  { icon: TrendingUp, label: "Campanhas", value: "campaigns" },
  { icon: Users, label: "Influenciadores", value: "influencers" },
  { icon: DollarSign, label: "Finanças", value: "finance" },
  { icon: BarChart3, label: "Relatórios", value: "reports" },
  { icon: Plug, label: "Integrações", value: "integrations" },
  { icon: Palette, label: "Branding", value: "branding" },
  { icon: Shield, label: "Permissões", value: "permissions" },
  { icon: Activity, label: "Auditoria", value: "audit" },
  { icon: Key, label: "API & Keys", value: "api" },
  { icon: HelpCircle, label: "Suporte", value: "support" },
];

const tenants = [
  {
    id: "1",
    name: "Tech Solutions Inc",
    domain: "techsolutions.arcana.app",
    plan: "Enterprise",
    status: "active",
    mrr: 4999,
    users: 45,
    campaigns: 23,
    lastLogin: "2 hours ago",
    quota: 78,
  },
  {
    id: "2",
    name: "Fashion Brands Co",
    domain: "fashionbrands.arcana.app",
    plan: "Professional",
    status: "active",
    mrr: 1999,
    users: 18,
    campaigns: 12,
    lastLogin: "1 day ago",
    quota: 65,
  },
  {
    id: "3",
    name: "Gaming Studio",
    domain: "gamingstudio.arcana.app",
    plan: "Professional",
    status: "trial",
    mrr: 0,
    users: 8,
    campaigns: 5,
    lastLogin: "3 hours ago",
    quota: 32,
  },
  {
    id: "4",
    name: "Food Network Ltd",
    domain: "foodnetwork.arcana.app",
    plan: "Starter",
    status: "suspended",
    mrr: 499,
    users: 5,
    campaigns: 2,
    lastLogin: "2 weeks ago",
    quota: 12,
  },
];

export default function WhiteLabel() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedTenant, setSelectedTenant] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "trial":
        return "bg-warning/10 text-warning border-warning/20";
      case "suspended":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="w-3 h-3" />;
      case "trial":
        return <Clock className="w-3 h-3" />;
      case "suspended":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-card/40 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg opacity-40 blur-sm" />
                  <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    White-Label Console
                  </h1>
                  <p className="text-xs text-muted-foreground">Multi-Tenant Management</p>
                </div>
              </div>

              <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                <SelectTrigger className="w-64 bg-background/50 border-border/30">
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tenants</SelectItem>
                  {tenants.map(tenant => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" />
                Import
              </Button>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Create Tenant
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border/30 bg-card/20 min-h-screen sticky top-[73px]">
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.value}
                onClick={() => setActiveSection(item.value)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  activeSection === item.value
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <item.icon className={`w-4 h-4 ${activeSection === item.value ? "scale-110" : ""}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Dashboard View */}
          {activeSection === "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold mb-2">Master Dashboard</h2>
                <p className="text-muted-foreground">Global overview of all tenants and operations</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="relative overflow-hidden border-border/30 bg-card/40 backdrop-blur">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                  <CardHeader className="relative pb-2">
                    <CardDescription>Tenants Ativos</CardDescription>
                    <CardTitle className="text-3xl font-bold">156</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="flex items-center gap-2 text-sm text-success">
                      <TrendingUp className="w-4 h-4" />
                      <span>+12% vs last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-border/30 bg-card/40 backdrop-blur">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5" />
                  <CardHeader className="relative pb-2">
                    <CardDescription>MRR Total</CardDescription>
                    <CardTitle className="text-3xl font-bold">$284K</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="flex items-center gap-2 text-sm text-success">
                      <TrendingUp className="w-4 h-4" />
                      <span>+18% vs last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-border/30 bg-card/40 backdrop-blur">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5" />
                  <CardHeader className="relative pb-2">
                    <CardDescription>Campanhas Ativas</CardDescription>
                    <CardTitle className="text-3xl font-bold">2,847</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="flex items-center gap-2 text-sm text-success">
                      <TrendingUp className="w-4 h-4" />
                      <span>+24% vs last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-border/30 bg-card/40 backdrop-blur">
                  <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-success/5" />
                  <CardHeader className="relative pb-2">
                    <CardDescription>Uptime Status</CardDescription>
                    <CardTitle className="text-3xl font-bold">99.98%</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="flex items-center gap-2 text-sm text-success">
                      <Activity className="w-4 h-4" />
                      <span>All systems operational</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-border/30 bg-card/40 backdrop-blur">
                  <CardHeader>
                    <CardTitle>MRR & Churn Timeline</CardTitle>
                    <CardDescription>Monthly recurring revenue and churn rate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart placeholder - MRR growth & churn analysis
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/30 bg-card/40 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Geographic Distribution</CardTitle>
                    <CardDescription>Tenants by region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart placeholder - World map with tenant distribution
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Tenants View */}
          {activeSection === "tenants" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Tenants Management</h2>
                  <p className="text-muted-foreground">Manage all your tenants and subaccounts</p>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tenants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 border-border/30"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40 bg-background/50 border-border/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>

              {/* Tenants Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTenants.map((tenant) => (
                  <Card key={tenant.id} className="border-border/30 bg-card/40 backdrop-blur hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{tenant.name}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Globe className="w-3 h-3" />
                                {tenant.domain}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getStatusColor(tenant.status)}>
                              <div className="flex items-center gap-1.5">
                                {getStatusIcon(tenant.status)}
                                <span className="capitalize">{tenant.status}</span>
                              </div>
                            </Badge>
                            <Badge variant="outline" className="border-primary/20 text-primary">
                              {tenant.plan}
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Eye className="w-4 h-4" />
                              Impersonate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="w-4 h-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Settings className="w-4 h-4" />
                              Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">MRR</p>
                          <p className="text-lg font-bold text-foreground">
                            ${tenant.mrr.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Users</p>
                          <p className="text-lg font-bold text-foreground">{tenant.users}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Campaigns</p>
                          <p className="text-lg font-bold text-foreground">{tenant.campaigns}</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-muted-foreground">Quota Usage</p>
                          <p className="text-xs font-medium">{tenant.quota}%</p>
                        </div>
                        <Progress value={tenant.quota} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border/30">
                        <p className="text-xs text-muted-foreground">Last login: {tenant.lastLogin}</p>
                        <Button size="sm" variant="outline" className="h-8">
                          Open Dashboard
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Branding Editor View */}
          {activeSection === "branding" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold mb-2">Branding & White-Label Editor</h2>
                <p className="text-muted-foreground">Customize visual identity for each tenant</p>
              </div>

              <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="bg-card/40 border border-border/30">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="typography">Typography</TabsTrigger>
                  <TabsTrigger value="domain">Custom Domain</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-border/30 bg-card/40 backdrop-blur">
                      <CardHeader>
                        <CardTitle>Logo & Assets</CardTitle>
                        <CardDescription>Upload your brand logos and favicon</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Light Mode Logo</label>
                          <div className="border-2 border-dashed border-border/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Drop logo here or click to upload</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, SVG up to 2MB</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Dark Mode Logo</label>
                          <div className="border-2 border-dashed border-border/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Drop logo here or click to upload</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, SVG up to 2MB</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Favicon</label>
                          <div className="border-2 border-dashed border-border/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Drop favicon here or click to upload</p>
                            <p className="text-xs text-muted-foreground mt-1">ICO, PNG 32x32 or 64x64</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/30 bg-card/40 backdrop-blur">
                      <CardHeader>
                        <CardTitle>Brand Settings</CardTitle>
                        <CardDescription>Configure brand identity</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Brand Name</label>
                          <Input placeholder="Your Brand Name" className="bg-background/50 border-border/30" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Tagline</label>
                          <Input placeholder="Your brand tagline" className="bg-background/50 border-border/30" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Support Email</label>
                          <Input type="email" placeholder="support@yourbrand.com" className="bg-background/50 border-border/30" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Copyright Text</label>
                          <Input placeholder="© 2024 Your Brand. All rights reserved." className="bg-background/50 border-border/30" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="colors" className="space-y-6">
                  <Card className="border-border/30 bg-card/40 backdrop-blur">
                    <CardHeader>
                      <CardTitle>Color Palette</CardTitle>
                      <CardDescription>Define your brand colors</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Primary Color</label>
                          <div className="flex gap-3">
                            <Input type="color" className="w-16 h-16 p-1 cursor-pointer" defaultValue="#6366f1" />
                            <Input placeholder="#6366f1" className="flex-1 bg-background/50 border-border/30" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Secondary Color</label>
                          <div className="flex gap-3">
                            <Input type="color" className="w-16 h-16 p-1 cursor-pointer" defaultValue="#8b5cf6" />
                            <Input placeholder="#8b5cf6" className="flex-1 bg-background/50 border-border/30" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Accent Color</label>
                          <div className="flex gap-3">
                            <Input type="color" className="w-16 h-16 p-1 cursor-pointer" defaultValue="#ec4899" />
                            <Input placeholder="#ec4899" className="flex-1 bg-background/50 border-border/30" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Background</label>
                          <div className="flex gap-3">
                            <Input type="color" className="w-16 h-16 p-1 cursor-pointer" defaultValue="#0f172a" />
                            <Input placeholder="#0f172a" className="flex-1 bg-background/50 border-border/30" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Foreground</label>
                          <div className="flex gap-3">
                            <Input type="color" className="w-16 h-16 p-1 cursor-pointer" defaultValue="#f8fafc" />
                            <Input placeholder="#f8fafc" className="flex-1 bg-background/50 border-border/30" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Muted</label>
                          <div className="flex gap-3">
                            <Input type="color" className="w-16 h-16 p-1 cursor-pointer" defaultValue="#64748b" />
                            <Input placeholder="#64748b" className="flex-1 bg-background/50 border-border/30" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="domain" className="space-y-6">
                  <Card className="border-border/30 bg-card/40 backdrop-blur">
                    <CardHeader>
                      <CardTitle>Custom Domain Setup</CardTitle>
                      <CardDescription>Configure your custom domain</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Domain Name</label>
                        <Input placeholder="yourdomain.com" className="bg-background/50 border-border/30" />
                      </div>
                      <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                        <h4 className="font-medium mb-3">DNS Configuration</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Add the following DNS records to your domain provider:
                        </p>
                        <div className="space-y-3 font-mono text-xs">
                          <div className="p-3 rounded bg-background/50 border border-border/30">
                            <div className="flex justify-between mb-1">
                              <span className="text-muted-foreground">Type:</span>
                              <span>A</span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span className="text-muted-foreground">Name:</span>
                              <span>@</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Value:</span>
                              <span>185.158.133.1</span>
                            </div>
                          </div>
                          <div className="p-3 rounded bg-background/50 border border-border/30">
                            <div className="flex justify-between mb-1">
                              <span className="text-muted-foreground">Type:</span>
                              <span>CNAME</span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span className="text-muted-foreground">Name:</span>
                              <span>www</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Value:</span>
                              <span>arcana.app</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full">Verify Domain</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preview" className="space-y-6">
                  <Card className="border-border/30 bg-card/40 backdrop-blur">
                    <CardHeader>
                      <CardTitle>Brand Preview</CardTitle>
                      <CardDescription>See how your branding looks</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video rounded-lg border-2 border-border/30 bg-background/20 flex items-center justify-center">
                        <p className="text-muted-foreground">Live preview will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Reset to Default</Button>
                <Button>Save Branding</Button>
              </div>
            </motion.div>
          )}

          {/* API & Keys View */}
          {activeSection === "api" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold mb-2">API & Developer Portal</h2>
                <p className="text-muted-foreground">Manage API keys and integrations</p>
              </div>

              <Card className="border-border/30 bg-card/40 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>API Keys</CardTitle>
                      <CardDescription>Manage your API authentication keys</CardDescription>
                    </div>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Generate New Key
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Production Key", "Development Key", "Staging Key"].map((keyName, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/30 bg-background/20"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Key className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{keyName}</p>
                            <p className="text-sm text-muted-foreground font-mono">
                              sk_live_••••••••••••••••••••••••{Math.random().toString(36).substring(7)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-success/20 text-success">
                            Active
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/30 bg-card/40 backdrop-blur">
                <CardHeader>
                  <CardTitle>API Documentation</CardTitle>
                  <CardDescription>Quick reference and examples</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-background/50 border border-border/30 font-mono text-sm space-y-2">
                    <div className="text-muted-foreground">// Authentication</div>
                    <div>curl -X GET https://api.arcana.app/v1/tenants \</div>
                    <div className="pl-4">-H "Authorization: Bearer YOUR_API_KEY"</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Placeholder for other sections */}
          {!["dashboard", "tenants", "branding", "api"].includes(activeSection) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="border-border/30 bg-card/40 backdrop-blur">
                <CardHeader>
                  <CardTitle className="capitalize">{activeSection}</CardTitle>
                  <CardDescription>This section is under development</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Coming soon...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
