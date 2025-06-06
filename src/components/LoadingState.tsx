import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingState = ({ 
  className,
  size = 'md',
  message = 'Loading...'
}: LoadingStateProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-4 p-4",
      className
    )}>
      <div className={cn(
        "animate-spin rounded-full border-t-primary",
        "border-l-transparent border-r-transparent border-b-transparent",
        sizeClasses[size]
      )} />
      {message && (
        <p className="text-muted-foreground text-sm font-rounded animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingState; 