import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Check, Loader2, Sparkles, Eye, Shield, Palette, Scan, Wand2 } from "lucide-react";

interface ProgressStep {
  label: string;
  icon: React.ReactNode;
  duration: number; // seconds this step takes
}

interface GenerationProgressBarProps {
  isGenerating: boolean;
  qaStatus?: 'idle' | 'checking' | 'passed' | 'fixing';
  photoCount?: number;
}

const getSteps = (photoCount: number): ProgressStep[] => [
  { label: "Carregando foto de referência", icon: <Scan className="w-3.5 h-3.5" />, duration: 2 },
  { label: photoCount > 1 ? `Analisando ${photoCount} rostos` : "Mapeando traços faciais", icon: <Eye className="w-3.5 h-3.5" />, duration: 4 },
  { label: "Aplicando estilo artístico", icon: <Palette className="w-3.5 h-3.5" />, duration: 6 },
  { label: "Renderizando imagem em alta resolução", icon: <Wand2 className="w-3.5 h-3.5" />, duration: 8 },
  { label: "Auditoria de fidelidade facial (QA)", icon: <Shield className="w-3.5 h-3.5" />, duration: 5 },
  { label: "Finalizando e otimizando", icon: <Sparkles className="w-3.5 h-3.5" />, duration: 3 },
];

export const GenerationProgressBar = ({ isGenerating, qaStatus = 'idle', photoCount = 1 }: GenerationProgressBarProps) => {
  const steps = getSteps(photoCount);
  const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);
  const [elapsed, setElapsed] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setElapsed(0);
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 0.1;
        // Calculate current step based on elapsed time
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

  // Override step for QA status
  useEffect(() => {
    if (qaStatus === 'checking') setCurrentStep(4);
    if (qaStatus === 'fixing') setCurrentStep(4);
    if (qaStatus === 'passed') setCurrentStep(5);
  }, [qaStatus]);

  const progressPercent = Math.min((elapsed / totalDuration) * 100, qaStatus === 'passed' ? 100 : 95);
  const estimatedRemaining = Math.max(0, Math.ceil(totalDuration - elapsed));

  if (!isGenerating) return null;

  return (
    <div className="space-y-3 w-full max-w-sm mx-auto">
      {/* Main progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{Math.round(progressPercent)}%</span>
          <span>~{estimatedRemaining}s restantes</span>
        </div>
        <Progress value={progressPercent} className="h-2 bg-white/10" />
      </div>

      {/* Step list */}
      <div className="space-y-1">
        {steps.map((step, i) => {
          const isComplete = i < currentStep || (i === currentStep && qaStatus === 'passed' && i === steps.length - 1);
          const isCurrent = i === currentStep && !isComplete;
          const isPending = i > currentStep;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-center gap-2 text-xs py-1 px-2 rounded-lg transition-all duration-300 ${
                isCurrent
                  ? 'text-primary bg-primary/5 font-medium'
                  : isComplete
                    ? 'text-emerald-400'
                    : 'text-muted-foreground/40'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                {isComplete ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
                )}
              </div>
              <span className="flex items-center gap-1.5">
                {step.icon}
                {step.label}
              </span>
              {isCurrent && qaStatus === 'fixing' && i === 4 && (
                <span className="ml-auto text-[9px] text-secondary font-medium">Corrigindo...</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
