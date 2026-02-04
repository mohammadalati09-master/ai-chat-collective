import { useState, useEffect, useCallback } from 'react';
import { Conversation, Message } from './useConversations';

const STORAGE_KEY = 'guest_conversations';
const MESSAGES_KEY = 'guest_messages';

export function useGuestMode() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  // Load from localStorage
  useEffect(() => {
    const storedConversations = localStorage.getItem(STORAGE_KEY);
    const storedMessages = localStorage.getItem(MESSAGES_KEY);
    
    if (storedConversations) {
      setConversations(JSON.parse(storedConversations));
    }
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // Save to localStorage
  const saveToStorage = useCallback((convs: Conversation[], msgs: Record<string, Message[]>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs));
  }, []);

  const createConversation = useCallback((model: string = 'GPT-4'): Conversation => {
    const newConv: Conversation = {
      id: `guest_${Date.now()}`,
      user_id: 'guest',
      title: 'Ny konversation',
      model,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const updated = [newConv, ...conversations];
    setConversations(updated);
    saveToStorage(updated, messages);
    return newConv;
  }, [conversations, messages, saveToStorage]);

  const updateConversationTitle = useCallback((id: string, title: string) => {
    const updated = conversations.map(c => 
      c.id === id ? { ...c, title, updated_at: new Date().toISOString() } : c
    );
    setConversations(updated);
    saveToStorage(updated, messages);
  }, [conversations, messages, saveToStorage]);

  const deleteConversation = useCallback((id: string) => {
    const updated = conversations.filter(c => c.id !== id);
    const updatedMessages = { ...messages };
    delete updatedMessages[id];
    
    setConversations(updated);
    setMessages(updatedMessages);
    saveToStorage(updated, updatedMessages);
  }, [conversations, messages, saveToStorage]);

  const addMessage = useCallback((conversationId: string, content: string, role: 'user' | 'assistant'): Message => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversation_id: conversationId,
      role,
      content,
      created_at: new Date().toISOString(),
    };
    
    const conversationMessages = messages[conversationId] || [];
    const updatedMessages = {
      ...messages,
      [conversationId]: [...conversationMessages, newMessage],
    };
    
    setMessages(updatedMessages);
    saveToStorage(conversations, updatedMessages);
    return newMessage;
  }, [conversations, messages, saveToStorage]);

  const getMessages = useCallback((conversationId: string): Message[] => {
    return messages[conversationId] || [];
  }, [messages]);

  const clearGuestData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(MESSAGES_KEY);
    setConversations([]);
    setMessages({});
  }, []);

  return {
    conversations,
    createConversation,
    updateConversationTitle,
    deleteConversation,
    addMessage,
    getMessages,
    clearGuestData,
  };
}
