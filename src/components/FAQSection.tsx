import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como funciona o marketplace de talentos?",
    answer: "Nosso marketplace conecta marcas a influenciadores reais, artistas e avatares IA. Você pode buscar por categoria, nicho, número de seguidores e taxa de engajamento. Após encontrar o talento ideal, basta iniciar uma campanha diretamente pela plataforma."
  },
  {
    question: "Qual a diferença entre influencers reais e avatares IA?",
    answer: "Influencers reais são pessoas verificadas com audiência orgânica. Avatares IA são personagens virtuais gerados por inteligência artificial, ideais para campanhas onde você precisa de controle total sobre a imagem e mensagem, disponibilidade 24/7 e custos previsíveis."
  },
  {
    question: "Quanto custa usar a plataforma?",
    answer: "Oferecemos planos a partir de R$ 55/mês (Basic) com 120 créditos. O plano PRO (R$ 220/mês) inclui 400 créditos e recursos avançados como animação de imagens. Você pode testar grátis por 7 dias em qualquer plano."
  },
  {
    question: "Os créditos expiram?",
    answer: "Os créditos são renovados mensalmente conforme seu plano. Créditos não utilizados não acumulam para o próximo mês, então recomendamos usar seu limite para maximizar o valor da sua assinatura."
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim! Não há fidelidade ou multa por cancelamento. Você pode cancelar sua assinatura a qualquer momento e continuar usando até o fim do período pago."
  },
  {
    question: "Como funciona a geração de imagens com IA?",
    answer: "Você escolhe um template, faz upload do seu produto ou logo, personaliza as características (cenário, cores, estilo) e nossa IA gera até 4 variações profissionais em segundos. No plano PRO, você também pode animar as imagens."
  },
  {
    question: "Os influenciadores são verificados?",
    answer: "Sim, todos os influenciadores passam por um processo de verificação que inclui análise de autenticidade de seguidores, taxa de engajamento real e histórico de campanhas. Garantimos que você trabalha apenas com criadores genuínos."
  },
  {
    question: "Vocês oferecem suporte?",
    answer: "Sim! Oferecemos suporte por chat em horário comercial para todos os planos. Clientes PRO têm acesso a suporte prioritário com tempo de resposta reduzido e consultoria estratégica para campanhas."
  }
];

export const FAQSection = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/3 to-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/2 -left-48 w-72 h-72 bg-secondary/5 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 -right-48 w-72 h-72 bg-primary/5 rounded-full blur-[150px]" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Perguntas Frequentes</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Dúvidas?{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Respondemos
            </span>
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            Encontre respostas para as perguntas mais comuns sobre nossa plataforma.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard className="p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b border-white/10 last:border-0">
                  <AccordionTrigger className="text-left text-base font-medium py-5 hover:text-primary transition-colors [&[data-state=open]>svg]:rotate-180">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
