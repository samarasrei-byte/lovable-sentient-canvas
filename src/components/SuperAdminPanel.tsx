import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassButton } from "@/components/ui/glass-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Image, 
  Camera, 
  Users, 
  Palette, 
  UserCircle, 
  Settings2,
  Upload,
  Trash2,
  Edit,
  Save,
  Key,
  Coins,
  Crown,
  Activity,
  AlertCircle,
  TrendingUp,
  Server,
  Zap,
  BarChart3,
  ShieldAlert,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  category: string;
  prompt: string;
  image: string;
  tags: string[];
  credits: number;
  active: boolean;
}

// Mock data
const mockProductTemplates: Template[] = [
  { id: "1", name: "Mockup Premium", category: "E-commerce", prompt: "Product photography, white background, studio lighting...", image: "/placeholder.svg", tags: ["Clean", "3D"], credits: 2, active: true },
  { id: "2", name: "Cenário Lifestyle", category: "Lifestyle", prompt: "Lifestyle product shot, natural lighting...", image: "/placeholder.svg", tags: ["Natural", "Warm"], credits: 3, active: true },
];

const mockPhotoTemplates: Template[] = [
  { id: "3", name: "Studio Fashion", category: "Moda", prompt: "Fashion photography, professional model pose...", image: "/placeholder.svg", tags: ["Fashion", "Studio"], credits: 4, active: true },
];

