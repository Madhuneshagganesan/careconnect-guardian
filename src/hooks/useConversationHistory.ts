
import { useState } from 'react';

export interface Message {
  role: string;
  content: string;
}

export const useConversationHistory = () => {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);

  const addMessageToHistory = (role: string, content: string) => {
    setConversationHistory(prev => [...prev, { role, content }]);
  };

  const clearHistory = () => {
    setConversationHistory([]);
  };

  return {
    conversationHistory,
    addMessageToHistory,
    clearHistory
  };
};
