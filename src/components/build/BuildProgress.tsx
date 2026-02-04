import { motion } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface BuildProgressProps {
  isBuilding: boolean;
  progress: number;
  currentStep: string;
}

export function BuildProgress({ isBuilding, progress, currentStep }: BuildProgressProps) {
  const isComplete = progress >= 100 && !isBuilding;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-card p-4 space-y-3"
    >
      <div className="flex items-center gap-3">
        {isComplete ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        )}
        <span className={cn(
          "text-sm font-medium",
          isComplete && "text-green-500"
        )}>
          {currentStep}
        </span>
      </div>
      
      <Progress 
        value={progress} 
        className={cn(
          "h-2",
          isComplete && "[&>div]:bg-green-500"
        )}
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Bygger din app...</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </motion.div>
  );
}
