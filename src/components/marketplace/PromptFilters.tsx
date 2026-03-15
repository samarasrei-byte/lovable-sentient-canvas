import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Flame, 
  Clock, 
  TrendingUp,
  Zap,
  Star,
  Shirt,
  Gamepad2,
  Music,
  Camera,
  Linkedin,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface PromptFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  sortBy: 'recent' | 'popular' | 'trending';
  onSortChange: (sort: 'recent' | 'popular' | 'trending') => void;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'cyberpunk':
      return Zap;
    case 'anime':
      return Star;
    case 'fashion':
      return Shirt;
    case 'gaming':
      return Gamepad2;
    case 'music':
      return Music;
    case 'photo':
      return Camera;
    default:
      return Sparkles;
  }
};

const sortOptions = [
  { key: 'trending' as const, label: 'Trending', icon: TrendingUp },
  { key: 'popular' as const, label: 'Populares', icon: Flame },
  { key: 'recent' as const, label: 'Recentes', icon: Clock },
];

export const PromptFilters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange
}: PromptFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      {/* Sort Options - Desktop */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center gap-2">
          {sortOptions.map((option) => (
            <GlassButton
              key={option.key}
              variant={sortBy === option.key ? "primary" : "ghost"}
              size="sm"
              onClick={() => onSortChange(option.key)}
              className={cn(
                "transition-all duration-300",
                sortBy === option.key && "shadow-[0_0_12px_hsl(var(--primary)/0.25)]"
              )}
            >
              <option.icon className="w-3.5 h-3.5" />
              <span className="text-xs">{option.label}</span>
            </GlassButton>
          ))}
        </div>

        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Badge 
              className="bg-primary/20 text-primary border-primary/30 cursor-pointer hover:bg-primary/30 transition-colors flex items-center gap-1.5"
              onClick={() => onCategoryChange(null)}
            >
              {selectedCategory}
              <X className="w-3 h-3" />
            </Badge>
          </motion.div>
        )}
      </div>

      {/* Category Pills - Horizontal Scroll */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex items-center gap-2 pb-2">
          {/* All */}
          <button
            onClick={() => onCategoryChange(null)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
              "border border-white/10 backdrop-blur-sm",
              !selectedCategory 
                ? "bg-primary text-primary-foreground shadow-[0_0_16px_hsl(var(--primary)/0.3)]" 
                : "bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
            )}
          >
            Todos
          </button>

          {categories.map((category) => {
            const Icon = getCategoryIcon(category);
            const isSelected = selectedCategory === category;
            
            return (
              <button
                key={category}
                onClick={() => onCategoryChange(isSelected ? null : category)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  "border backdrop-blur-sm flex items-center gap-2",
                  isSelected 
                    ? "bg-primary/90 text-primary-foreground border-primary/50 shadow-[0_0_16px_hsl(var(--primary)/0.3)]" 
                    : "bg-white/[0.03] text-muted-foreground border-white/10 hover:bg-white/[0.06] hover:text-foreground hover:border-white/20"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {category}
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>

      {/* Mobile Sort - Compact */}
      <div className="flex md:hidden items-center gap-2">
        {sortOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => onSortChange(option.key)}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300",
              "flex items-center justify-center gap-1.5",
              sortBy === option.key 
                ? "bg-primary/20 text-primary border border-primary/30" 
                : "bg-white/[0.03] text-muted-foreground border border-white/10"
            )}
          >
            <option.icon className="w-3 h-3" />
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
