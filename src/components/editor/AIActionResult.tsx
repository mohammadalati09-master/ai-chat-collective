 import { motion } from 'framer-motion';
 import { Check, X, Sparkles } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 
 interface AIActionResultProps {
   originalText: string;
   suggestedText: string;
   action: string;
   onAccept: () => void;
   onReject: () => void;
   isLoading?: boolean;
 }
 
 export function AIActionResult({
   originalText,
   suggestedText,
   action,
   onAccept,
   onReject,
   isLoading = false,
 }: AIActionResultProps) {
   const actionLabels: Record<string, string> = {
     fix: 'Fixad text',
     explain: 'Förklaring',
     modify: 'Modifierad text',
     review: 'Granskning',
     summarize: 'Sammanfattning',
     translate: 'Översättning',
     makeShorter: 'Kortare version',
     makeLonger: 'Längre version',
     'tone-professional': 'Professionell ton',
     'tone-casual': 'Avslappnad ton',
     'tone-friendly': 'Vänlig ton',
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 10 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -10 }}
       className="glass-card rounded-lg p-4 my-2 border border-primary/30"
     >
       <div className="flex items-center gap-2 mb-3">
         <Sparkles className="h-4 w-4 text-primary" />
         <span className="text-sm font-medium text-primary">
           {actionLabels[action] || 'AI-förslag'}
         </span>
       </div>
 
       {isLoading ? (
         <div className="space-y-2">
           <div className="h-4 bg-muted rounded shimmer" />
           <div className="h-4 bg-muted rounded shimmer w-3/4" />
           <div className="h-4 bg-muted rounded shimmer w-1/2" />
         </div>
       ) : (
         <>
           {/* Show diff for modifications */}
           {action !== 'explain' && action !== 'review' && (
             <div className="space-y-2 mb-4">
               <div className="text-xs text-muted-foreground">Original:</div>
               <div className="text-sm p-2 bg-destructive/10 rounded border border-destructive/20 line-through opacity-70">
                 {originalText}
               </div>
               <div className="text-xs text-muted-foreground">Förslag:</div>
               <div className="text-sm p-2 bg-primary/10 rounded border border-primary/20">
                 {suggestedText}
               </div>
             </div>
           )}
 
           {/* Just show result for explain/review */}
           {(action === 'explain' || action === 'review') && (
             <div className="text-sm p-3 bg-muted/50 rounded mb-4">
               {suggestedText}
             </div>
           )}
 
           <div className="flex justify-end gap-2">
             <Button variant="ghost" size="sm" onClick={onReject} className="gap-1">
               <X className="h-3 w-3" />
               Avbryt
             </Button>
             {action !== 'explain' && action !== 'review' && (
               <Button size="sm" onClick={onAccept} className="gap-1">
                 <Check className="h-3 w-3" />
                 Acceptera
               </Button>
             )}
           </div>
         </>
       )}
     </motion.div>
   );
 }