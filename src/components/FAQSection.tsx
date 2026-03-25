import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { question: "Como funciona a geração de fotos com IA?", answer: "Você escolhe um prompt (estilo), envia sua foto, paga via PIX e em menos de 60 segundos recebe sua imagem gerada por IA com qualidade profissional." },
  { question: "Preciso criar conta para usar?", answer: "Não! Você pode comprar prompts avulsos sem cadastro. Basta escolher o estilo, enviar sua foto, pagar via PIX e pronto. Para planos mensais, é necessário criar uma conta." },
  { question: "Quais formas de pagamento são aceitas?", answer: "Aceitamos PIX (pagamento instantâneo) e cartão de crédito. O PIX é processado em segundos e sua foto é gerada imediatamente após a confirmação." },
  { question: "A qualidade é realmente profissional?", answer: "Sim! Nossos prompts são testados e otimizados para gerar imagens com qualidade de estúdio fotográfico. São mais de 47.000 fotos geradas com avaliação média de 4.9/5." },
  { question: "Posso usar as fotos comercialmente?", answer: "Sim! Todas as fotos geradas são 100% suas. Use como quiser: redes sociais, LinkedIn, materiais de marketing, sites, etc. Sem restrições de uso." },
  { question: "Qual a diferença entre prompt avulso e plano mensal?", answer: "O prompt avulso custa R$21 por foto. Nos planos mensais, o custo por foto é menor — o Starter sai por ~R$17/foto. Além disso, planos incluem acesso a todos os estilos e suporte prioritário." },
];

export const FAQSection = () => {
  return (
    <section className="relative py-20 md:py-28 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground/60 text-base font-light">
            Tudo o que você precisa saber
          </p>
        </div>

        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-6">
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
      </div>
    </section>
  );
};
