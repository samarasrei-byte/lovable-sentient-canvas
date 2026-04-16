import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Sparkles, Eye, Shield, Palette, Scan, Wand2, Zap, Brain, Camera, Fingerprint } from "lucide-react";

interface ProgressStep {
  label: string;
  detail: string;
  icon: React.ReactNode;
  duration: number;
}

interface GenerationProgressBarProps {
  isGenerating: boolean;
  qaStatus?: 'idle' | 'checking' | 'passed' | 'fixing';
  photoCount?: number;
}

const getSteps = (photoCount: number): ProgressStep[] => [
  { 
    label: "Recebendo foto", 
    detail: "Upload seguro via criptografia TLS",
    icon: <Camera className="w-4 h-4" />, 
    duration: 2 
  },
  { 
    label: photoCount > 1 ? `Mapeando ${photoCount} rostos` : "Mapeando traços faciais", 
    detail: photoCount > 1 ? "Identificando cada pessoa separadamente" : "Analisando 47 pontos faciais únicos",
    icon: <Fingerprint className="w-4 h-4" />, 
    duration: 4 
  },
  { 
    label: "Clonando identidade", 
    detail: "Transferindo cada detalhe do rosto com precisão forense",
    icon: <Brain className="w-4 h-4" />, 
    duration: 6 
  },
  { 
    label: "Construindo cenário 4K", 
    detail: "Iluminação cinematográfica + composição profissional",
    icon: <Palette className="w-4 h-4" />, 
    duration: 10 
  },
  { 
    label: "Renderização neural", 
    detail: "Fusão de identidade + cenário em ultra-resolução",
    icon: <Zap className="w-4 h-4" />, 
    duration: 8 
  },
  { 
    label: "Auditoria de fidelidade", 
    detail: "Verificando se o rosto está 100% fiel à foto original",
    icon: <Shield className="w-4 h-4" />, 
    duration: 5 
  },
  { 
    label: "Retoques finais", 
    detail: "Micro-detalhes: poros, fios de cabelo, reflexo nos olhos",
    icon: <Sparkles className="w-4 h-4" />, 
    duration: 3 
  },
];

export const GenerationProgressBar = ({ isGenerating, qaStatus = 'idle', photoCount = 1 }: GenerationProgressBarProps) => {
  const steps = getSteps(photoCount);
  const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);
  const [elapsed, setElapsed] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isGenerating) {
      setElapsed(0);
      setCurrentStep(0);
      return;
    }

    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 0.1;
        let accumulated = 0;
        for (let i = 0; i < steps.length; i++) {
          accumulated += steps[i].duration;
          if (next < accumulated) {
            setCurrentStep(i);
            break;
          }
          if (i === steps.length - 1) setCurrentStep(steps.length - 1);
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isGenerating, steps.length]);

  useEffect(() => {
    if (qaStatus === 'checking') setCurrentStep(5);
    if (qaStatus === 'fixing') setCurrentStep(5);
    if (qaStatus === 'passed') setCurrentStep(6);
  }, [qaStatus]);

  const progressPercent = Math.min((elapsed / totalDuration) * 100, qaStatus === 'passed' ? 100 : 96);
  const estimatedRemaining = Math.max(0, Math.ceil(totalDuration - elapsed));
  const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

  if (!isGenerating) return null;

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      {/* Cinematic progress bar */}
      <div className="relative">
        <div className="h-1.5 rounded-full bg-muted/20 overflow-hidden">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-primary"
            style={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        {/* Glow effect */}
        <motion.div 
          className="absolute top-0 h-1.5 rounded-full bg-primary/40 blur-sm"
          style={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 font-mono tracking-wider uppercase">
        <span>{Math.round(progressPercent)}% concluído</span>
        <div className="flex items-center gap-3">
          <span>{elapsedSeconds}s decorrido</span>
          <span>~{estimatedRemaining}s restante</span>
        </div>
      </div>

      {/* Step timeline */}
      <div className="space-y-0.5">
        {steps.map((step, i) => {
          const isComplete = i < currentStep || (i === currentStep && qaStatus === 'passed' && i === steps.length - 1);
          const isCurrent = i === currentStep && !isComplete;
          const isPending = i > currentStep;

          return (
            <AnimatePresence key={i}>
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ 
                  opacity: isPending ? 0.3 : 1, 
                  y: 0,
                  height: isCurrent ? 'auto' : '28px'
                }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                className={`relative flex items-start gap-2.5 px-3 py-1 rounded-lg transition-all duration-500 ${
                  isCurrent
                    ? 'bg-primary/8 border border-primary/15'
                    : ''
                }`}
              >
                {/* Timeline dot/line */}
                <div className="flex flex-col items-center mt-0.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isComplete 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : isCurrent 
                        ? 'bg-primary/20 text-primary ring-2 ring-primary/30' 
                        : 'bg-muted/10 text-muted-foreground/30'
                  }`}>
                    {isComplete ? (
                      <Check className="w-3 h-3" />
                    ) : isCurrent ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-px h-2 mt-0.5 transition-colors duration-300 ${
                      isComplete ? 'bg-emerald-500/30' : 'bg-muted/10'
                    }`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`transition-colors duration-300 ${
                      isComplete ? 'text-emerald-400' : isCurrent ? 'text-primary' : 'text-muted-foreground/40'
                    }`}>
                      {step.icon}
                    </span>
                    <span className={`text-xs font-medium truncate transition-colors duration-300 ${
                      isComplete ? 'text-emerald-400' : isCurrent ? 'text-foreground' : 'text-muted-foreground/40'
                    }`}>
                      {step.label}
                    </span>
                    {isComplete && (
                      <motion.span 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[8px] text-emerald-400/60 ml-auto font-mono"
                      >
                        ✓
                      </motion.span>
                    )}
                    {isCurrent && qaStatus === 'fixing' && i === 5 && (
                      <span className="ml-auto text-[9px] text-secondary font-semibold animate-pulse">Corrigindo...</span>
                    )}
                  </div>
                  {isCurrent && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-[10px] text-muted-foreground/50 mt-0.5 leading-relaxed"
                    >
                      {step.detail}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>
    </div>
  );
};
