 import { useState, useRef, useEffect, useCallback } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { X, Save, FileText } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { EditorToolbar } from './EditorToolbar';
 import { AIContextMenu } from './AIContextMenu';
 import { AIActionResult } from './AIActionResult';
 import { useDocumentEditor } from '@/hooks/useDocumentEditor';
 
 export function DocumentEditor() {
   const { isOpen, currentDocument, closeEditor, updateContent, updateTitle, saveDocument } = useDocumentEditor();
   const editorRef = useRef<HTMLDivElement>(null);
   const [selection, setSelection] = useState<{ text: string; position: { x: number; y: number } } | null>(null);
   const [aiResult, setAiResult] = useState<{ action: string; original: string; suggested: string } | null>(null);
   const [isAiLoading, setIsAiLoading] = useState(false);
 
   const handleFormat = useCallback((command: string, value?: string) => {
     document.execCommand(command, false, value);
     editorRef.current?.focus();
   }, []);
 
   const handleSelectionChange = useCallback(() => {
     const selectionObj = window.getSelection();
     if (selectionObj && selectionObj.toString().trim().length > 0) {
       const range = selectionObj.getRangeAt(0);
       const rect = range.getBoundingClientRect();
       setSelection({
         text: selectionObj.toString(),
         position: { x: rect.left + rect.width / 2, y: rect.bottom + 10 },
       });
     } else {
       setSelection(null);
     }
   }, []);
 
   useEffect(() => {
     document.addEventListener('selectionchange', handleSelectionChange);
     return () => document.removeEventListener('selectionchange', handleSelectionChange);
   }, [handleSelectionChange]);
 
   const handleAIAction = async (action: string, text: string) => {
     setIsAiLoading(true);
     setAiResult({ action, original: text, suggested: '' });
 
     // Simulate AI response
     await new Promise((resolve) => setTimeout(resolve, 1500));
 
     const mockResponses: Record<string, string> = {
       fix: text.charAt(0).toUpperCase() + text.slice(1).replace(/\s+/g, ' ').trim() + '.',
       explain: `Texten "${text}" beskriver ett koncept som handlar om...`,
       modify: text.split(' ').reverse().join(' '),
       review: `Texten är välskriven men kan förbättras genom att...`,
       summarize: text.split(' ').slice(0, Math.ceil(text.split(' ').length / 2)).join(' ') + '...',
       translate: `[Översatt]: ${text}`,
       makeShorter: text.split(' ').slice(0, Math.ceil(text.split(' ').length * 0.6)).join(' '),
       makeLonger: `${text}. Dessutom kan man tillägga att detta är ett viktigt område som förtjänar mer uppmärksamhet.`,
       'tone-professional': text.replace(/!/g, '.').replace(/\?\?/g, '?'),
       'tone-casual': text.toLowerCase() + '!',
       'tone-friendly': `${text} 😊`,
     };
 
     setAiResult({ action, original: text, suggested: mockResponses[action] || text });
     setIsAiLoading(false);
   };
 
   const handleAcceptAI = () => {
     if (aiResult && editorRef.current) {
       const selectionObj = window.getSelection();
       if (selectionObj && selectionObj.rangeCount > 0) {
         const range = selectionObj.getRangeAt(0);
         range.deleteContents();
         range.insertNode(document.createTextNode(aiResult.suggested));
       }
     }
     setAiResult(null);
     setSelection(null);
   };
 
   const handleRejectAI = () => {
     setAiResult(null);
   };
 
   if (!isOpen || !currentDocument) return null;
 
   return (
     <AnimatePresence>
       <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
       >
         <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           exit={{ y: 20, opacity: 0 }}
           className="absolute inset-4 glass-card rounded-xl overflow-hidden flex flex-col"
         >
           {/* Header */}
           <div className="flex items-center justify-between p-3 border-b border-border/50">
             <div className="flex items-center gap-3">
               <FileText className="h-5 w-5 text-primary" />
               <Input
                 value={currentDocument.title}
                 onChange={(e) => updateTitle(e.target.value)}
                 className="text-lg font-semibold bg-transparent border-0 focus-visible:ring-0 p-0 h-auto"
                 placeholder="Dokumenttitel..."
               />
             </div>
             <div className="flex items-center gap-2">
               <Button onClick={saveDocument} className="gap-2">
                 <Save className="h-4 w-4" />
                 Spara
               </Button>
               <Button variant="ghost" size="icon" onClick={closeEditor}>
                 <X className="h-4 w-4" />
               </Button>
             </div>
           </div>
 
           {/* Toolbar */}
           <EditorToolbar onFormat={handleFormat} />
 
           {/* Editor area */}
           <div className="flex-1 overflow-auto p-8">
             <div className="max-w-4xl mx-auto">
               <div
                 ref={editorRef}
                 contentEditable
                 suppressContentEditableWarning
                 className="min-h-[500px] p-6 bg-card rounded-lg border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 prose prose-sm dark:prose-invert max-w-none"
                 onInput={(e) => updateContent(e.currentTarget.innerHTML)}
                 dangerouslySetInnerHTML={{ __html: currentDocument.content }}
               />
 
               {/* AI Result */}
               <AnimatePresence>
                 {aiResult && (
                   <AIActionResult
                     originalText={aiResult.original}
                     suggestedText={aiResult.suggested}
                     action={aiResult.action}
                     onAccept={handleAcceptAI}
                     onReject={handleRejectAI}
                     isLoading={isAiLoading}
                   />
                 )}
               </AnimatePresence>
             </div>
           </div>
 
           {/* AI Context Menu */}
           {selection && !aiResult && (
             <AIContextMenu
               position={selection.position}
               selectedText={selection.text}
               onAction={handleAIAction}
               onClose={() => setSelection(null)}
             />
           )}
         </motion.div>
       </motion.div>
     </AnimatePresence>
   );
 }