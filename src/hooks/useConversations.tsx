import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  model: string;
  created_at: string;
  updated_at: string;
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setConversations(data);
    }
  }, [user]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data as Message[]);
    }
  }, []);

  // Create a new conversation
  const createConversation = async (model: string = 'GPT-4') => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        title: 'Ny konversation',
        model,
      })
      .select()
      .single();

    if (!error && data) {
      setConversations(prev => [data, ...prev]);
      setCurrentConversation(data);
      setMessages([]);
      return data;
    }
    return null;
  };

  // Update conversation title
  const updateConversationTitle = async (conversationId: string, title: string) => {
    const { error } = await supabase
      .from('conversations')
      .update({ title })
      .eq('id', conversationId);

    if (!error) {
      setConversations(prev =>
        prev.map(c => (c.id === conversationId ? { ...c, title } : c))
      );
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(prev => prev ? { ...prev, title } : null);
      }
    }
  };

  // Delete a conversation
  const deleteConversation = async (conversationId: string) => {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (!error) {
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
    }
  };

  // Add a message
  const addMessage = async (content: string, role: 'user' | 'assistant') => {
    if (!currentConversation) return null;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversation.id,
        role,
        content,
      })
      .select()
      .single();

    if (!error && data) {
      setMessages(prev => [...prev, data as Message]);
      
      // Update conversation title based on first user message
      if (role === 'user' && messages.length === 0) {
        const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
        await updateConversationTitle(currentConversation.id, title);
      }
      
      return data as Message;
    }
    return null;
  };

  // Select a conversation
  const selectConversation = async (conversation: Conversation) => {
    setCurrentConversation(conversation);
    await fetchMessages(conversation.id);
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchConversations();
    } else {
      setConversations([]);
      setCurrentConversation(null);
      setMessages([]);
    }
  }, [user, fetchConversations]);

  return {
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
    setMessages,
    fetchConversations,
  };
}
