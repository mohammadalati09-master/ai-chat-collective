import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Message } from '@/hooks/useConversations';

interface MessageSearchProps {
  messages: Message[];
  isOpen: boolean;
  onClose: () => void;
  onNavigateToResult: (messageId: string) => void;
}

export function MessageSearch({ messages, isOpen, onClose, onNavigateToResult }: MessageSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Search messages
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const matches = messages.filter(msg => 
      msg.content.toLowerCase().includes(searchTerm)
    );
    setResults(matches);
    setCurrentIndex(0);
  }, [query, messages]);

  const navigateToResult = useCallback((index: number) => {
    if (results[index]) {
      setCurrentIndex(index);
      onNavigateToResult(results[index].id);
    }
  }, [results, onNavigateToResult]);

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : results.length - 1;
    navigateToResult(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex < results.length - 1 ? currentIndex + 1 : 0;
    navigateToResult(newIndex);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        if (e.shiftKey) {
          goToPrevious();
        } else {
          goToNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToNext, goToPrevious]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 mx-4 z-50"
        >
          <div className="glass-card p-3 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Input
              autoFocus
              placeholder="Sök i konversation..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 h-8 bg-transparent border-0 focus-visible:ring-0 px-0"
            />
            {results.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {currentIndex + 1} / {results.length}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={goToPrevious}
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={goToNext}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onClose}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
