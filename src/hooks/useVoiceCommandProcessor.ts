
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
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState('');
  
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
    // Prevent multiple simultaneous processing
    if (isProcessing || !transcript.trim()) return;
    
    // Prevent processing the same transcript multiple times
    if (transcript === lastProcessedTranscript) {
      console.log('This transcript has already been processed, skipping');
      return;
    }
    
    try {
      setIsProcessing(true);
      setIsLoading(true);
      // Store the current transcript so we don't process it again
      setLastProcessedTranscript(transcript);
      
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
      setRetryAttempt(0); // Reset retry counter on success
      
      // Clear the transcript only after processing is complete
      setTranscript('');
      setIsLoading(false);
      setIsProcessing(false);
      
    } catch (error) {
      console.error('Error processing voice command', error);
      
      // Implement retry mechanism
      if (retryAttempt < 2) {
        setRetryAttempt(prev => prev + 1);
        
        toast({
          title: "Retrying",
          description: "Having trouble processing your request. Trying again...",
          variant: "default",
        });
        
        // Small delay before retry
        setTimeout(() => {
          setIsProcessing(false);
          setIsLoading(false);
          processCommand();
        }, 1000);
      } else {
        toast({
          title: "Processing Error",
          description: "There was an error processing your request. Please try again with different wording.",
          variant: "destructive",
        });
        
        // Add error message to conversation history
        addMessageToHistory('assistant', "I'm sorry, I had trouble understanding that. Could you try rephrasing your request?");
        setResponse("I'm sorry, I had trouble understanding that. Could you try rephrasing your request?");
        setRetryAttempt(0); // Reset counter
        
        // Clear the transcript to allow for a new command
        setTranscript('');
        setLastProcessedTranscript('');
        setIsLoading(false);
        setIsProcessing(false);
      }
    }
  };
  
  // Function to reset the command state
  const resetCommand = () => {
    setIsProcessing(false);
    setIsLoading(false);
    setRetryAttempt(0);
    setLastProcessedTranscript('');
  };
  
  return {
    isLoading,
    response,
    processCommand,
    setResponse,
    isProcessing,
    resetCommand
  };
};