export const SuperAdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [productTemplates, setProductTemplates] = useState(mockProductTemplates);
  const [photoTemplates, setPhotoTemplates] = useState(mockPhotoTemplates);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Stats from DB
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCirculatingCredits: 0,
    totalImagesGenerated: 0,
    apiStatus: { banana: 'online', cling: 'online', replicate: 'online' }
  });

  // Settings state
  const [settings, setSettings] = useState({
    bananaApiKey: "sk-***************",
    clingApiKey: "ck-***************",
    basicCredits: 120,
    proCredits: 400,
    basicPrice: 55,
    proPrice: 220,
  });

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      // Fetch stats from our new view
      const { data: statsData, error: statsError } = await supabase
        .from('admin_credit_stats' as any)
        .select('*');
      
      const firstRow = statsData?.[0] as any;
      if (firstRow) {
        setStats(prev => ({
          ...prev,
          totalUsers: firstRow.total_users || 0,
          totalCirculatingCredits: firstRow.total_circulating_credits || 0,
          totalImagesGenerated: firstRow.total_images_generated || 0
        }));
      }

      // Fetch config
      const { data: configData } = await supabase
        .from('system_config')
        .select('*');
      
      if (configData) {
        const creditSettings = configData.find(c => c.key === 'credit_settings')?.value as any;
        const apiStatus = configData.find(c => c.key === 'api_status')?.value as any;

        if (creditSettings) {
          setSettings(prev => ({
            ...prev,
            basicCredits: creditSettings.basic_plan_credits,
            proCredits: creditSettings.pro_plan_credits,
            basicPrice: creditSettings.basic_price_cents / 100,
            proPrice: creditSettings.pro_price_cents / 100,
          }));
        }
        if (apiStatus) {
          setStats(prev => ({ ...prev, apiStatus }));
        }
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const { error } = await supabase
        .from('system_config')
        .update({
          value: {
            basic_plan_credits: settings.basicCredits,
            pro_plan_credits: settings.proCredits,
            basic_price_cents: settings.basicPrice * 100,
            pro_price_cents: settings.proPrice * 100,
          }
        })
        .eq('key', 'credit_settings');

      if (error) throw error;
      toast.success("Configurações salvas no banco de dados!");
    } catch (error: any) {
      toast.error("Erro ao salvar: " + error.message);
    }
  };

  return (
    <div className="p-6 space-y-8 bg-[#09090B] min-h-screen text-white font-sans selection:bg-primary/30">
      {/* Header with Hud Effect */}
      <div className="relative group p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest">Enterprise Mode</Badge>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Operational</span>
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent uppercase italic tracking-tighter leading-tight">
              Arcana <span className="text-primary italic">Auditor</span>
            </h1>
            <p className="text-white/50 mt-1 font-medium max-w-xl">
              Monitoramento heurístico de infraestrutura, balanceamento de créditos e auditoria de modelos generativos.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">System Load</p>
              <div className="flex items-center gap-2">
                 <div className="w-32 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "24%" }}
                      className="h-full bg-gradient-to-r from-primary to-cyan-400" 
                    />
                 </div>
                 <span className="text-xs font-black text-white/70">24%</span>
              </div>
            </div>
            <GlassButton variant="outline" size="icon" onClick={fetchSystemData} className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10">
              <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Stats - Augmented for Data Science visibility */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Circulante", value: stats.totalCirculatingCredits, icon: Coins, color: "text-primary", bg: "bg-primary/10" },
          { label: "Gerações", value: stats.totalImagesGenerated, icon: Image, color: "text-cyan-400", bg: "bg-cyan-400/10" },
          { label: "Ativos", value: stats.totalUsers, icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
          { label: "Burn Rate", value: "4.2 c/h", icon: Activity, color: "text-yellow-500", bg: "bg-yellow-500/10" }
        ].map((stat, i) => (
          <Card key={i} className="bg-white/[0.03] border-white/5 backdrop-blur-xl group hover:bg-white/[0.05] transition-all rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 flex items-center gap-6">
              <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl", stat.bg)}>
                <stat.icon className={cn("w-8 h-8", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-4xl font-black tracking-tighter text-white">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex items-center justify-start gap-4 h-auto bg-transparent p-0 border-b border-white/5 w-full pb-6">
          <TabsTrigger value="dashboard" className="rounded-2xl px-8 py-4 data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase tracking-widest text-[11px] gap-3 border border-white/5 transition-all">
            <BarChart3 className="w-5 h-5" />
            Infraestrutura
          </TabsTrigger>
          <TabsTrigger value="products" className="rounded-2xl px-8 py-4 data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase tracking-widest text-[11px] gap-3 border border-white/5 transition-all">
            <Zap className="w-5 h-5" />
            Templates IA
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-2xl px-8 py-4 data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase tracking-widest text-[11px] gap-3 border border-white/5 transition-all">
            <Settings2 className="w-5 h-5" />
            Sistemas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-10 space-y-8 outline-none focus:ring-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* API Health Monitor */}
            <Card className="lg:col-span-2 bg-white/[0.02] border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
              <CardHeader className="p-10 border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase italic tracking-tighter text-white">
                      <Server className="w-6 h-6 text-primary" />
                      Neural Cloud Status
                    </CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-white/30 mt-2">Health-check em tempo real dos motores de renderização</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-white/5">
                    {Object.entries(stats.apiStatus).map(([name, status]) => (
                      <div key={name} className="flex items-center justify-between p-10 hover:bg-white/[0.01] transition-colors group">
                        <div className="flex items-center gap-6">
                           <div className={cn("w-4 h-4 rounded-full shadow-[0_0_20px]", status === 'online' ? 'bg-green-400 shadow-green-400/50' : 'bg-red-400 shadow-red-400/50')} />
                           <div>
                              <span className="font-black uppercase tracking-widest text-base block mb-0.5">{name} ENGINE</span>
                              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">ID: {name.toUpperCase()}_NODE_01</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-12">
                           <div className="text-right">
                              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Latency</p>
                              <p className="text-sm font-black text-white/80">{(Math.random() * 200 + 100).toFixed(0)}ms</p>
                           </div>
                           <Badge className={cn("rounded-xl border-none px-6 py-2 font-black text-[10px] uppercase tracking-widest shadow-2xl", status === 'online' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400')}>
                             {status === 'online' ? 'Operational' : 'Critical Failure'}
                           </Badge>
                        </div>
                      </div>
                    ))}
                 </div>
              </CardContent>
            </Card>

            {/* Critical Alerts Dashboard */}
            <Card className="bg-red-500/5 border-red-500/20 backdrop-blur-xl rounded-[2.5rem] p-4">
               <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-red-400 flex items-center gap-3 text-xl font-black uppercase italic tracking-tighter">
                    <ShieldAlert className="w-6 h-6" />
                    Neural Alerts
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6 p-8 pt-0">
                  <div className="p-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex flex-col gap-4 group hover:bg-red-500/20 transition-all">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">Critical API Balance</p>
                        <p className="text-sm text-red-100/60 leading-relaxed font-medium">O pool de créditos do Banana.dev atingiu o limite crítico (9%).</p>
                     </div>
                     <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest h-12 shadow-xl shadow-red-500/20">
                        Top-up Credits
                     </Button>
                  </div>
                  
                  <div className="p-6 rounded-[2rem] bg-yellow-500/5 border border-yellow-500/10 flex flex-col gap-4">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-yellow-500 mb-1">Anomalous Spike</p>
                        <p className="text-sm text-yellow-100/60 leading-relaxed font-medium">Detectado volume de 420 req/min no módulo Mesversário.</p>
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="mt-10">
          <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-10 flex flex-row items-center justify-between border-b border-white/5">
              <div>
                <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">Templates de Produtos</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-white/30">Gerencie os ativos neurais para e-commerce</CardDescription>
              </div>
              <Button className="gap-3 rounded-2xl bg-primary hover:bg-primary/80 h-12 px-6 font-black uppercase tracking-widest text-[10px]">
                <Plus className="w-4 h-4" />
                Novo Template
              </Button>
            </CardHeader>
            <CardContent className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {productTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden bg-white/5 border-white/5 rounded-[2rem] group">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={template.image} alt={template.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <Badge className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border-none rounded-full px-4 py-1 font-black text-[10px] uppercase tracking-widest">{template.credits} CRÉDITOS</Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-black uppercase tracking-tight text-lg italic">{template.name}</h3>
                        <Switch checked={template.active} />
                      </div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">{template.category}</p>
                      <div className="flex gap-2 mb-6">
                        {template.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-[9px] font-black uppercase tracking-widest border-white/10 rounded-full px-3">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="flex-1 gap-2 rounded-xl h-10 font-black uppercase text-[10px] border-white/5 hover:bg-white/5">
                          <Edit className="w-3 h-3" />
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm" className="gap-2 rounded-xl h-10 w-10 p-0 border-none bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-10 outline-none focus:ring-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-10 border-b border-white/5">
                <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase italic tracking-tighter text-white">
                  <Key className="w-6 h-6 text-primary" />
                  API Gateways
                </CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-white/30">Chaves de acesso aos motores neurais</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Banana.dev Engine Key</Label>
                  <Input 
                    type="password" 
                    className="bg-white/5 border-white/10 rounded-2xl h-14 font-medium"
                    value={settings.bananaApiKey}
                    onChange={(e) => setSettings({...settings, bananaApiKey: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Cling AI Pipeline Key</Label>
                  <Input 
                    type="password" 
                    className="bg-white/5 border-white/10 rounded-2xl h-14 font-medium"
                    value={settings.clingApiKey}
                    onChange={(e) => setSettings({...settings, clingApiKey: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-10 border-b border-white/5">
                <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase italic tracking-tighter text-white">
                  <Crown className="w-6 h-6 text-primary" />
                  Ecosystem Pricing
                </CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-white/30">Configuração global de planos e créditos</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-10">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Basic Credits</Label>
                    <Input 
                      type="number" 
                      className="bg-white/5 border-white/10 rounded-2xl h-14 font-black text-xl"
                      value={settings.basicCredits}
                      onChange={(e) => setSettings({...settings, basicCredits: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Price (R$)</Label>
                    <Input 
                      type="number" 
                      className="bg-white/5 border-white/10 rounded-2xl h-14 font-black text-xl"
                      value={settings.basicPrice}
                      onChange={(e) => setSettings({...settings, basicPrice: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Pro Credits</Label>
                    <Input 
                      type="number" 
                      className="bg-white/5 border-white/10 rounded-2xl h-14 font-black text-xl text-primary"
                      value={settings.proCredits}
                      onChange={(e) => setSettings({...settings, proCredits: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Price (R$)</Label>
                    <Input 
                      type="number" 
                      className="bg-white/5 border-white/10 rounded-2xl h-14 font-black text-xl text-primary"
                      value={settings.proPrice}
                      onChange={(e) => setSettings({...settings, proPrice: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end pt-10">
            <GlassButton onClick={handleSaveSettings} className="h-16 px-12 bg-primary hover:bg-primary/80 text-white font-black rounded-[1.5rem] gap-3 uppercase tracking-widest shadow-2xl shadow-primary/20">
              <Save className="w-5 h-5" />
              Commit System Changes
            </GlassButton>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};