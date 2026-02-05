 import { Settings } from 'lucide-react';
 import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
 } from '@/components/ui/sheet';
 import { Button } from '@/components/ui/button';
 import { ThemeSelector } from './ThemeSelector';
 import { ScrollArea } from '@/components/ui/scroll-area';
 import { Separator } from '@/components/ui/separator';
 
 interface SettingsSheetProps {
   trigger?: React.ReactNode;
 }
 
 export function SettingsSheet({ trigger }: SettingsSheetProps) {
   return (
     <Sheet>
       <SheetTrigger asChild>
         {trigger || (
           <Button variant="ghost" size="icon" className="h-8 w-8">
             <Settings className="h-4 w-4" />
           </Button>
         )}
       </SheetTrigger>
       <SheetContent className="glass-card border-l border-border/50 w-[340px] sm:w-[400px]">
         <SheetHeader>
           <SheetTitle className="gradient-text">Inställningar</SheetTitle>
         </SheetHeader>
         <Separator className="my-4" />
         <ScrollArea className="h-[calc(100vh-120px)] pr-4">
           <div className="space-y-6">
             <ThemeSelector />
           </div>
         </ScrollArea>
       </SheetContent>
     </Sheet>
   );
 }