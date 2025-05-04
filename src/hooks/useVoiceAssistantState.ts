
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useConversationHistory } from '@/hooks/useConversationHistory';
import { useVoiceCommandProcessor } from '@/hooks/useVoiceCommandProcessor';
import { toast } from '@/components/ui/use-toast';

export const useVoiceAssistantState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [autoSpeaking, setAutoSpeaking] = useState(true); // Auto-speak enabled by default
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();
  const currentPage = location.pathname;
  const isInitializedRef = useRef(false);
  
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
    setResponse,
    isProcessing: isCommandProcessing,
    resetCommand
  } = useVoiceCommandProcessor(
    transcript, 
    setTranscript, 
    stopListening, 
    (text) => speakResponse(text, detectedLanguage), // Pass the detected language for response
    addMessageToHistory,
    currentPage
  );
  
  // Update local processing state when the command processor's state changes
  useEffect(() => {
    setIsProcessing(isCommandProcessing);
  }, [isCommandProcessing]);
  
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
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      
      if (!isSupported) {
        toast({
          title: "Speech Recognition Not Supported",
          description: "Your browser doesn't support speech recognition. Try using Chrome or Edge.",
          variant: "destructive",
        });
      }
    }
  }, [isSupported]);
  
  // Auto-speak responses when enabled
  useEffect(() => {
    if (autoSpeaking && response && !isSpeaking && !isLoading) {
      console.log('Auto-speaking response:', response);
      speakResponse(response, detectedLanguage);
    }
  }, [response, autoSpeaking, isSpeaking, isLoading, speakResponse, detectedLanguage]);
  
  // Handle end of speech or process command when the user stops talking
  const speechPauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef<string>('');
  
  useEffect(() => {
    // Only process when there's a meaningful change in the transcript
    if (transcript && transcript !== lastTranscriptRef.current && isListening && !isLoading && !isProcessing) {
      console.log('Transcript changed, scheduling processing');
      // Save current transcript for comparison
      lastTranscriptRef.current = transcript;
      
      // Clear any existing timer
      if (speechPauseTimerRef.current) {
        clearTimeout(speechPauseTimerRef.current);
      }
      
      // Set a new timer to process the command after a pause in speech
      speechPauseTimerRef.current = setTimeout(() => {
        console.log('Processing after pause in speech');
        if (!isProcessing && !isLoading) {
          processCommand();
        }
      }, 1500); // 1.5 second pause before processing
    }
    
    // If we're not listening or loading or don't have a transcript, clear any timer
    if (!isListening || isLoading || !transcript) {
      if (speechPauseTimerRef.current) {
        clearTimeout(speechPauseTimerRef.current);
        speechPauseTimerRef.current = null;
      }
    }
    
    return () => {
      if (speechPauseTimerRef.current) {
        clearTimeout(speechPauseTimerRef.current);
        speechPauseTimerRef.current = null;
      }
    };
  }, [transcript, isListening, isLoading, isProcessing, processCommand]);
  
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
      console.log('Voice dialog closed, cleaning up');
      // When closing, wait a bit in case there's audio playing
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
      console.log('Voice dialog opened, initializing');
      // When opening, start listening automatically with a clean state
      setTimeout(() => {
        setTranscript('');
        lastTranscriptRef.current = '';
        resetCommand();
        
        // Only start listening if we're not already
        if (!isListening) {
          console.log('Starting listening on dialog open');
          startListening();
        }
      }, 500);
    }
  }, [isOpen, clearHistory, setResponse, isListening, startListening, setTranscript, resetCommand, stopListening, stopSpeaking]);

  // Stop any ongoing speech when component unmounts
  useEffect(() => {
    return () => {
      console.log('Voice assistant unmounting, cleaning up');
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
    setDetectedLanguage,
    isProcessing,
    setIsProcessing
  };
};
