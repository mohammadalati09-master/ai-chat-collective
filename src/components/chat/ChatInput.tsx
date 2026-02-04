import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Image, Mic, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachment = (type: 'file' | 'image') => {
    // Visual only - simulate attachment
    const name = type === 'file' ? 'dokument.pdf' : 'bild.png';
    setAttachments(prev => [...prev, name]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const characterCount = message.length;
  const maxCharacters = 4000;

  return (
    <div className="p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-3 max-w-4xl mx-auto"
      >
        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map((name, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5"
              >
                <span className="text-sm">{name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="flex items-end gap-2">
          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-muted"
              onClick={() => handleAttachment('file')}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-muted"
              onClick={() => handleAttachment('image')}
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-muted"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Skriv ett meddelande..."
              disabled={disabled}
              rows={1}
              className={cn(
                "w-full resize-none bg-transparent border-0 focus:ring-0 focus:outline-none",
                "text-foreground placeholder:text-muted-foreground",
                "py-2 px-1 max-h-[200px]",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            />
          </div>

          {/* Send button */}
          <motion.div
            animate={message.trim() ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={handleSend}
              disabled={!message.trim() || disabled}
              size="icon"
              className={cn(
                "h-9 w-9 rounded-full transition-all duration-300",
                message.trim()
                  ? "gradient-button animate-pulse-glow"
                  : "bg-muted hover:bg-muted"
              )}
            >
              <Send className={cn(
                "h-4 w-4 transition-colors",
                message.trim() ? "text-white" : "text-muted-foreground"
              )} />
            </Button>
          </motion.div>
        </div>

        {/* Character count */}
        <div className="flex justify-end mt-2">
          <span className={cn(
            "text-xs",
            characterCount > maxCharacters * 0.9
              ? "text-destructive"
              : "text-muted-foreground"
          )}>
            {characterCount} / {maxCharacters}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
