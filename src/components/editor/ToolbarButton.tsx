 import { Button } from '@/components/ui/button';
 import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
 } from '@/components/ui/tooltip';
 import { cn } from '@/lib/utils';
 import { LucideIcon } from 'lucide-react';
 
 interface ToolbarButtonProps {
   icon: LucideIcon;
   label: string;
   onClick: () => void;
   isActive?: boolean;
   disabled?: boolean;
 }
 
 export function ToolbarButton({
   icon: Icon,
   label,
   onClick,
   isActive = false,
   disabled = false,
 }: ToolbarButtonProps) {
   return (
     <TooltipProvider delayDuration={300}>
       <Tooltip>
         <TooltipTrigger asChild>
           <Button
             variant="ghost"
             size="icon"
             className={cn(
               "h-8 w-8",
               isActive && "bg-primary/20 text-primary"
             )}
             onClick={onClick}
             disabled={disabled}
           >
             <Icon className="h-4 w-4" />
           </Button>
         </TooltipTrigger>
         <TooltipContent side="bottom">
           <p className="text-xs">{label}</p>
         </TooltipContent>
       </Tooltip>
     </TooltipProvider>
   );
 }