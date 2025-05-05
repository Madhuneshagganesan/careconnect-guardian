
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useConversationHistory } from './useConversationHistory';
import { useVoiceCommandProcessor } from './useVoiceCommandProcessor';
import { toast } from '@/hooks/use-toast';

export const useVoiceAssistantState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [autoSpeaking, setAutoSpeaking] = useState(true);
  const location = useLocation();
  const currentPage = location.pathname;
  
  // Speech pause timer for processing commands
  const speechPauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef<string>('');
  const hasAttemptedInit = useRef(false);
  
  // Initialize hooks
  const { 
    isListening, 
    transcript, 
    interimTranscript,
    toggleListening, 
    stopListening, 
    startListening,
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
    setVoice
  } = useSpeechSynthesis();
  
  const { 
    conversationHistory, 
    addMessageToHistory,
    clearHistory
  } = useConversationHistory();

  // Initialize command processor
  const speakResponseCallback = useCallback((text: string) => {
    speakResponse(text, detectedLanguage);
  }, [speakResponse, detectedLanguage]);
  
  const { 
    isLoading, 
    response, 
    processCommand, 
    setResponse,
    resetCommand
  } = useVoiceCommandProcessor(
    transcript, 
    setTranscript, 
    stopListening, 
    speakResponseCallback,
    addMessageToHistory,
    currentPage
  );

  // Handle dialog opening
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    
    if (open) {
      // When opening
      if (!hasAttemptedInit.current) {
        hasAttemptedInit.current = true;
        setTimeout(() => {
          setTranscript('');
          lastTranscriptRef.current = '';
          resetCommand();
          
          // Start listening with a delay to ensure UI is ready
          setTimeout(() => {
            if (!isListening) {
              startListening();
            }
          }, 300);
        }, 300);
      }
    } else {
      // When closing
      clearHistory();
      setResponse('');
      setTranscript('');
      lastTranscriptRef.current = '';
      resetCommand();
      stopListening();
      stopSpeaking();
      
      if (speechPauseTimerRef.current) {
        clearTimeout(speechPauseTimerRef.current);
        speechPauseTimerRef.current = null;
      }
    }
  }, [clearHistory, isListening, resetCommand, setResponse, setTranscript, startListening, stopListening, stopSpeaking]);
  
  // Listen for voice assistant close event
  useEffect(() => {
    const handleVoiceAssistantClose = () => {
      setIsOpen(false);
    };
    
    document.addEventListener('closeVoiceAssistant', handleVoiceAssistantClose);
    
    return () => {
      document.removeEventListener('closeVoiceAssistant', handleVoiceAssistantClose);
    };
  }, []);
  
  // Auto-speak responses when enabled
  useEffect(() => {
    if (autoSpeaking && response && !isSpeaking && !isLoading) {
      speakResponse(response, detectedLanguage);
    }
  }, [response, autoSpeaking, isSpeaking, isLoading, speakResponse, detectedLanguage]);
  
  // Process command when speech pauses
  useEffect(() => {
    // Only set up listener when dialog is open
    if (!isOpen) return;
    
    // Process after pause in speech
    if (transcript && transcript !== lastTranscriptRef.current && isListening && !isLoading) {
      // Save current transcript
      lastTranscriptRef.current = transcript;
      
      // Clear existing timer
      if (speechPauseTimerRef.current) {
        clearTimeout(speechPauseTimerRef.current);
      }
      
      // Set new timer
      speechPauseTimerRef.current = setTimeout(() => {
        if (!isLoading) {
          // Add user input to conversation history first
          addMessageToHistory('user', transcript);
          processCommand();
        }
      }, 1500); // 1.5 second pause
    }
    
    // Clear timer when conditions change
    if (!isListening || isLoading || !transcript || !isOpen) {
      if (speechPauseTimerRef.current) {
        clearTimeout(speechPauseTimerRef.current);
        speechPauseTimerRef.current = null;
      }
    }
    
    return () => {
      if (speechPauseTimerRef.current) {
        clearTimeout(speechPauseTimerRef.current);
      }
    };
  }, [transcript, isListening, isLoading, processCommand, addMessageToHistory, isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListening();
      if (speechPauseTimerRef.current) {
        clearTimeout(speechPauseTimerRef.current);
      }
    };
  }, [stopSpeaking, stopListening]);

  // Show welcome toast on first visit
  useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem('voiceAssistantWelcomeShown');
    if (!hasShownWelcome) {
      setTimeout(() => {
        sessionStorage.setItem('voiceAssistantWelcomeShown', 'true');
      }, 3000);
    }
  }, []);

  return {
    isOpen,
    setIsOpen: handleOpenChange,
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
    speakResponse: speakResponseCallback,
    stopSpeaking,
    voices,
    currentVoice,
    setVoice,
    detectedLanguage,
    setDetectedLanguage
  };
};
