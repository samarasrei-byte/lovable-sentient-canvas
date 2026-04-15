import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArcanaLogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  showText?: boolean;
}

export const ArcanaLogo = ({ className, iconSize = 18, textSize = "text-lg", showText = true }: ArcanaLogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Zap className="text-primary fill-primary/30" style={{ width: iconSize, height: iconSize }} />
      {showText && (
        <span className={cn("font-bold tracking-wider bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent", textSize)}>
          ARCANA
        </span>
      )}
    </div>
  );
};
