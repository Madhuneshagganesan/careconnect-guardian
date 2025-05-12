
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
  const [isSystemStable, setIsSystemStable] = useState(false);
  const location = useLocation();
  const currentPage = location.pathname;
  
  // Prevent multiple processing cycles
  const processingRef = useRef(false);
  const speechPauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef(false);
  const stateStabilizedRef = useRef(false);
  const systemActionsInProgressRef = useRef(0);
  
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
    speakResponse,
    addMessageToHistory,
    currentPage
  );

  // Tracking state transitions for better stability
  const incrementActionCounter = useCallback(() => {
    systemActionsInProgressRef.current += 1;
    setIsSystemStable(false);
  }, []);

  const decrementActionCounter = useCallback(() => {
    systemActionsInProgressRef.current = Math.max(0, systemActionsInProgressRef.current - 1);
    if (systemActionsInProgressRef.current === 0) {
      setTimeout(() => {
        setIsSystemStable(true);
      }, 300);
    }
  }, []);

  // Handle dialog opening with more stable initialization
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    
    if (open) {
      // When opening, stabilize the system state
      incrementActionCounter();
      stateStabilizedRef.current = false; // Mark state as unstable
      
      // Sequential cleanup and initialization
      setTimeout(() => {
        // First clear state
        setTranscript('');
        resetCommand();
        
        // Clear any existing timers
        if (speechPauseTimerRef.current) {
          clearTimeout(speechPauseTimerRef.current);
          speechPauseTimerRef.current = null;
        }
        
        // 1. First ensure recognition is stopped
        stopListening();
        
        // 2. Then ensure speech is stopped with a delay
        setTimeout(() => {
          stopSpeaking();
          
          // 3. Wait for cleanup before starting again
          setTimeout(() => {
            isInitialized.current = true;
            processingRef.current = false;
            stateStabilizedRef.current = true; // Mark state as stable
            
            try {
              // Only start listening if not already listening
              if (!isListening) {
                startListening();
              }
              decrementActionCounter();
            } catch (e) {
              console.error('Failed to start listening on dialog open:', e);
              decrementActionCounter();
            }
          }, 1500); // Increased delay to ensure proper cleanup
        }, 800);
      }, 500);
    } else {
      // When closing, perform thorough cleanup
      incrementActionCounter();
      stateStabilizedRef.current = false; // Mark state as unstable
      clearHistory();
      setResponse('');
      setTranscript('');
      resetCommand();
      processingRef.current = false;
      
      try {
        // Stop in sequence to avoid conflicts
        stopSpeaking();
        
        setTimeout(() => {
          stopListening();
          decrementActionCounter();
        }, 800);
      } catch (e) {
        console.error('Error during cleanup on close:', e);
        decrementActionCounter();
      }
      
      if (speechPauseTimerRef.current) {
        clearTimeout(speechPauseTimerRef.current);
        speechPauseTimerRef.current = null;
      }
    }
  }, [clearHistory, isListening, resetCommand, setResponse, setTranscript, startListening, 
      stopListening, stopSpeaking, incrementActionCounter, decrementActionCounter]);
  
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
  
  // Auto-speak responses with improved timing
  useEffect(() => {
    if (autoSpeaking && response && !isSpeaking && !isLoading && stateStabilizedRef.current) {
      try {
        setTimeout(() => {
          if (!isSpeaking && response && stateStabilizedRef.current) {
            speakResponse(response);
          }
        }, 800); // Increased delay for stability
      } catch (e) {
        console.error('Error auto-speaking response:', e);
      }
    }
  }, [response, autoSpeaking, isSpeaking, isLoading, speakResponse]);
  
  // Process command when speech pauses with improved debouncing
  useEffect(() => {
    // Only set up listener when dialog is open and state is stabilized
    if (!isOpen || !isInitialized.current || !stateStabilizedRef.current) return;
    
    // Process after significant pause in speech
    if (transcript && transcript.trim() && isListening && !isLoading && !processingRef.current) {
      // Clear existing timer
      if (speechPauseTimerRef.current) {
        clearTimeout(speechPauseTimerRef.current);
      }
      
      // Set new timer with increased pause time
      speechPauseTimerRef.current = setTimeout(() => {
        if (!isLoading && transcript.trim() && !processingRef.current && stateStabilizedRef.current) {
          // Set processing flag to prevent multiple processing
          processingRef.current = true;
          
          console.log("Processing transcript after pause:", transcript);
          
          // Add user input to conversation history
          addMessageToHistory('user', transcript);
          
          try {
            // Process the command
            incrementActionCounter();
            processCommand();
            
            // Reset processing flag after delay to allow new commands
            setTimeout(() => {
              processingRef.current = false;
              decrementActionCounter();
            }, 3000);
          } catch (e) {
            console.error('Error processing command after pause:', e);
            
            // Provide feedback on failure
            const errorMessage = "I'm sorry, I couldn't process that command.";
            addMessageToHistory('assistant', errorMessage);
            setResponse(errorMessage);
            
            processingRef.current = false;
            decrementActionCounter();
            
            // Clear transcript
            setTimeout(() => {
              setTranscript('');
            }, 500);
          }
        }
      }, 2500); // Increased pause time for better accuracy
    }
    
    return () => {
      if (speechPauseTimerRef.current) {
        clearTimeout(speechPauseTimerRef.current);
        speechPauseTimerRef.current = null;
      }
    };
  }, [
    transcript, 
    isListening, 
    isLoading, 
    processCommand, 
    addMessageToHistory, 
    isOpen, 
    setTranscript,
    incrementActionCounter,
    decrementActionCounter
  ]);

  // Cleanup on unmount with improved stability
  useEffect(() => {
    return () => {
      // First stop speaking
      try {
        stopSpeaking();
        
        // Then stop listening with a delay
        setTimeout(() => {
          stopListening();
        }, 800);
      } catch (e) {
        console.error('Error during cleanup on unmount:', e);
      }
      
      if (speechPauseTimerRef.current) {
        clearTimeout(speechPauseTimerRef.current);
        speechPauseTimerRef.current = null;
      }
    };
  }, [stopSpeaking, stopListening]);

  // If dialog is closed unexpectedly, make sure we clean up
  useEffect(() => {
    if (!isOpen && isInitialized.current) {
      // First stop speaking
      stopSpeaking();
      
      // Then stop listening with a delay
      setTimeout(() => {
        stopListening();
        setTranscript('');
      }, 800);
    }
  }, [isOpen, stopListening, stopSpeaking, setTranscript]);

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
    startListening,
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
    isSystemStable
  };
};
