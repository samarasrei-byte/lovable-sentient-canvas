import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/10">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold tracking-tight">Política de Privacidade</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-12 space-y-8">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">1. Introdução</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A Arcana valoriza a privacidade dos seus usuários. Esta Política de Privacidade descreve como coletamos, 
            usamos, armazenamos e protegemos suas informações pessoais ao utilizar nossa plataforma.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">2. Dados Coletados</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Coletamos os seguintes dados:</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li><strong>Dados de identificação:</strong> Nome, e-mail, WhatsApp e Instagram (quando fornecidos)</li>
            <li><strong>Fotos enviadas:</strong> Imagens de referência para geração de conteúdo personalizado</li>
            <li><strong>Dados de pagamento:</strong> Processados exclusivamente pelo Mercado Pago — não armazenamos dados de cartão</li>
            <li><strong>Dados de uso:</strong> Interações com a plataforma, prompts utilizados e imagens geradas</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">3. Finalidade do Uso dos Dados</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Seus dados são utilizados para:</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Processar e entregar as imagens geradas</li>
            <li>Enviar notificações sobre o status das suas gerações</li>
            <li>Melhorar a qualidade dos nossos serviços e modelos de IA</li>
            <li>Comunicação sobre novos recursos e promoções (com consentimento)</li>
            <li>Cumprir obrigações legais e regulatórias</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">4. Armazenamento e Segurança</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Seus dados são armazenados em servidores seguros com criptografia em trânsito e em repouso. 
            As fotos enviadas são processadas exclusivamente para a geração solicitada. 
            Utilizamos políticas de acesso restrito (Row Level Security) para garantir que apenas 
            você tenha acesso aos seus dados e conteúdo gerado.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">5. Compartilhamento de Dados</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li><strong>Mercado Pago:</strong> Para processamento de pagamentos</li>
            <li><strong>Provedores de IA:</strong> Dados técnicos necessários para geração de imagens (sem identificação pessoal)</li>
            <li><strong>Obrigação legal:</strong> Quando exigido por lei ou ordem judicial</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">6. Seus Direitos (LGPD)</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Acessar seus dados pessoais armazenados</li>
            <li>Solicitar correção de dados incompletos ou incorretos</li>
            <li>Solicitar exclusão dos seus dados pessoais</li>
            <li>Revogar consentimento para uso dos dados</li>
            <li>Solicitar portabilidade dos dados</li>
            <li>Ser informado sobre com quem seus dados são compartilhados</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">7. Cookies e Tecnologias de Rastreamento</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Utilizamos cookies essenciais para o funcionamento da plataforma e autenticação de sessão. 
            Não utilizamos cookies de rastreamento publicitário de terceiros.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">8. Retenção de Dados</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Seus dados são mantidos enquanto sua conta estiver ativa ou conforme necessário para cumprir 
            obrigações legais. Fotos de referência enviadas para geração podem ser excluídas após o 
            processamento, mediante solicitação.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">9. Alterações nesta Política</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas 
            através da plataforma. A continuidade do uso após alterações constitui aceitação da política atualizada.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">10. Contato do Encarregado (DPO)</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento dos seus dados, 
            entre em contato conosco através do WhatsApp ou e-mail disponível na plataforma.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PoliticaPrivacidade;
