
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useConversationHistory } from '@/hooks/useConversationHistory';
import { useVoiceCommandProcessor } from '@/hooks/useVoiceCommandProcessor';
import { toast } from '@/components/ui/use-toast';

export const useVoiceAssistantState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [autoSpeaking, setAutoSpeaking] = useState(true); // Auto-speak enabled by default
  const location = useLocation();
  const currentPage = location.pathname;
  
  // Initialize hooks
  const { 
    isListening, 
    transcript, 
    interimTranscript,
    toggleListening, 
    stopListening, 
    setTranscript,
    isSupported,
    detectedLanguage,
    setDetectedLanguage
  } = useSpeechRecognition();
  
  const { 
    isSpeaking, 
    speakResponse, 
    stopSpeaking,
    voices,
    currentVoice,
    setVoice,
    getVoicesForLanguage
  } = useSpeechSynthesis();
  
  const { 
    conversationHistory, 
    addMessageToHistory,
    clearHistory
  } = useConversationHistory();
  
  const { 
    isLoading, 
    response, 
    processCommand, 
    setResponse 
  } = useVoiceCommandProcessor(
    transcript, 
    setTranscript, 
    stopListening, 
    (text) => speakResponse(text, detectedLanguage), // Pass the detected language for response
    addMessageToHistory,
    currentPage
  );
  
  // Listen for voice assistant close event
  useEffect(() => {
    const handleVoiceAssistantClose = () => {
      setIsOpen(false);
    };
    
    document.addEventListener('voiceAssistantClose', handleVoiceAssistantClose);
    
    return () => {
      document.removeEventListener('voiceAssistantClose', handleVoiceAssistantClose);
    };
  }, []);
  
  // Check if browser supports speech recognition
  useEffect(() => {
    if (!isSupported) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Try using Chrome or Edge.",
        variant: "destructive",
      });
    }
  }, [isSupported]);
  
  // Auto-speak responses when enabled
  useEffect(() => {
    if (autoSpeaking && response && !isSpeaking && !isLoading) {
      speakResponse(response, detectedLanguage);
    }
  }, [response, autoSpeaking, isSpeaking, isLoading, speakResponse, detectedLanguage]);
  
  // Automatically process voice commands after a short delay
  useEffect(() => {
    if (transcript && isListening) {
      const timeoutId = setTimeout(() => {
        processCommand();
      }, 1500); // Short delay to be more responsive
      
      return () => clearTimeout(timeoutId);
    }
  }, [transcript, isListening, processCommand]);
  
  // Let the user know the feature is ready
  useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem('voiceAssistantWelcomeShown');
    if (!hasShownWelcome) {
      setTimeout(() => {
        toast({
          title: "Voice Assistant Ready",
          description: "Click the mic icon in the bottom right corner to use voice commands",
        });
        sessionStorage.setItem('voiceAssistantWelcomeShown', 'true');
      }, 3000);
    }
  }, []);
  
  // Reset conversation when dialog is opened/closed
  useEffect(() => {
    if (!isOpen) {
      // When closing, wait a bit in case there's audio playing
      const timeoutId = setTimeout(() => {
        clearHistory();
        setResponse('');
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      // When opening, start listening automatically
      setTimeout(() => {
        if (!isListening) {
          toggleListening();
        }
      }, 500);
    }
  }, [isOpen, clearHistory, setResponse, isListening, toggleListening]);

  return {
    isOpen,
    setIsOpen,
    autoSpeaking,
    setAutoSpeaking,
    isListening,
    transcript,
    interimTranscript,
    toggleListening,
    stopListening,
    conversationHistory,
    isLoading,
    isSpeaking,
    response,
    processCommand,
    speakResponse,
    stopSpeaking,
    voices,
    currentVoice,
    setVoice,
    detectedLanguage,
    setDetectedLanguage
  };
};
