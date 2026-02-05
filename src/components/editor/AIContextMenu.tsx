 import { useState } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import {
   Sparkles,
   Wrench,
   HelpCircle,
   RefreshCw,
   Edit,
   Eye,
   ChevronRight,
   FileText,
   Languages,
   Minimize2,
   Maximize2,
   MessageSquare,
 } from 'lucide-react';
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuSub,
   DropdownMenuSubContent,
   DropdownMenuSubTrigger,
   DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
 import { Button } from '@/components/ui/button';
 
 interface AIContextMenuProps {
   position: { x: number; y: number } | null;
   selectedText: string;
   onAction: (action: string, text: string) => void;
   onClose: () => void;
 }
 
 export function AIContextMenu({ position, selectedText, onAction, onClose }: AIContextMenuProps) {
   const [isOpen, setIsOpen] = useState(true);
 
   if (!position) return null;
 
   const handleAction = (action: string) => {
     onAction(action, selectedText);
     setIsOpen(false);
     onClose();
   };
 
   return (
     <AnimatePresence>
       {isOpen && (
         <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           className="fixed z-50"
           style={{ left: position.x, top: position.y }}
         >
           <div className="glass-card rounded-lg shadow-xl border border-border/50 py-1 min-w-[200px]">
             {/* Quick Fix Section */}
             <div className="px-2 py-1">
               <p className="text-xs font-medium text-muted-foreground px-2 py-1">Snabbfix</p>
               <button
                 onClick={() => handleAction('fix')}
                 className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors text-sm"
               >
                 <Wrench className="h-4 w-4" />
                 <span>Fixa</span>
               </button>
               <button
                 onClick={() => handleAction('explain')}
                 className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors text-sm"
               >
                 <HelpCircle className="h-4 w-4" />
                 <span>Förklara</span>
               </button>
             </div>
 
             <div className="h-px bg-border mx-2 my-1" />
 
             {/* Rewrite Section */}
             <div className="px-2 py-1">
               <p className="text-xs font-medium text-muted-foreground px-2 py-1">Skriv om</p>
               <button
                 onClick={() => handleAction('modify')}
                 className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors text-sm"
               >
                 <Edit className="h-4 w-4" />
                 <span>Modifiera</span>
               </button>
               <button
                 onClick={() => handleAction('review')}
                 className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors text-sm"
               >
                 <Eye className="h-4 w-4" />
                 <span>Granska</span>
               </button>
             </div>
 
             <div className="h-px bg-border mx-2 my-1" />
 
             {/* More Actions */}
             <div className="px-2 py-1">
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <button className="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors text-sm">
                     <div className="flex items-center gap-2">
                       <Sparkles className="h-4 w-4" />
                       <span>Fler åtgärder...</span>
                     </div>
                     <ChevronRight className="h-4 w-4" />
                   </button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent side="right" align="start" className="glass-card min-w-[180px]">
                   <DropdownMenuItem onClick={() => handleAction('summarize')} className="gap-2">
                     <FileText className="h-4 w-4" />
                     <span>Sammanfatta</span>
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => handleAction('translate')} className="gap-2">
                     <Languages className="h-4 w-4" />
                     <span>Översätt</span>
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => handleAction('makeShorter')} className="gap-2">
                     <Minimize2 className="h-4 w-4" />
                     <span>Gör kortare</span>
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => handleAction('makeLonger')} className="gap-2">
                     <Maximize2 className="h-4 w-4" />
                     <span>Gör längre</span>
                   </DropdownMenuItem>
                   <DropdownMenuSeparator />
                   <DropdownMenuSub>
                     <DropdownMenuSubTrigger className="gap-2">
                       <MessageSquare className="h-4 w-4" />
                       <span>Ändra ton</span>
                     </DropdownMenuSubTrigger>
                     <DropdownMenuSubContent className="glass-card">
                       <DropdownMenuItem onClick={() => handleAction('tone-professional')}>
                         Professionell
                       </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleAction('tone-casual')}>
                         Avslappnad
                       </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleAction('tone-friendly')}>
                         Vänlig
                       </DropdownMenuItem>
                     </DropdownMenuSubContent>
                   </DropdownMenuSub>
                 </DropdownMenuContent>
               </DropdownMenu>
             </div>
           </div>
         </motion.div>
       )}
     </AnimatePresence>
   );
 }