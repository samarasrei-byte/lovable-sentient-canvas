import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";
import { usePageMeta } from "@/hooks/use-page-meta";

const TermosDeUso = () => {
  usePageMeta({
    title: "Termos de Uso | ARCANA",
    description: "Termos de uso da plataforma ARCANA — direitos, deveres e regras do serviço de geração de fotos com IA.",
  });
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/10">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold tracking-tight">Termos de Uso</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-12 space-y-8">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">1. Aceitação dos Termos</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ao acessar e utilizar a plataforma Arcana ("Plataforma"), você concorda com estes Termos de Uso. 
            Caso não concorde com qualquer disposição, solicitamos que não utilize nossos serviços.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">2. Descrição dos Serviços</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A Arcana é uma plataforma de geração de imagens por inteligência artificial. Nossos serviços incluem:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Geração de imagens personalizadas via prompts de IA</li>
            <li>Marketplace de templates e prompts criativos</li>
            <li>Edição e exportação de imagens geradas</li>
            <li>Serviços de fotografia profissional com IA</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">3. Cadastro e Conta</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Para utilizar determinados serviços, pode ser necessário fornecer informações pessoais como nome, 
            e-mail e WhatsApp. Você é responsável pela veracidade das informações fornecidas.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">4. Pagamentos e Reembolsos</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Os pagamentos são processados via PIX através do Mercado Pago. Após a confirmação do pagamento, 
            a geração da imagem é iniciada automaticamente. Cada compra inclui até 2 variações gratuitas e 
            1 edição caso o resultado não atenda às expectativas. Reembolsos são analisados caso a caso 
            em situações de falha técnica comprovada.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">5. Propriedade Intelectual</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            As imagens geradas pela plataforma pertencem 100% ao usuário que as criou. 
            A Arcana não reivindica nenhum direito sobre o conteúdo gerado. O usuário é livre 
            para usar, compartilhar e comercializar suas criações sem restrições.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">6. Uso Aceitável</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">É proibido utilizar a plataforma para:</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Gerar conteúdo ilegal, ofensivo, discriminatório ou que viole direitos de terceiros</li>
            <li>Criar deepfakes não-consentidos ou conteúdo que cause danos à reputação de terceiros</li>
            <li>Tentar burlar os sistemas de segurança ou pagamento da plataforma</li>
            <li>Revender acesso à plataforma sem autorização prévia</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">7. Limitação de Responsabilidade</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A Arcana utiliza modelos de IA de última geração, mas não garante resultados perfeitos em todas 
            as gerações. Os resultados podem variar conforme a qualidade das fotos enviadas e a complexidade 
            do prompt. A plataforma não se responsabiliza por uso indevido do conteúdo gerado pelo usuário.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">8. Modificações</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A Arcana reserva-se o direito de modificar estes Termos a qualquer momento. 
            As alterações entram em vigor imediatamente após a publicação. O uso continuado 
            da plataforma constitui aceitação dos termos atualizados.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">9. Contato</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dúvidas sobre estes Termos podem ser enviadas para nosso suporte via WhatsApp 
            ou e-mail disponível na plataforma.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermosDeUso;
