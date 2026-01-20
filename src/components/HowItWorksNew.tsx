import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MousePointer2, 
  Upload, 
  Sliders, 
  Sparkles, 
  Download,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Escolha o template",
    description: "Navegue pelo marketplace e selecione o template perfeito para sua criação",
    icon: MousePointer2,
    color: "from-primary to-primary/50",
  },
  {
    number: "02",
    title: "Envie sua foto ou produto",
    description: "Faça upload da imagem do seu produto ou sua foto para personalização",
    icon: Upload,
    color: "from-secondary to-secondary/50",
  },
  {
    number: "03",
    title: "Personalize com poucos cliques",
    description: "Ajuste cores, adicione logo, escolha cenários e personalize conforme sua marca",
    icon: Sliders,
    color: "from-accent to-accent/50",
  },
  {
    number: "04",
    title: "Gere com IA",
    description: "Nossa IA processa sua criação e gera até 4 variações incríveis em segundos",
    icon: Sparkles,
    color: "from-success to-success/50",
  },
  {
    number: "05",
    title: "Baixe ou anime",
    description: "Salve suas criações em alta qualidade ou anime no painel (Plano PRO)",
    icon: Download,
    color: "from-artist to-artist/50",
  },
];

export const HowItWorksNew = () => {
  return (
    <section id="como-funciona" className="py-20 px-4 md:px-6 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-secondary/10 border-secondary/30 text-secondary">
            Como Funciona
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Crie em <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">5 passos simples</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Do template à criação final em minutos. Sem conhecimento técnico necessário.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent -translate-y-1/2 opacity-20" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    {/* Step Number */}
                    <div className="relative inline-flex mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <step.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs font-bold text-primary">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Arrow - Mobile/Tablet */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-4 lg:hidden">
                    <ArrowRight className="w-6 h-6 text-muted-foreground/50 rotate-90 md:rotate-0" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
