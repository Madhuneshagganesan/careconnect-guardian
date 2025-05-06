
import { useState, useRef, useCallback, useEffect } from 'react';
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
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Process commands with debouncing to prevent multiple executions
  const processCommand = useCallback(async () => {
    // Don't process if there's no transcript or if it's the same as last processed
    if (!transcript.trim() || transcript === lastProcessedRef.current) {
      return;
    }
    
    // Already loading, don't process again
    if (isLoading) return;
    
    setIsLoading(true);
    console.log("Processing voice command:", transcript);
    
    try {
      // Store the current transcript to prevent reprocessing
      const currentTranscript = transcript;
      lastProcessedRef.current = currentTranscript;
      
      // Clear timeout if it exists
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }
      
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
      
      // Add assistant response to history
      addMessageToHistory('assistant', responseText);
      
      // Clear transcript
      setTranscript('');
      
    } catch (error) {
      console.error('Error processing command:', error);
      const errorMessage = "I'm sorry, I had trouble processing that request.";
      setResponse(errorMessage);
      addMessageToHistory('assistant', errorMessage);
      
      toast({
        title: "Processing Error",
        description: "There was an error processing your voice command.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      
      // Set timeout to allow processing again after a delay
      processingTimeoutRef.current = setTimeout(() => {
        lastProcessedRef.current = '';
      }, 2000); // Increased delay to prevent rapid reprocessing
    }
  }, [transcript, navigate, addMessageToHistory, speakResponse, currentPage, setTranscript, isLoading]);
  
  // Reset for new command
  const resetCommand = useCallback(() => {
    lastProcessedRef.current = '';
    setResponse('');
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    isLoading,
    response,
    processCommand,
    setResponse,
    resetCommand
  };
};
