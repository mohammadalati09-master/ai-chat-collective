import { motion } from 'framer-motion';
import { Sparkles, Code, FileText, Lightbulb } from 'lucide-react';

const suggestions = [
  { icon: Sparkles, text: "Förklara kvantdatorer för en nybörjare" },
  { icon: Code, text: "Skriv en Python-funktion för att sortera en lista" },
  { icon: FileText, text: "Sammanfatta den här artikeln för mig" },
  { icon: Lightbulb, text: "Ge mig 5 idéer för en ny app" },
];

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8 glow"
        >
          <Sparkles className="h-10 w-10 text-white" />
        </motion.div>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-3">
          <span className="gradient-text">Vad kan jag hjälpa dig med?</span>
        </h2>
        <p className="text-muted-foreground mb-8">
          Jag kan hjälpa dig med allt från kodning till kreativt skrivande.
          Ställ en fråga eller välj ett förslag nedan.
        </p>

        {/* Suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => onSuggestionClick(suggestion.text)}
                className="glass-card p-4 text-left hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
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
