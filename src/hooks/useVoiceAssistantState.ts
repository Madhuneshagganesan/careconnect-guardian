
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useConversationHistory } from './useConversationHistory';
import { useVoiceCommandProcessor } from './useVoiceCommandProcessor';

export const useVoiceAssistantState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [autoSpeaking, setAutoSpeaking] = useState(true);
  const location = useLocation();
  const currentPage = location.pathname;
  
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
    (text) => speakResponse(text, detectedLanguage),
    addMessageToHistory,
    currentPage
  );

  // Speech pause timer for processing commands
  const speechPauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef<string>('');
  
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
  
  // Auto-speak responses when enabled
  useEffect(() => {
    if (autoSpeaking && response && !isSpeaking && !isLoading) {
      speakResponse(response, detectedLanguage);
    }
  }, [response, autoSpeaking, isSpeaking, isLoading, speakResponse, detectedLanguage]);
  
  // Process command when speech pauses
  useEffect(() => {
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
          processCommand();
        }
      }, 1500); // 1.5 second pause
    }
    
    // Clear timer when conditions change
    if (!isListening || isLoading || !transcript) {
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
  }, [transcript, isListening, isLoading, processCommand]);
  
  // Reset conversation when dialog is opened/closed
  useEffect(() => {
    if (!isOpen) {
      // When closing
      const timeoutId = setTimeout(() => {
        clearHistory();
        setResponse('');
        setTranscript('');
        lastTranscriptRef.current = '';
        resetCommand();
        stopListening();
        stopSpeaking();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      // When opening
      setTimeout(() => {
        setTranscript('');
        lastTranscriptRef.current = '';
        resetCommand();
        if (!isListening) {
          startListening();
        }
      }, 500);
    }
  }, [isOpen, clearHistory, setResponse, startListening, stopListening, stopSpeaking, setTranscript, resetCommand, isListening]);
  
  // Show welcome toast on first visit
  useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem('voiceAssistantWelcomeShown');
    if (!hasShownWelcome) {
      setTimeout(() => {
        sessionStorage.setItem('voiceAssistantWelcomeShown', 'true');
      }, 3000);
    }
  }, []);

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
