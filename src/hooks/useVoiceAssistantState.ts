
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
    // Using a small delay to ensure audio context is ready
    setTimeout(() => {
      if (text && text.trim()) {
        speakResponse(text);
      }
    }, 100);
  }, [speakResponse]);
  
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
        stopSpeaking();
        
        // Then wait for cleanup before starting again
        setTimeout(() => {
          isInitialized.current = true;
          processingRef.current = false;
          
          try {
            // Only start listening if not already listening
            if (!isListening) {
              startListening();
            }
          } catch (e) {
            console.error('Failed to start listening on dialog open:', e);
          }
        }, 800); // Increased delay to ensure proper cleanup
      }, 300);
    } else {
      // When closing, perform thorough cleanup
      clearHistory();
      setResponse('');
      setTranscript('');
      resetCommand();
      processingRef.current = false;
      
      try {
        // Stop in sequence to avoid conflicts
        stopListening();
        setTimeout(() => {
          stopSpeaking();
        }, 100);
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
  
  // Auto-speak responses when enabled
  useEffect(() => {
    if (autoSpeaking && response && !isSpeaking && !isLoading) {
      try {
        setTimeout(() => {
          speakResponse(response);
        }, 300);
      } catch (e) {
        console.error('Error auto-speaking response:', e);
      }
    }
  }, [response, autoSpeaking, isSpeaking, isLoading, speakResponse]);
  
  // Process command when speech pauses with improved timing
  useEffect(() => {
    // Only set up listener when dialog is open
    if (!isOpen || !isInitialized.current) return;
    
    // Process after pause in speech
    if (transcript && transcript.trim() && isListening && !isLoading && !processingRef.current) {
      // Clear existing timer
      if (speechPauseTimerRef.current) {
        clearTimeout(speechPauseTimerRef.current);
      }
      
      // Set new timer with increased pause time
      speechPauseTimerRef.current = setTimeout(() => {
        if (!isLoading && transcript.trim() && !processingRef.current) {
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
              speakResponse(errorMessage);
            }
          } finally {
            // Reset processing flag after delay to allow new commands
            setTimeout(() => {
              processingRef.current = false;
              setTranscript('');
            }, 2000);
          }
        }
      }, 1500); // Increased pause time for better accuracy
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
    setTranscript
  ]);

  // Cleanup on unmount with improved stability
  useEffect(() => {
    return () => {
      // First stop listening, then stop speaking with a delay
      try {
        stopListening();
        setTimeout(() => {
          stopSpeaking();
        }, 100);
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
      stopListening();
      setTimeout(() => {
        stopSpeaking();
      }, 100);
      setTranscript('');
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
    speakResponse: speakResponseCallback,
    stopSpeaking,
    voices,
    currentVoice,
    setVoice,
    detectedLanguage,
    setDetectedLanguage
  };
};
