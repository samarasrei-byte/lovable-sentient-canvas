import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { question: "Como funciona a geração de fotos com IA?", answer: "Você escolhe um prompt (estilo), envia sua foto, paga via PIX e em menos de 60 segundos recebe sua imagem gerada por IA com qualidade profissional." },
  { question: "Preciso criar conta para usar?", answer: "Não! Você pode comprar prompts avulsos sem cadastro. Basta escolher o estilo, enviar sua foto, pagar via PIX e pronto. Para planos mensais, é necessário criar uma conta." },
  { question: "Quais formas de pagamento são aceitas?", answer: "Aceitamos PIX (pagamento instantâneo). O PIX é processado em segundos e sua foto é gerada imediatamente após a confirmação." },
  { question: "A qualidade é realmente profissional?", answer: "Sim! Nossos prompts são testados e otimizados para gerar imagens com qualidade de estúdio fotográfico, com avaliação média de 4.9/5." },
  { question: "Posso usar as fotos comercialmente?", answer: "Sim! Todas as fotos geradas são 100% suas. Use como quiser: redes sociais, LinkedIn, materiais de marketing, sites, etc. Sem restrições de uso." },
  { question: "Qual a diferença entre prompt avulso e plano mensal?", answer: "O prompt avulso custa R$21 por foto. Nos planos mensais, o custo por foto é menor. Além disso, planos incluem acesso a todos os estilos e suporte prioritário." },
];

export const FAQSection = () => {
  return (
    <section className="py-16 md:py-28 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-2">
            Perguntas frequentes
          </h2>
          <p className="text-sm text-muted-foreground/40 font-light">
            Tudo o que você precisa saber
          </p>
        </div>

        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4 md:p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-white/[0.04] last:border-0"
              >
                <AccordionTrigger className="text-left text-foreground/80 hover:text-primary py-4 text-xs font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground/60 text-xs leading-relaxed pb-4">
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
