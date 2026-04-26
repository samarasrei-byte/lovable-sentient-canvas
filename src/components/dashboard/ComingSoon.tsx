import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  FileText, 
  Users, 
  Sparkles, 
  Rocket,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";

export const ComingSoon = () => {
  const features = [
    { 
      icon: Video, 
      label: "Vídeos com IA", 
      desc: "Transforme suas fotos em vídeos cinematográficos de 5 segundos.",
      category: "Vídeos"
    },
    { 
      icon: FileText, 
      label: "Flyers de Aniversário", 
      desc: "Crie convites e artes para festas usando o rosto do seu filho.",
      category: "Design"
    },
    { 
      icon: Users, 
      label: "Fotos em Família", 
      desc: "Gere retratos de toda a família junta em cenários mágicos.",
      category: "Retratos"
    },
  ];

  return (
    <div className="space-y-8 p-4 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Em Breve no Arcana
        </h2>
        <p className="text-muted-foreground">Estamos construindo o futuro da fotografia assistida por IA.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="relative h-full p-6 border-border/20 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <Lock className="w-4 h-4 text-muted-foreground/30" />
              </div>
              
              <div className="p-3 rounded-2xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              
              <Badge variant="outline" className="mb-2 border-primary/20 text-primary text-[10px]">
                {f.category}
              </Badge>
              
              <h3 className="text-lg font-bold mb-2">{f.label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              
              <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-wider">
                <Rocket className="w-3 h-3" />
                Lançamento em breve
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-8 border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl text-center">
        <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Quer ser o primeiro a testar?</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
          Assinantes Pro terão acesso antecipado a todas as novas ferramentas assim que forem lançadas.
        </p>
        <Badge className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold">
          Acesso Prioritário para Membros PRO
        </Badge>
      </Card>
    </div>
  );
};
