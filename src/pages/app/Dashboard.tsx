import { Users, TrendingUp, DollarSign, Activity } from "lucide-react";

const TopBar = ({ title }: { title: string }) => (
  <div className="mb-6">
    <h1 className="text-3xl font-bold text-foreground">{title}</h1>
  </div>
);

const StatCard = ({ icon: Icon, label, value, trend }: any) => (
  <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-card/40 transition-all">
    <div className="flex items-center justify-between mb-4">
      <Icon className="w-8 h-8 text-primary" />
      {trend && <span className="text-sm text-green-500">{trend}</span>}
    </div>
    <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

export default function Dashboard() {
  return (
    <div className="p-6">
      <TopBar title="Dashboard" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} label="Talentos Ativos" value="142" trend="+12%" />
        <StatCard icon={Activity} label="Campanhas Ativas" value="23" trend="+8%" />
        <StatCard icon={TrendingUp} label="Engajamento Total" value="1.2M" trend="+24%" />
        <StatCard icon={DollarSign} label="ROI Médio" value="340%" trend="+18%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Campanhas Recentes</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div>
                  <div className="font-medium text-foreground">Campanha {i}</div>
                  <div className="text-sm text-muted-foreground">Ativa</div>
                </div>
                <div className="text-primary font-semibold">+{20 + i * 5}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Talentos</h3>
          <div className="space-y-3">
            {["Ana Silva", "Pedro Costa", "Maria Santos"].map((name, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary" />
                  <div>
                    <div className="font-medium text-foreground">{name}</div>
                    <div className="text-sm text-muted-foreground">Influenciador</div>
                  </div>
                </div>
                <div className="text-sm text-primary">Ver perfil</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
