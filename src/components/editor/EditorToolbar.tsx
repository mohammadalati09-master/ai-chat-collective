 import {
   Bold,
   Italic,
   Underline,
   Strikethrough,
   Subscript,
   Superscript,
   AlignLeft,
   AlignCenter,
   AlignRight,
   AlignJustify,
   List,
   ListOrdered,
   IndentIncrease,
   IndentDecrease,
   Clipboard,
   ClipboardPaste,
   Scissors,
   Paintbrush,
   Type,
   Highlighter,
 } from 'lucide-react';
 import { Separator } from '@/components/ui/separator';
 import { ToolbarButton } from './ToolbarButton';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 
 interface EditorToolbarProps {
   onFormat: (command: string, value?: string) => void;
 }
 
 const fontSizes = ['10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48'];
 const fontFamilies = [
   { value: 'Arial', label: 'Arial' },
   { value: 'Times New Roman', label: 'Times New Roman' },
   { value: 'Georgia', label: 'Georgia' },
   { value: 'Verdana', label: 'Verdana' },
   { value: 'Courier New', label: 'Courier New' },
 ];
 
 export function EditorToolbar({ onFormat }: EditorToolbarProps) {
   return (
     <div className="glass-card border-b border-border/50 p-2">
       {/* Toolbar groups */}
       <div className="flex flex-wrap items-center gap-1">
         {/* Clipboard group */}
         <div className="flex items-center gap-0.5 px-1">
           <ToolbarButton icon={ClipboardPaste} label="Klistra in" onClick={() => onFormat('paste')} />
           <ToolbarButton icon={Scissors} label="Klipp ut" onClick={() => onFormat('cut')} />
           <ToolbarButton icon={Clipboard} label="Kopiera" onClick={() => onFormat('copy')} />
           <ToolbarButton icon={Paintbrush} label="Formatpensel" onClick={() => onFormat('formatPainter')} />
         </div>
 
         <Separator orientation="vertical" className="h-8" />
 
         {/* Font selectors */}
         <div className="flex items-center gap-1 px-1">
           <Select onValueChange={(value) => onFormat('fontName', value)}>
             <SelectTrigger className="w-[130px] h-8 text-xs">
               <SelectValue placeholder="Typsnitt" />
             </SelectTrigger>
             <SelectContent>
               {fontFamilies.map((font) => (
                 <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                   {font.label}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
           <Select onValueChange={(value) => onFormat('fontSize', value)}>
             <SelectTrigger className="w-[70px] h-8 text-xs">
               <SelectValue placeholder="12" />
             </SelectTrigger>
             <SelectContent>
               {fontSizes.map((size) => (
                 <SelectItem key={size} value={size}>
                   {size}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
         </div>
 
         <Separator orientation="vertical" className="h-8" />
 
         {/* Text formatting */}
         <div className="flex items-center gap-0.5 px-1">
           <ToolbarButton icon={Bold} label="Fetstil (Ctrl+B)" onClick={() => onFormat('bold')} />
           <ToolbarButton icon={Italic} label="Kursiv (Ctrl+I)" onClick={() => onFormat('italic')} />
           <ToolbarButton icon={Underline} label="Understruken (Ctrl+U)" onClick={() => onFormat('underline')} />
           <ToolbarButton icon={Strikethrough} label="Genomstruken" onClick={() => onFormat('strikeThrough')} />
           <ToolbarButton icon={Subscript} label="Nedsänkt" onClick={() => onFormat('subscript')} />
           <ToolbarButton icon={Superscript} label="Upphöjd" onClick={() => onFormat('superscript')} />
         </div>
 
         <Separator orientation="vertical" className="h-8" />
 
         {/* Text color */}
         <div className="flex items-center gap-0.5 px-1">
           <ToolbarButton icon={Type} label="Textfärg" onClick={() => onFormat('foreColor')} />
           <ToolbarButton icon={Highlighter} label="Markera" onClick={() => onFormat('hiliteColor')} />
         </div>
 
         <Separator orientation="vertical" className="h-8" />
 
         {/* Alignment */}
         <div className="flex items-center gap-0.5 px-1">
           <ToolbarButton icon={AlignLeft} label="Vänsterjustera" onClick={() => onFormat('justifyLeft')} />
           <ToolbarButton icon={AlignCenter} label="Centrera" onClick={() => onFormat('justifyCenter')} />
           <ToolbarButton icon={AlignRight} label="Högerjustera" onClick={() => onFormat('justifyRight')} />
           <ToolbarButton icon={AlignJustify} label="Justera" onClick={() => onFormat('justifyFull')} />
         </div>
 
         <Separator orientation="vertical" className="h-8" />
 
         {/* Lists and indentation */}
         <div className="flex items-center gap-0.5 px-1">
           <ToolbarButton icon={List} label="Punktlista" onClick={() => onFormat('insertUnorderedList')} />
           <ToolbarButton icon={ListOrdered} label="Numrerad lista" onClick={() => onFormat('insertOrderedList')} />
           <ToolbarButton icon={IndentDecrease} label="Minska indrag" onClick={() => onFormat('outdent')} />
           <ToolbarButton icon={IndentIncrease} label="Öka indrag" onClick={() => onFormat('indent')} />
         </div>
       </div>
     </div>
   );
 }