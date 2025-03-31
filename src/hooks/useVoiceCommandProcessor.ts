
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { processVoiceCommand } from '@/utils/voiceCommands';

export const useVoiceCommandProcessor = (
  transcript: string, 
  setTranscript: (text: string) => void,
  stopListening: () => void,
  speakResponse: (text: string) => void,
  addMessageToHistory: (role: string, content: string) => void,
  currentPage: string
) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  
  useEffect(() => {
    // Listen for the custom closeVoiceAssistant event
    const handleCloseAssistant = () => {
      // This will be used by the VoiceAssistant component
      document.dispatchEvent(new CustomEvent('voiceAssistantClose'));
    };
    
    document.addEventListener('closeVoiceAssistant', handleCloseAssistant);
    
    return () => {
      document.removeEventListener('closeVoiceAssistant', handleCloseAssistant);
    };
  }, []);
  
  const processCommand = async () => {
    if (!transcript.trim()) return;
    
    setIsLoading(true);
    stopListening();
    
    try {
      // Add user input to conversation history
      addMessageToHistory('user', transcript);
      
      const command = transcript.toLowerCase().trim();
      
      // Process the command with current page context
      const responseText = await processVoiceCommand(
        command,
        navigate,
        addMessageToHistory,
        speakResponse,
        currentPage
      );
      
      setResponse(responseText);
    } catch (error) {
      console.error('Error processing voice command', error);
      toast({
        title: "Processing Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    response,
    processCommand,
    setResponse
  };
};
