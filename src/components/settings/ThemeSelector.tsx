 import { motion } from 'framer-motion';
 import { Check } from 'lucide-react';
 import { useTheme, themes, ThemeInfo } from '@/hooks/useTheme';
 import { cn } from '@/lib/utils';
 
 function ThemeCard({ themeInfo }: { themeInfo: ThemeInfo }) {
   const { theme, setTheme } = useTheme();
   const isActive = theme === themeInfo.id;
 
   return (
     <motion.button
       whileHover={{ scale: 1.02 }}
       whileTap={{ scale: 0.98 }}
       onClick={() => setTheme(themeInfo.id)}
       className={cn(
         "relative p-4 rounded-xl border-2 transition-all text-left w-full",
         isActive
           ? "border-primary bg-primary/10"
           : "border-border hover:border-primary/50 bg-muted/30"
       )}
     >
       {/* Color preview */}
       <div className="flex gap-2 mb-3">
         <div
           className="w-8 h-8 rounded-full shadow-inner"
           style={{ background: themeInfo.colors.primary }}
         />
         <div
           className="w-8 h-8 rounded-full shadow-inner"
           style={{ background: themeInfo.colors.accent }}
         />
         <div
           className="w-8 h-8 rounded-full shadow-inner border border-border"
           style={{ background: themeInfo.colors.background }}
         />
       </div>
 
       <div className="flex items-center justify-between">
         <div>
           <p className="font-medium">{themeInfo.name}</p>
           <p className="text-sm text-muted-foreground">{themeInfo.description}</p>
         </div>
         {isActive && (
           <motion.div
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             className="h-6 w-6 rounded-full bg-primary flex items-center justify-center"
           >
             <Check className="h-4 w-4 text-primary-foreground" />
           </motion.div>
         )}
       </div>
     </motion.button>
   );
 }
 
 export function ThemeSelector() {
   return (
     <div className="space-y-4">
       <div>
         <h3 className="text-lg font-semibold mb-1">Tema</h3>
         <p className="text-sm text-muted-foreground">
           Välj ett tema som passar din stil
         </p>
       </div>
       <div className="grid gap-3">
         {themes.map((themeInfo) => (
           <ThemeCard key={themeInfo.id} themeInfo={themeInfo} />
         ))}
       </div>
     </div>
   );
 }