import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceInputButtonProps {
  onTranscript?: (text: string) => void;
}

export function VoiceInputButton({ onTranscript }: VoiceInputButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Simulate audio levels when recording
  useEffect(() => {
    if (!isRecording) {
      setAudioLevel(0);
      return;
    }

    const interval = setInterval(() => {
      // Simulate varying audio levels
      setAudioLevel(Math.random() * 100);
    }, 100);

    // Auto-stop after 10 seconds (demo)
    const timeout = setTimeout(() => {
      setIsRecording(false);
      onTranscript?.("Detta är en simulerad transkription från röstinmatning.");
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isRecording, onTranscript]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "h-9 w-9 rounded-full transition-all duration-300",
          isRecording && "bg-destructive/20 hover:bg-destructive/30"
        )}
        onClick={toggleRecording}
      >
        <AnimatePresence mode="wait">
          {isRecording ? (
            <motion.div
              key="recording"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <MicOff className="h-4 w-4 text-destructive" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Mic className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Audio level indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-card p-2 rounded-lg shadow-lg"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-primary rounded-full"
                animate={{
                  height: Math.max(4, (audioLevel / 100) * 20 * (1 + Math.sin(i) * 0.5)),
                }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
