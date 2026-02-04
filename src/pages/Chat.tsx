import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '@/components/chat/AnimatedBackground';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { BuildMode } from '@/components/build/BuildMode';
import { useAuth } from '@/hooks/useAuth';
import { useConversations } from '@/hooks/useConversations';
import { useGuestMode } from '@/hooks/useGuestMode';
import { useBuildMode } from '@/hooks/useBuildMode';
import { useIsMobile } from '@/hooks/use-mobile';
import { Message, Conversation } from '@/hooks/useConversations';

export default function Chat() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Build mode state
  const {
    isBuildMode,
    toggleBuildMode,
    device,
    setDevice,
    buildState,
    simulateBuild,
  } = useBuildMode();

  // Authenticated user conversations
  const authConversations = useConversations();
  
  // Guest mode conversations (localStorage)
  const guestMode = useGuestMode();
  
  // Determine if user is a guest
  const isGuest = !authLoading && !user;
  
  // Use appropriate conversation source
  const [currentGuestConversation, setCurrentGuestConversation] = useState<Conversation | null>(null);
  const [guestMessages, setGuestMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  
  const conversations = isGuest ? guestMode.conversations : authConversations.conversations;
  const currentConversation = isGuest ? currentGuestConversation : authConversations.currentConversation;
  const messages = isGuest ? guestMessages : authConversations.messages;

  // Collapse sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  const handleNewChat = async () => {
    if (isGuest) {
      const newConv = guestMode.createConversation();
      setCurrentGuestConversation(newConv);
      setGuestMessages([]);
    } else {
      await authConversations.createConversation();
    }
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    if (isGuest) {
      setCurrentGuestConversation(conversation);
      setGuestMessages(guestMode.getMessages(conversation.id));
    } else {
      await authConversations.selectConversation(conversation);
    }
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    if (isGuest) {
      guestMode.deleteConversation(id);
      if (currentGuestConversation?.id === id) {
        setCurrentGuestConversation(null);
        setGuestMessages([]);
      }
    } else {
      await authConversations.deleteConversation(id);
    }
  };

  const handleRenameConversation = async (id: string, title: string) => {
    if (isGuest) {
      guestMode.updateConversationTitle(id, title);
      if (currentGuestConversation?.id === id) {
        setCurrentGuestConversation(prev => prev ? { ...prev, title } : null);
      }
    } else {
      await authConversations.updateConversationTitle(id, title);
    }
  };

  const handleSendMessage = async (content: string) => {
    setLoading(true);
    
    let conv = currentConversation;
    
    // Create conversation if none exists
    if (!conv) {
      if (isGuest) {
        conv = guestMode.createConversation();
        setCurrentGuestConversation(conv);
      } else {
        conv = await authConversations.createConversation();
      }
    }
    
    if (conv) {
      // Add user message
      if (isGuest) {
        const userMsg = guestMode.addMessage(conv.id, content, 'user');
        setGuestMessages(prev => [...prev, userMsg]);
        
        // Update title if first message
        if (guestMessages.length === 0) {
          const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
          guestMode.updateConversationTitle(conv.id, title);
          setCurrentGuestConversation(prev => prev ? { ...prev, title } : null);
        }
      } else {
        await authConversations.addMessage(content, 'user');
      }
      
      // If in build mode, simulate building
      if (isBuildMode) {
        simulateBuild(content);
      }
      
      // Simulate AI response delay
      setTimeout(async () => {
        const aiResponse = isBuildMode 
          ? '✅ Jag har byggt din app! Du kan se förhandsvisningen ovan. Vill du göra några ändringar?'
          : 'Detta är ett simulerat AI-svar. I en riktig implementation skulle detta vara ett svar från en AI-modell.';
        
        if (isGuest) {
          const aiMsg = guestMode.addMessage(conv!.id, aiResponse, 'assistant');
          setGuestMessages(prev => [...prev, aiMsg]);
        } else {
          await authConversations.addMessage(aiResponse, 'assistant');
        }
        setLoading(false);
      }, isBuildMode ? 5000 : 2000);
    }
  };

  const handleSignIn = () => {
    navigate('/auth');
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

  return (
    <div className="flex h-screen overflow-hidden">
      <AnimatedBackground />
      
      {/* Sidebar - hidden on mobile when collapsed */}
      <div className={isMobile && sidebarCollapsed ? 'hidden' : ''}>
        <ChatSidebar
          conversations={conversations}
          currentConversation={currentConversation}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
          isCollapsed={sidebarCollapsed && !isMobile}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          isGuest={isGuest}
          onSignIn={handleSignIn}
        />
      </div>

      {/* Mobile overlay when sidebar is open */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen">
        {isBuildMode ? (
          <BuildMode
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={loading || buildState.isBuilding}
            device={device}
            onDeviceChange={setDevice}
            buildState={buildState}
          />
        ) : (
          <ChatArea
            currentConversation={currentConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={loading || authConversations.loading}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            isSidebarCollapsed={sidebarCollapsed}
            isBuildMode={isBuildMode}
            onToggleBuildMode={toggleBuildMode}
          />
        )}
      </div>
    </div>
  );
}
