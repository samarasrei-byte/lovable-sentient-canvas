import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  variant?: "card" | "text" | "avatar" | "button" | "image";
  count?: number;
}

export const SkeletonLoader = ({ 
  className, 
  variant = "text",
  count = 1 
}: SkeletonLoaderProps) => {
  const baseClass = "animate-pulse bg-muted/50 rounded-lg";

  const variants = {
    text: "h-4 w-full",
    card: "h-32 w-full rounded-xl",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-24 rounded-lg",
    image: "aspect-video w-full rounded-xl",
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className={cn(baseClass, variants[variant], className)}
        />
      ))}
    </>
  );
};

export const CardSkeleton = () => (
  <div className="p-4 border border-border/50 rounded-xl space-y-3">
    <div className="flex items-center gap-3">
      <SkeletonLoader variant="avatar" />
      <div className="space-y-2 flex-1">
        <SkeletonLoader variant="text" className="w-1/2 h-3" />
        <SkeletonLoader variant="text" className="w-1/3 h-2" />
      </div>
    </div>
    <SkeletonLoader variant="text" className="w-full" />
    <SkeletonLoader variant="text" className="w-3/4" />
  </div>
);

export const ListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const GridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="space-y-2">
        <SkeletonLoader variant="image" />
        <SkeletonLoader variant="text" className="w-3/4 h-3" />
        <SkeletonLoader variant="text" className="w-1/2 h-2" />
      </div>
    ))}
  </div>
);
