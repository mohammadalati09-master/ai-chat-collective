 import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
 
 export interface Document {
   id: string;
   title: string;
   content: string;
   createdAt: string;
   updatedAt: string;
 }
 
 interface DocumentEditorContextType {
   isOpen: boolean;
   currentDocument: Document | null;
   openEditor: (content?: string, title?: string) => void;
   closeEditor: () => void;
   updateContent: (content: string) => void;
   updateTitle: (title: string) => void;
   saveDocument: () => void;
 }
 
 const DocumentEditorContext = createContext<DocumentEditorContextType | undefined>(undefined);
 
 export function DocumentEditorProvider({ children }: { children: ReactNode }) {
   const [isOpen, setIsOpen] = useState(false);
   const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
 
   const openEditor = useCallback((content = '', title = 'Nytt dokument') => {
     const now = new Date().toISOString();
     setCurrentDocument({
       id: crypto.randomUUID(),
       title,
       content,
       createdAt: now,
       updatedAt: now,
     });
     setIsOpen(true);
   }, []);
 
   const closeEditor = useCallback(() => {
     setIsOpen(false);
     setCurrentDocument(null);
   }, []);
 
   const updateContent = useCallback((content: string) => {
     setCurrentDocument((prev) =>
       prev ? { ...prev, content, updatedAt: new Date().toISOString() } : null
     );
   }, []);
 
   const updateTitle = useCallback((title: string) => {
     setCurrentDocument((prev) =>
       prev ? { ...prev, title, updatedAt: new Date().toISOString() } : null
     );
   }, []);
 
   const saveDocument = useCallback(() => {
     // For now, just close - could be extended to save to database
     closeEditor();
   }, [closeEditor]);
 
   return (
     <DocumentEditorContext.Provider
       value={{
         isOpen,
         currentDocument,
         openEditor,
         closeEditor,
         updateContent,
         updateTitle,
         saveDocument,
       }}
     >
       {children}
     </DocumentEditorContext.Provider>
   );
 }
 
 export function useDocumentEditor() {
   const context = useContext(DocumentEditorContext);
   if (context === undefined) {
     throw new Error('useDocumentEditor must be used within a DocumentEditorProvider');
   }
   return context;
 }