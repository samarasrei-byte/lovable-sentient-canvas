import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como funciona o marketplace de talentos?",
    answer: "Nosso marketplace conecta marcas a influenciadores reais, artistas digitais e avatares IA. Você pode navegar por categorias, ver métricas de engajamento e contratar diretamente pela plataforma."
  },
  {
    question: "O que são avatares IA?",
    answer: "Avatares IA são representações virtuais geradas por inteligência artificial que podem criar conteúdo, apresentar produtos e interagir de forma similar a influenciadores humanos, com custos reduzidos e disponibilidade 24/7."
  },
  {
    question: "Como funciona a geração de imagens?",
    answer: "Nossa IA cria imagens profissionais combinando seu produto com templates de influenciadores. Você escolhe o estilo, personaliza características e gera até 4 variações em segundos."
  },
  {
    question: "Qual a diferença entre os planos Basic e Pro?",
    answer: "O plano Basic oferece criação de imagens estáticas e acesso ao marketplace. O Pro adiciona animação de imagens com IA, mais créditos mensais, templates exclusivos e suporte prioritário."
  },
  {
    question: "Posso testar antes de assinar?",
    answer: "Sim! Oferecemos 5 gerações gratuitas por dia sem cadastro. Para acesso completo, você pode iniciar um trial de 7 dias grátis em qualquer plano."
  },
  {
    question: "Como funciona o pagamento?",
    answer: "Aceitamos cartões de crédito e PIX. A cobrança é mensal e você pode cancelar a qualquer momento sem multas ou taxas adicionais."
  },
];

export const FAQSection = () => {
  return (
    <section className="relative py-20 md:py-28 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground/60 text-base font-light">
            Tudo o que você precisa saber
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-white/[0.04] last:border-0"
                >
                  <AccordionTrigger className="text-left text-foreground/90 hover:text-primary py-4 text-sm font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground/70 text-sm leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
