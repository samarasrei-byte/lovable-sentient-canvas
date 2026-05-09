import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Mic, Wand2, Sparkles, Brain, Zap, Palette, Layers, Radio } from "lucide-react";

export const CreatorStudio = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stages = [
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Input Vocal",
      text: '"Crie um perfume com frasco de cristal e essência de lavanda"',
      color: "text-blue-400"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Processamento Neural",
      text: "Mapeando texturas, reflexos e densidade molecular...",
      color: "text-purple-400"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Render Final",
      text: "Composição 4K ultra-realista finalizada.",
      color: "text-emerald-400"
    }
  ];

  return (
    <section className="py-24 md:py-32 px-6 relative overflow-hidden bg-background min-h-[100dvh] flex flex-col justify-center">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Tecnologia Proprietária</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
            Sua Voz é a <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">Pincelada Final</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            O Arcana Studio não é apenas uma ferramenta. É a extensão do seu pensamento criativo, transformando voz em visão instantânea.
          </p>
        </div>

        {/* Studio Panel */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated Glow Wrapper */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />
          
          <Card className="relative overflow-hidden bg-background/40 backdrop-blur-3xl border-primary/20 p-8 md:p-16 rounded-[2.5rem] shadow-2xl">
            {/* HUD Elements */}
            <div className="absolute top-8 left-8 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Live Neural Stream</div>
            </div>

            <div className="grid lg:grid-cols-5 gap-12 items-center">
              {/* Controls Column */}
              <div className="lg:col-span-2 space-y-4">
                {stages.map((stage, idx) => (
                  <motion.div
                    key={idx}
                    animate={{ 
                      scale: activeStage === idx ? 1.05 : 1,
                      opacity: activeStage === idx ? 1 : 0.4
                    }}
                    className={`p-6 rounded-3xl border ${
                      activeStage === idx 
                        ? 'bg-card border-primary/30 shadow-lg' 
                        : 'border-transparent'
                    } transition-all duration-500`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`p-2 rounded-xl bg-muted ${activeStage === idx ? stage.color : 'text-muted-foreground'}`}>
                        {stage.icon}
                      </div>
                      <span className="font-bold text-sm tracking-wide uppercase">{stage.title}</span>
                    </div>
                    <p className={`text-sm ${activeStage === idx ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {stage.text}
                    </p>
                    
                    {activeStage === idx && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="h-1 w-full bg-primary mt-4 rounded-full overflow-hidden"
                      >
                        <motion.div 
                          className="h-full bg-white/50"
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Visualizer / Preview Column */}
              <div className="lg:col-span-3">
                <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-black/40 border border-white/10 group">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStage}
                      initial={{ opacity: 0, filter: 'blur(20px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, filter: 'blur(20px)' }}
                      transition={{ duration: 1 }}
                      className="absolute inset-0"
                    >
                      {activeStage === 0 && (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-8">
                          <div className="flex items-center gap-3">
                            {[...Array(12)].map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{ 
                                  height: [20, 60, 20],
                                  opacity: [0.3, 1, 0.3]
                                }}
                                transition={{ 
                                  duration: 1.5, 
                                  repeat: Infinity, 
                                  delay: i * 0.1,
                                  ease: "easeInOut"
                                }}
                                className="w-2 rounded-full bg-primary"
                              />
                            ))}
                          </div>
                          <div className="text-primary font-mono text-sm tracking-widest animate-pulse">
                            VOICE_CAPTURE_ACTIVE
                          </div>
                        </div>
                      )}
                      
                      {activeStage === 1 && (
                        <div className="w-full h-full relative p-12">
                          <div className="absolute inset-0 overflow-hidden">
                            {[...Array(20)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ top: Math.random() * 100 + '%', left: Math.random() * 100 + '%' }}
                                animate={{ 
                                  top: [null, Math.random() * 100 + '%'],
                                  left: [null, Math.random() * 100 + '%'],
                                  scale: [0, 1, 0]
                                }}
                                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                                className="absolute w-1 h-1 bg-primary rounded-full blur-[1px]"
                              />
                            ))}
                          </div>
                          <div className="relative h-full border border-primary/20 rounded-2xl flex items-center justify-center bg-primary/5">
                            <Zap className="w-12 h-12 text-primary animate-bounce" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer bg-[length:200%_100%]" />
                          </div>
                        </div>
                      )}

                      {activeStage === 2 && (
                        <div className="w-full h-full p-6">
                           <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                              <img 
                                src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80" 
                                alt="Studio Result" 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                                <div>
                                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Final Result</div>
                                  <div className="text-white font-bold">CRYSTAL_LAVENDER_ESSENCE</div>
                                </div>
                                <div className="p-2 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30">
                                  <Zap className="w-4 h-4 text-emerald-400" />
                                </div>
                              </div>
                           </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
