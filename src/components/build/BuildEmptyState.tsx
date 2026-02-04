import { motion } from 'framer-motion';
import { Hammer, ListTodo, Cloud, BookOpen, ShoppingCart } from 'lucide-react';

const buildSuggestions = [
  { icon: ListTodo, text: "Bygg en todo-app med kategorier och prioriteringar" },
  { icon: Cloud, text: "Skapa en väder-app med kartor och prognoser" },
  { icon: BookOpen, text: "Gör en receptsamling med sökfunktion" },
  { icon: ShoppingCart, text: "Skapa en e-handelsbutik med kundvagn" },
];

interface BuildEmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

export function BuildEmptyState({ onSuggestionClick }: BuildEmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg w-full"
      >
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 glow"
        >
          <Hammer className="h-8 w-8 text-white" />
        </motion.div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2">
          <span className="gradient-text">Vad vill du bygga?</span>
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Beskriv appen du vill skapa så bygger jag den åt dig.
        </p>

        {/* Suggestions */}
        <div className="space-y-2">
          {buildSuggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => onSuggestionClick(suggestion.text)}
                className="w-full glass-card p-3 text-left hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-colors flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm text-foreground">{suggestion.text}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
