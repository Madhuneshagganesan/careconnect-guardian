
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('en-US');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isInitializedRef = useRef(false);
  const restartTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check browser support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isRecognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
      setIsSupported(isRecognitionSupported);
      
      if (isRecognitionSupported && !isInitializedRef.current) {
        initializeRecognition();
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          setIsListening(false);
        } catch (e) {
          console.error('Error stopping speech recognition on unmount:', e);
        }
      }
      
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
      }
    };
  }, []);

  // Initialize speech recognition
  const initializeRecognition = useCallback(() => {
    if (isInitializedRef.current || !window) return;
    
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = detectedLanguage;
        
        // Set up handlers
        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
          setIsListening(true);
        };
        
        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          let currentInterim = '';

          for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }

          if (finalTranscript.trim()) {
            setTranscript(prev => (prev + ' ' + finalTranscript).trim());
          }
          
          setInterimTranscript(currentInterim);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          
          if (event.error === 'not-allowed') {
            toast({
              title: "Microphone Access Denied",
              description: "Please allow microphone access to use voice recognition.",
              variant: "destructive",
            });
            setIsListening(false);
          } else if (event.error === 'network') {
            // Try to restart on network errors
            restartRecognition();
          }
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          
          // If we're supposed to be listening but recognition stopped, try to restart
          if (isListening) {
            restartRecognition();
          } else {
            setIsListening(false);
          }
        };
        
        isInitializedRef.current = true;
      }
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      setIsSupported(false);
    }
  }, [detectedLanguage, isListening]);

  // Restart recognition after errors or unexpected stops
  const restartRecognition = useCallback(() => {
    // Cancel any existing restart timers
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    
    // Don't restart if we intentionally stopped
    if (!isListening) return;
    
    console.log('Attempting to restart speech recognition');
    
    restartTimerRef.current = setTimeout(() => {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start();
          console.log('Speech recognition restarted');
        }
      } catch (e) {
        console.error('Failed to restart speech recognition:', e);
        setIsListening(false);
      }
    }, 300);
  }, [isListening]);

  // Update recognition language when changed
  useEffect(() => {
    if (recognitionRef.current && isInitializedRef.current) {
      recognitionRef.current.lang = detectedLanguage;
    }
  }, [detectedLanguage]);

  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }
    
    if (isListening) {
      console.log('Already listening, not starting again');
      return;
    }
    
    // Make sure recognition is initialized
    if (!isInitializedRef.current) {
      initializeRecognition();
    }
    
    try {
      if (recognitionRef.current) {
        // Reset transcript when starting new listening session
        setTranscript('');
        setInterimTranscript('');
        
        // Start recognition after a small delay to ensure everything is set up
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
            console.log('Speech recognition started after delay');
          } catch (e) {
            console.error('Failed to start speech recognition after delay:', e);
            setIsListening(false);
          }
        }, 100);
      }
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
      toast({
        title: "Recognition Error",
        description: "Could not start voice recognition. Please try again.",
        variant: "destructive",
      });
    }
  }, [isSupported, isListening, initializeRecognition]);

  // Stop listening
  const stopListening = useCallback(() => {
    try {
      if (recognitionRef.current) {
        console.log('Stopping speech recognition');
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setInterimTranscript('');
      
      // Clear any restart timers
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }
    } catch (e) {
      console.error('Error stopping speech recognition:', e);
      setIsListening(false);
    }
  }, []);

  // Toggle listening state
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
    setTranscript,
    isSupported,
    detectedLanguage,
    setDetectedLanguage,
  };
};
