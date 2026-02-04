import { useRef, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Menu, Hammer } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { ModelSelector } from './ModelSelector';
import { EmptyState } from './EmptyState';
import { ThemeToggle } from './ThemeToggle';
import { Message, Conversation } from '@/hooks/useConversations';

// Simulated AI responses
const aiResponses = [
  `Det låter som en intressant fråga! Låt mig förklara...

## Huvudpunkter

1. **Först och främst** - det är viktigt att förstå grunderna
2. **Sedan** - kan vi bygga vidare på det
3. **Till slut** - ser vi hela bilden

Här är ett kodexempel:

\`\`\`javascript
function greet(name) {
  return \`Hej \${name}!\`;
}

console.log(greet("världen"));
\`\`\`

Hoppas det hjälper!`,
  `Absolut! Här är mitt svar:

### Sammanfattning

- Det finns flera sätt att lösa detta
- Varje metod har sina för- och nackdelar
- Välj den som passar din situation bäst

> "Den bästa koden är den som är lätt att förstå." - Någon klok person

Vill du att jag fördjupar mig i något specifikt?`,
  `Intressant tanke! 🤔

Låt mig bryta ner det:

1. **Steg ett**: Analysera problemet
2. **Steg två**: Identifiera lösningar  
3. **Steg tre**: Implementera och testa

\`\`\`python
def solve_problem(problem):
    analysis = analyze(problem)
    solutions = find_solutions(analysis)
    return best_solution(solutions)
\`\`\`

Är det något mer du undrar över?`,
];

interface ChatAreaProps {
  currentConversation: Conversation | null;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  isBuildMode?: boolean;
  onToggleBuildMode?: () => void;
}

export function ChatArea({
  currentConversation,
  messages,
  onSendMessage,
  isLoading,
  onToggleSidebar,
  isSidebarCollapsed,
  isBuildMode = false,
  onToggleBuildMode,
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState('GPT-4');
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  const handleSend = async (content: string) => {
    await onSendMessage(content);
    
    // Simulate AI response with streaming effect
    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const fakeMessage: Message = {
        id: 'streaming',
        conversation_id: currentConversation?.id || '',
        role: 'assistant',
        content: randomResponse,
        created_at: new Date().toISOString(),
      };
      setStreamingMessage(fakeMessage);
      
      // Clear streaming after "complete"
      setTimeout(() => {
        setStreamingMessage(null);
      }, randomResponse.length * 15 + 500);
    }, 1000);
  };

  const handleSuggestionClick = (text: string) => {
    handleSend(text);
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <header className="glass-card rounded-none border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isSidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="h-8 w-8 md:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <ModelSelector
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        </div>
        
        <div className="flex items-center gap-4">
          {/* Build Mode Toggle */}
          {onToggleBuildMode && (
            <div className="flex items-center gap-2">
              <Switch
                id="build-mode"
                checked={isBuildMode}
                onCheckedChange={onToggleBuildMode}
              />
              <Label 
                htmlFor="build-mode" 
                className="flex items-center gap-1.5 cursor-pointer text-sm font-medium"
              >
                <Hammer className="h-4 w-4" />
                <span className="hidden sm:inline">Build</span>
              </Label>
            </div>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Messages */}
      {!currentConversation || messages.length === 0 ? (
        <EmptyState onSuggestionClick={handleSuggestionClick} />
      ) : (
        <ScrollArea ref={scrollRef} className="flex-1">
          <div className="max-w-4xl mx-auto py-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                createdAt={message.created_at}
              />
            ))}
            <AnimatePresence>
              {isLoading && !streamingMessage && <TypingIndicator />}
              {streamingMessage && (
                <ChatMessage
                  role="assistant"
                  content={streamingMessage.content}
                  createdAt={streamingMessage.created_at}
                  isStreaming
                />
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
