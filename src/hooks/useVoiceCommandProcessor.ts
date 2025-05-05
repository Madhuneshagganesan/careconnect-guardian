
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { findBestCommandMatch, processVoiceCommand } from '@/utils/voiceCommands';

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
  const lastProcessedRef = useRef('');
  
  // Process commands
  const processCommand = useCallback(async () => {
    if (!transcript.trim() || transcript === lastProcessedRef.current) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Store the current transcript to prevent reprocessing
      const currentTranscript = transcript;
      lastProcessedRef.current = currentTranscript;
      
      // Process the command
      const responseText = await processVoiceCommand(
        currentTranscript,
        navigate,
        addMessageToHistory,
        speakResponse,
        currentPage
      );
      
      // Set response
      setResponse(responseText);
      
      // Clear transcript
      setTranscript('');
      
    } catch (error) {
      console.error('Error processing command:', error);
      const errorMessage = "I'm sorry, I had trouble processing that request.";
      setResponse(errorMessage);
      addMessageToHistory('assistant', errorMessage);
      speakResponse(errorMessage);
      
      toast({
        title: "Processing Error",
        description: "There was an error processing your voice command.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [transcript, navigate, addMessageToHistory, speakResponse, currentPage, setTranscript]);
  
  // Reset for new command
  const resetCommand = useCallback(() => {
    lastProcessedRef.current = '';
  }, []);
  
  return {
    isLoading,
    response,
    processCommand,
    setResponse,
    resetCommand
  };
};
