
import { useState, useCallback } from 'react';

export interface Message {
  role: string;
  content: string;
  timestamp?: number;
}

export const useConversationHistory = () => {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);

  const addMessageToHistory = useCallback((role: string, content: string) => {
    if (!content.trim()) return; // Don't add empty messages
    
    setConversationHistory(prev => {
      // Avoid duplicates
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && lastMessage.role === role && lastMessage.content === content) {
        return prev;
      }
      
      return [...prev, { 
        role, 
        content,
        timestamp: Date.now()
      }];
    });
  }, []);

  const clearHistory = useCallback(() => {
    setConversationHistory([]);
  }, []);

  return {
    conversationHistory,
    addMessageToHistory,
    clearHistory
  };
};
