import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";

const REASSURANCE_MESSAGES = [
  "✨ Nossa IA está trabalhando duro pra entregar algo incrível",
  "📸 Cada poro, cílio e fio de cabelo está sendo replicado",
  "🎨 Iluminação cinematográfica sendo aplicada agora",
  "🧠 47 pontos faciais sendo mapeados com precisão forense",
  "⚡ Resultado em 4K Ultra HD sendo renderizado",
  "💎 Você vai amar o resultado — vale cada segundo de espera",
  "🔥 Quase lá! O que parece lento agora vira foto de capa depois",
  "🎬 Aplicando profundidade de campo estilo cinema",
  "👁️ Reflexo dos olhos sendo refinado pixel por pixel",
  "🌟 Pele com textura natural — sem aquele efeito plástico",
  "🎭 Expressão facial preservada da sua foto original",
  "🏆 Renderização de nível estúdio — vale o tempo",
  "📐 Composição balanceada pela regra dos terços",
  "💫 Cor e contraste sendo equilibrados como em revistas",
  "🚀 Últimos toques — preparando download em alta",
];

interface StayOnPageCardProps {
  /** True when background photo upload finished — shows reassurance badge */
  photosReady?: boolean;
}

export const StayOnPageCard = ({ photosReady }: StayOnPageCardProps) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % REASSURANCE_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Browser-level warning if user tries to leave
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Sua imagem ainda está sendo gerada. Tem certeza que deseja sair?";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-6 rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 backdrop-blur-xl shadow-[0_0_30px_-10px_rgba(245,158,11,0.2)]"
    >
      {/* Warning header */}
      <div className="flex items-start gap-2.5 px-4 py-3 border-b border-amber-500/10">
        <div className="shrink-0 w-7 h-7 rounded-full bg-amber-500/15 flex items-center justify-center">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-amber-200/95 leading-tight">
            Não saia da página
          </p>
          <p className="text-[10px] text-amber-100/50 leading-relaxed mt-0.5">
            Se você fechar agora, perde o resultado. Vale a pena esperar — o resultado final é absurdo.
          </p>
        </div>
      </div>

      {/* Photos-ready indicator (background pre-upload feedback) */}
      <AnimatePresence>
        {photosReady && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/8 border-b border-emerald-500/10"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <p className="text-[10px] text-emerald-300/80 font-medium">
              Suas fotos já estão na nossa nuvem — só falta a IA
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rotating reassurance */}
      <div className="px-4 py-3 min-h-[44px] flex items-center gap-2">
        <Sparkles className="w-3 h-3 text-primary/60 shrink-0" />
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4 }}
            className="text-[11px] text-foreground/70 font-medium leading-relaxed"
          >
            {REASSURANCE_MESSAGES[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
