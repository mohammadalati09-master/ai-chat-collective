import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ThumbsUp, ThumbsDown, Share2, User, FileEdit, Pencil, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CodeBlock } from './CodeBlock';
import { useDocumentEditor } from '@/hooks/useDocumentEditor';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  isStreaming?: boolean;
  onEdit?: (newContent: string) => void;
  highlightSearch?: string;
}

export function ChatMessage({ 
  role, 
  content, 
  createdAt, 
  isStreaming,
  onEdit,
  highlightSearch 
}: ChatMessageProps) {
  const { openEditor } = useDocumentEditor();
  const [displayContent, setDisplayContent] = useState(isStreaming ? '' : content);
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState<'up' | 'down' | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const isUser = role === 'user';

  // Typing effect for streaming
  useEffect(() => {
    if (!isStreaming) {
      setDisplayContent(content);
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index < content.length) {
        setDisplayContent(content.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [content, isStreaming]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  // Highlight search terms
  const getHighlightedContent = (text: string) => {
    if (!highlightSearch) return text;
    const parts = text.split(new RegExp(`(${highlightSearch})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlightSearch?.toLowerCase() 
        ? `**${part}**` 
        : part
    ).join('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 px-4 py-4 group",
        isUser ? "flex-row-reverse" : "",
        highlightSearch && content.toLowerCase().includes(highlightSearch.toLowerCase()) && "bg-primary/5"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-gradient-to-br from-secondary to-muted"
            : "bg-gradient-to-br from-primary to-accent"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-foreground" />
        ) : (
          <span className="text-white text-xs font-bold">AI</span>
        )}
      </div>

      {/* Message content */}
      <div className={cn("flex flex-col gap-2 max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "glass-card rounded-bl-md"
          )}
        >
          {isEditing ? (
            <div className="space-y-2 min-w-[200px]">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[80px] bg-background/50"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                  <X className="h-3 w-3 mr-1" />
                  Avbryt
                </Button>
                <Button size="sm" onClick={handleSaveEdit}>
                  <Check className="h-3 w-3 mr-1" />
                  Spara
                </Button>
              </div>
            </div>
          ) : isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');
                    
                    if (match) {
                      return <CodeBlock language={match[1]} code={codeString} />;
                    }
                    
                    return (
                      <code 
                        className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" 
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {highlightSearch ? getHighlightedContent(displayContent) : displayContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Timestamp and actions */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-muted-foreground">
            {format(new Date(createdAt), 'HH:mm', { locale: sv })}
          </span>

          {/* Edit button for user messages */}
          {isUser && !isEditing && onEdit && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Actions for AI messages */}
          {!isUser && !isEditing && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3 w-3 text-primary" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-6 w-6", reaction === 'up' && "text-primary")}
                onClick={() => setReaction(reaction === 'up' ? null : 'up')}
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-6 w-6", reaction === 'down' && "text-destructive")}
                onClick={() => setReaction(reaction === 'down' ? null : 'down')}
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
              >
                <Share2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => openEditor(content, 'Redigera meddelande')}
              >
                <FileEdit className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
