import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Megaphone, 
  Sparkles, 
  ArrowRight, 
  Zap,
  TrendingUp,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const CampaignCTA = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 via-card/50 to-secondary/5 backdrop-blur">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-secondary/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <CardContent className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-30 blur-lg animate-pulse" />
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary">
                  <Megaphone className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl md:text-2xl font-bold">
                  Crie sua primeira campanha
                </h3>
                <Badge variant="outline" className="border-primary/50 text-primary">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Novo
                </Badge>
              </div>
              <p className="text-muted-foreground max-w-xl">
                Lance campanhas de marketing com influenciadores, avatares IA e artistas. 
                Alcance milhões de pessoas e aumente seu ROI em até 385%.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="p-1.5 rounded-lg bg-green-500/10">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-muted-foreground">+385% ROI médio</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">15k+ criadores</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="p-1.5 rounded-lg bg-secondary/10">
                    <Zap className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-muted-foreground">Setup em 5 min</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex-shrink-0">
              <Button
                size="lg"
                className="w-full md:w-auto h-14 px-8 gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
                onClick={() => navigate("/app/campanhas")}
              >
                <Megaphone className="w-5 h-5" />
                Criar Campanha
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
