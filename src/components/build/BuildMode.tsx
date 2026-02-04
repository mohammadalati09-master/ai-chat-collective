import { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { BuildPreview } from './BuildPreview';
import { BuildProgress } from './BuildProgress';
import { BuildEmptyState } from './BuildEmptyState';
import { FileTree } from './FileTree';
import { Message } from '@/hooks/useConversations';
import { BuildState, DeviceType } from '@/hooks/useBuildMode';
import { useIsMobile } from '@/hooks/use-mobile';

interface BuildModeProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  buildState: BuildState;
}

export function BuildMode({
  messages,
  onSendMessage,
  isLoading,
  device,
  onDeviceChange,
  buildState,
}: BuildModeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSuggestionClick = (text: string) => {
    onSendMessage(text);
  };

  if (isMobile) {
    // Mobile: Stack vertically
    return (
      <div className="flex flex-col h-full">
        {/* Preview - top half */}
        <div className="h-1/2 border-b border-border/50">
          <BuildPreview
            device="mobile"
            onDeviceChange={onDeviceChange}
            previewUrl={buildState.previewUrl}
            isBuilding={buildState.isBuilding}
          />
        </div>
        
        {/* Chat - bottom half */}
        <div className="h-1/2 flex flex-col">
          {messages.length === 0 && !buildState.isBuilding ? (
            <BuildEmptyState onSuggestionClick={handleSuggestionClick} />
          ) : (
            <ScrollArea ref={scrollRef} className="flex-1">
              <div className="p-4 space-y-4">
                {buildState.isBuilding && (
                  <BuildProgress
                    isBuilding={buildState.isBuilding}
                    progress={buildState.progress}
                    currentStep={buildState.currentStep}
                  />
                )}
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    createdAt={message.created_at}
                  />
                ))}
                <AnimatePresence>
                  {isLoading && <TypingIndicator />}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
          <ChatInput 
            onSend={onSendMessage} 
            disabled={isLoading} 
            placeholder="Beskriv appen du vill bygga..."
          />
        </div>
      </div>
    );
  }

  // Desktop: Resizable panels
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* File Tree */}
      <ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
        <div className="h-full glass-card border-r border-border/50 overflow-auto">
          <FileTree files={buildState.files} />
        </div>
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      {/* Main Area */}
      <ResizablePanel defaultSize={85}>
        <ResizablePanelGroup direction="vertical">
          {/* Preview Panel */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <BuildPreview
              device={device}
              onDeviceChange={onDeviceChange}
              previewUrl={buildState.previewUrl}
              isBuilding={buildState.isBuilding}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Chat Panel */}
          <ResizablePanel defaultSize={40} minSize={20}>
            <div className="h-full flex flex-col glass-card border-t border-border/50">
              {messages.length === 0 && !buildState.isBuilding ? (
                <BuildEmptyState onSuggestionClick={handleSuggestionClick} />
              ) : (
                <ScrollArea ref={scrollRef} className="flex-1">
                  <div className="max-w-4xl mx-auto p-4 space-y-4">
                    {buildState.isBuilding && (
                      <BuildProgress
                        isBuilding={buildState.isBuilding}
                        progress={buildState.progress}
                        currentStep={buildState.currentStep}
                      />
                    )}
                    {messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        role={message.role}
                        content={message.content}
                        createdAt={message.created_at}
                      />
                    ))}
                    <AnimatePresence>
                      {isLoading && <TypingIndicator />}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              )}
              <ChatInput 
                onSend={onSendMessage} 
                disabled={isLoading}
                placeholder="Beskriv appen du vill bygga..."
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
