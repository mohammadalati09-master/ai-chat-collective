import { useState, useCallback, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isSaved: boolean;
}

interface DocumentEditorContextType {
  isOpen: boolean;
  currentDocument: Document | null;
  openEditor: (content?: string, title?: string) => void;
  closeEditor: () => void;
  updateContent: (content: string) => void;
  updateTitle: (title: string) => void;
  saveDocument: () => void;
  isAutoSaving: boolean;
}

const DocumentEditorContext = createContext<DocumentEditorContextType | undefined>(undefined);

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export function DocumentEditorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const lastSavedContentRef = useRef<string>('');

  const openEditor = useCallback((content = '', title = 'Nytt dokument') => {
    const now = new Date().toISOString();
    const newDoc = {
      id: crypto.randomUUID(),
      title,
      content,
      createdAt: now,
      updatedAt: now,
      isSaved: true,
    };
    setCurrentDocument(newDoc);
    lastSavedContentRef.current = content;
    setIsOpen(true);
  }, []);

  const closeEditor = useCallback(() => {
    setIsOpen(false);
    setCurrentDocument(null);
    lastSavedContentRef.current = '';
  }, []);

  const updateContent = useCallback((content: string) => {
    setCurrentDocument((prev) =>
      prev ? { ...prev, content, updatedAt: new Date().toISOString(), isSaved: false } : null
    );
  }, []);

  const updateTitle = useCallback((title: string) => {
    setCurrentDocument((prev) =>
      prev ? { ...prev, title, updatedAt: new Date().toISOString(), isSaved: false } : null
    );
  }, []);

  const saveDocument = useCallback(() => {
    if (currentDocument) {
      lastSavedContentRef.current = currentDocument.content;
      setCurrentDocument(prev => prev ? { ...prev, isSaved: true } : null);
      toast({
        title: "Sparat",
        description: "Dokumentet har sparats",
      });
    }
  }, [currentDocument]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!isOpen || !currentDocument) return;

    const interval = setInterval(() => {
      if (currentDocument && !currentDocument.isSaved && currentDocument.content !== lastSavedContentRef.current) {
        setIsAutoSaving(true);
        
        // Simulate save
        setTimeout(() => {
          lastSavedContentRef.current = currentDocument.content;
          setCurrentDocument(prev => prev ? { ...prev, isSaved: true } : null);
          setIsAutoSaving(false);
          toast({
            title: "Autosparad",
            description: "Ändringar har sparats automatiskt",
          });
        }, 500);
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [isOpen, currentDocument]);

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
        isAutoSaving,
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