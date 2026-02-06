import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code, FileText, MessageSquare, Lightbulb, BookOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const templates = [
  { icon: Sparkles, label: 'Förklara...', prompt: 'Förklara ' },
  { icon: Code, label: 'Skriv kod för...', prompt: 'Skriv kod för ' },
  { icon: FileText, label: 'Sammanfatta...', prompt: 'Sammanfatta följande: ' },
  { icon: MessageSquare, label: 'Översätt till...', prompt: 'Översätt följande till ' },
  { icon: Lightbulb, label: 'Ge idéer för...', prompt: 'Ge mig 5 kreativa idéer för ' },
  { icon: BookOpen, label: 'Lär mig om...', prompt: 'Lär mig om ' },
];

interface PromptTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (prompt: string) => void;
}

export function PromptTemplates({ isOpen, onClose, onSelect }: PromptTemplatesProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-full left-0 right-0 mb-2 mx-4"
        >
          <div className="glass-card p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Promptmallar</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onClose}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {templates.map((template, index) => {
                const Icon = template.icon;
                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onSelect(template.prompt);
                      onClose();
                    }}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg text-left",
                      "bg-muted/30 hover:bg-muted/50 transition-colors",
                      "text-sm"
                    )}
                  >
                    <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="truncate">{template.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
