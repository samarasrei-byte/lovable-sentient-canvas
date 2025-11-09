import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

export const OnboardingQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: "Qual é o principal objetivo da sua marca?",
      options: [
        { value: "awareness", label: "Aumentar reconhecimento de marca" },
        { value: "sales", label: "Impulsionar vendas diretas" },
        { value: "engagement", label: "Criar engajamento e comunidade" },
        { value: "launch", label: "Lançar novo produto/serviço" }
      ]
    },
    {
      question: "Qual é o público-alvo principal?",
      options: [
        { value: "genz", label: "Gen Z (18-24 anos)" },
        { value: "millennials", label: "Millennials (25-40 anos)" },
        { value: "genx", label: "Gen X (41-56 anos)" },
        { value: "diverse", label: "Múltiplas gerações" }
      ]
    },
    {
      question: "Qual estilo de conteúdo ressoa com sua marca?",
      options: [
        { value: "authentic", label: "Autêntico e espontâneo" },
        { value: "polished", label: "Polido e profissional" },
        { value: "creative", label: "Criativo e artístico" },
        { value: "innovative", label: "Inovador e tecnológico" }
      ]
    }
  ];

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [step]: value });
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  const getRecommendation = () => {
    const objective = answers[0];
    const style = answers[2];

    if (objective === "sales" || objective === "launch") {
      return {
        type: "Influenciadores Reais + Live Shop",
        description: "Perfeito para gerar conversões imediatas. Combine influenciadores autênticos com transmissões ao vivo para maximizar vendas.",
        cta: "Explorar Influenciadores"
      };
    } else if (style === "innovative" || style === "creative") {
      return {
        type: "Avatares Digitais",
        description: "Ideal para marcas que querem inovar. Avatares digitais criam experiências únicas e memoráveis com total controle criativo.",
        cta: "Conhecer Avatares"
      };
    } else {
      return {
        type: "Consultoria Estratégica",
        description: "Recomendamos uma abordagem híbrida. Nossa consultoria pode criar a estratégia perfeita combinando influenciadores reais e avatares.",
        cta: "Falar com Consultor"
      };
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setShowResult(false);
  };

  if (showResult) {
    const recommendation = getRecommendation();
    return (
      <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-3xl mx-auto">
          <Card className="border-primary/20 shadow-2xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl mb-4">Recomendação Personalizada</CardTitle>
              <CardDescription className="text-lg">
                Baseado no perfil da sua marca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-8 bg-gradient-to-br from-card to-card/50 rounded-lg">
                <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {recommendation.type}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {recommendation.description}
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={restart}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Refazer diagnóstico
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform"
                >
                  {recommendation.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Descubra o criador ideal para sua marca
          </h2>
          <p className="text-lg text-muted-foreground">
            Responda 3 perguntas rápidas e receba uma recomendação personalizada
          </p>
        </div>

        <Card className="border-primary/20 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                Pergunta {step + 1} de {questions.length}
              </span>
              <div className="flex gap-2">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 w-12 rounded-full transition-all ${
                      idx <= step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
            <CardTitle className="text-2xl">{questions[step].question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {questions[step].options.map((option) => (
              <Button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                variant="outline"
                className="w-full justify-start text-left h-auto py-4 hover:border-primary hover:bg-primary/5 transition-all"
              >
                {option.label}
              </Button>
            ))}
            
            {step > 0 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="ghost"
                className="w-full mt-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
