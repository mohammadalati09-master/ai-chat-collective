import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Image, X, Wand2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PromptTemplates } from './PromptTemplates';
import { VoiceInputButton } from './VoiceInputButton';
import { MarkdownPreview } from './MarkdownPreview';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = "Skriv ett meddelande..." }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
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
      // Add to history
      setMessageHistory(prev => [message.trim(), ...prev].slice(0, 50));
      setHistoryIndex(-1);
      
      onSend(message.trim());
      setMessage('');
      setAttachments([]);
      setShowPreview(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    
    // Arrow up for message history
    if (e.key === 'ArrowUp' && !message.trim()) {
      e.preventDefault();
      if (messageHistory.length > 0) {
        const newIndex = historyIndex < messageHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setMessage(messageHistory[newIndex] || '');
      }
    }
    
    // Arrow down to go forward in history
    if (e.key === 'ArrowDown' && historyIndex >= 0) {
      e.preventDefault();
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setMessage(newIndex >= 0 ? messageHistory[newIndex] : '');
    }
  };

  const handleAttachment = (type: 'file' | 'image') => {
    const name = type === 'file' ? 'dokument.pdf' : 'bild.png';
    setAttachments(prev => [...prev, name]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleTemplateSelect = (prompt: string) => {
    setMessage(prompt);
    textareaRef.current?.focus();
  };

  const handleVoiceTranscript = (text: string) => {
    setMessage(prev => prev + text);
  };

  const characterCount = message.length;
  const maxCharacters = 4000;
  const hasMarkdown = /[*_#`\[\]>-]/.test(message);

  return (
    <div className="p-4 relative">
      {/* Prompt templates popup */}
      <PromptTemplates
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelect={handleTemplateSelect}
      />

      {/* Markdown preview popup */}
      <MarkdownPreview
        content={message}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />

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
              className={cn(
                "h-9 w-9 rounded-full hover:bg-muted",
                showTemplates && "bg-primary/20"
              )}
              onClick={() => setShowTemplates(!showTemplates)}
              title="Promptmallar"
            >
              <Wand2 className="h-4 w-4" />
            </Button>
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
            <VoiceInputButton onTranscript={handleVoiceTranscript} />
          </div>

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
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

          {/* Markdown preview toggle */}
          {hasMarkdown && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-full hover:bg-muted",
                showPreview && "bg-primary/20"
              )}
              onClick={() => setShowPreview(!showPreview)}
              title="Förhandsvisning"
            >
              {showPreview ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          )}

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

        {/* Character count and history hint */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">
            {messageHistory.length > 0 && "↑ för tidigare meddelanden"}
          </span>
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
