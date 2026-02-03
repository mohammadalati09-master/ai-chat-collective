import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '@/components/chat/AnimatedBackground';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { useAuth } from '@/hooks/useAuth';
import { useConversations } from '@/hooks/useConversations';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Chat() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const {
    conversations,
    currentConversation,
    messages,
    loading,
    setLoading,
    createConversation,
    selectConversation,
    updateConversationTitle,
    deleteConversation,
    addMessage,
  } = useConversations();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Collapse sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  const handleNewChat = async () => {
    await createConversation();
  };

  const handleSendMessage = async (content: string) => {
    setLoading(true);
    
    // Create conversation if none exists
    let conv = currentConversation;
    if (!conv) {
      conv = await createConversation();
    }
    
    if (conv) {
      // Add user message
      await addMessage(content, 'user');
      
      // Simulate AI response delay
      setTimeout(async () => {
        await addMessage('Detta är ett simulerat AI-svar. I en riktig implementation skulle detta vara ett svar från en AI-modell.', 'assistant');
        setLoading(false);
      }, 2000);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <div className="glass-card p-8 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Laddar...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AnimatedBackground />
      
      {/* Sidebar - hidden on mobile when collapsed */}
      <div className={isMobile && sidebarCollapsed ? 'hidden' : ''}>
        <ChatSidebar
          conversations={conversations}
          currentConversation={currentConversation}
          onNewChat={handleNewChat}
          onSelectConversation={selectConversation}
          onDeleteConversation={deleteConversation}
          onRenameConversation={updateConversationTitle}
          isCollapsed={sidebarCollapsed && !isMobile}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile overlay when sidebar is open */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main chat area */}
      <ChatArea
        currentConversation={currentConversation}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={loading}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        isSidebarCollapsed={sidebarCollapsed}
      />
    </div>
  );
}
