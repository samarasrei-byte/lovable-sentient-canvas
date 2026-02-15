import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Bot, User } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingHeart {
  id: number;
  x: number;
}

interface Props {
  presenterType: string;
  presenterName: string;
  likesCount: number;
  onLike: () => void;
  onTogglePresenter: () => void;
}

export function LiveShopVideoArea({
  presenterType,
  presenterName,
  likesCount,
  onLike,
  onTogglePresenter,
}: Props) {
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

  const handleLike = () => {
    onLike();
    const heart: FloatingHeart = {
      id: Date.now(),
      x: Math.random() * 60 + 20,
    };
    setFloatingHearts((prev) => [...prev, heart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== heart.id));
    }, 2000);
  };

  const isAvatar = presenterType === "avatar";

  return (
    <div className="relative flex-1 bg-gradient-to-br from-card to-background flex items-center justify-center overflow-hidden">
      {/* Simulated Video Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-artist/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div
              className={`w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto bg-gradient-to-br ${
                isAvatar ? "from-primary to-primary/70" : "from-secondary to-secondary/70"
              } flex items-center justify-center animate-pulse`}
            >
              {isAvatar ? (
                <Bot className="w-12 h-12 md:w-16 md:h-16 text-white" />
              ) : (
                <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">{presenterName}</h3>
              <Badge className={isAvatar ? "bg-primary" : "bg-secondary"}>
                {isAvatar ? "Avatar IA" : "Influencer Real"}
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-md text-sm md:text-base px-4">
              Apresentando produtos exclusivos com descontos imperdíveis!
            </p>
          </div>
        </div>
      </div>

      {/* Floating Hearts */}
      <AnimatePresence>
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, y: 0, x: `${heart.x}%` }}
            animate={{ opacity: 0, y: -200 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute bottom-20 text-red-500 text-2xl pointer-events-none"
            style={{ left: `${heart.x}%` }}
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
        <Button
          onClick={handleLike}
          variant="outline"
          size="default"
          className="bg-card/80 backdrop-blur-sm hover:bg-card text-xs md:text-sm"
        >
          <Heart className="w-4 h-4 mr-1 md:mr-2 text-red-500" />
          {likesCount.toLocaleString()}
        </Button>

        <Button
          onClick={onTogglePresenter}
          className="bg-gradient-to-r from-primary to-secondary text-xs md:text-sm"
        >
          {isAvatar ? (
            <>
              <User className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Trocar para</span> Influencer
            </>
          ) : (
            <>
              <Bot className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Trocar para</span> Avatar IA
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
