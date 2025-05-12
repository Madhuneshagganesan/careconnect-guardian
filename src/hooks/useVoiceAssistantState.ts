
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
  
  // Prevent multiple processing cycles
  const processingRef = useRef(false);
  const speechPauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef(false);
  const stateStabilizedRef = useRef(false);
  
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

  // Initialize command processor with a unified approach to speaking
  const speakResponseCallback = useCallback((text: string) => {
    // Using a larger delay to ensure audio context is ready
    setTimeout(() => {
      if (text && text.trim() && !isSpeaking) {
        speakResponse(text);
      }
    }, 300);
  }, [speakResponse, isSpeaking]);
  
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

  // Handle dialog opening with more stable initialization
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    
    if (open) {
      // When opening
      stateStabilizedRef.current = false; // Mark state as unstable
      
      setTimeout(() => {
        setTranscript('');
        resetCommand();
        
        // Clear any existing timers
        if (speechPauseTimerRef.current) {
          clearTimeout(speechPauseTimerRef.current);
          speechPauseTimerRef.current = null;
        }
        
        // First ensure recognition is stopped
        stopListening();
        
        // Also ensure speech is stopped
        setTimeout(() => {
          stopSpeaking();
          
          // Then wait for cleanup before starting again
          setTimeout(() => {
            isInitialized.current = true;
            processingRef.current = false;
            stateStabilizedRef.current = true; // Mark state as stable
            
            try {
              // Only start listening if not already listening
              if (!isListening) {
                startListening();
              }
            } catch (e) {
              console.error('Failed to start listening on dialog open:', e);
            }
          }, 1000); // Increased delay to ensure proper cleanup
        }, 500);
      }, 300);
    } else {
      // When closing, perform thorough cleanup
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
        }, 500);
      } catch (e) {
        console.error('Error during cleanup on close:', e);
      }
      
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
  
  // Auto-speak responses when enabled with improved timing
  useEffect(() => {
    if (autoSpeaking && response && !isSpeaking && !isLoading && stateStabilizedRef.current) {
      try {
        setTimeout(() => {
          if (!isSpeaking && response) {
            speakResponse(response);
          }
        }, 600); // Increased delay for stability
      } catch (e) {
        console.error('Error auto-speaking response:', e);
      }
    }
  }, [response, autoSpeaking, isSpeaking, isLoading, speakResponse]);
  
  // Process command when speech pauses with improved timing
  useEffect(() => {
    // Only set up listener when dialog is open and state is stabilized
    if (!isOpen || !isInitialized.current || !stateStabilizedRef.current) return;
    
    // Process after pause in speech
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
          
          console.log("Processing transcript:", transcript);
          
          // Add user input to conversation history
          addMessageToHistory('user', transcript);
          
          try {
            // Process the command
            processCommand();
          } catch (e) {
            console.error('Error processing command after pause:', e);
            
            // Provide feedback on failure
            const errorMessage = "I'm sorry, I couldn't process that command.";
            addMessageToHistory('assistant', errorMessage);
            setResponse(errorMessage);
            
            if (autoSpeaking) {
              // Wait for system to stabilize before speaking
              setTimeout(() => {
                if (!isSpeaking) {
                  speakResponse(errorMessage);
                }
              }, 500);
            }
          } finally {
            // Reset processing flag after delay to allow new commands
            setTimeout(() => {
              processingRef.current = false;
              setTranscript('');
            }, 2000);
          }
        }
      }, 2000); // Increased pause time for better accuracy
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
    autoSpeaking, 
    speakResponse,
    setTranscript,
    isSpeaking
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
        }, 500);
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
      }, 500);
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
    setDetectedLanguage
  };
};
