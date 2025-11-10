import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Talentos() {
  const talents = [
    { name: "Ana Silva", category: "Fashion", followers: "500K", engagement: "8.5%" },
    { name: "Pedro Costa", category: "Tech", followers: "320K", engagement: "7.2%" },
    { name: "Maria Santos", category: "Wellness", followers: "890K", engagement: "9.1%" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-4">Talentos</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input className="pl-10" placeholder="Buscar influenciadores..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {talents.map((talent, i) => (
          <div key={i} className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-card/40 transition-all">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-center text-foreground mb-1">{talent.name}</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">{talent.category}</p>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Seguidores: {talent.followers}</span>
              <span className="text-primary">Eng: {talent.engagement}</span>
            </div>
            <Button className="w-full" variant="outline">Ver Perfil</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
