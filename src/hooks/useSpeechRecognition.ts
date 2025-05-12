
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
  const consecutiveErrorsRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isStartingRef = useRef(false); // Flag to prevent multiple start attempts

  // Check browser support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isRecognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
      setIsSupported(isRecognitionSupported);
      
      if (isRecognitionSupported && !isInitializedRef.current) {
        initializeRecognition();
      }
      
      // Initialize audio context for better voice detection
      try {
        audioContextRef.current = new AudioContext();
      } catch (e) {
        console.warn('AudioContext not supported:', e);
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
      
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);

  // Initialize speech recognition with enhanced settings
  const initializeRecognition = useCallback(() => {
    if (isInitializedRef.current || !window) return;
    
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = detectedLanguage;
        recognitionRef.current.maxAlternatives = 3; // Get multiple alternatives for better accuracy
        
        // Set up handlers
        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
          setIsListening(true);
          isStartingRef.current = false; // Reset starting flag once started
          consecutiveErrorsRef.current = 0; // Reset error counter on successful start
        };
        
        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          let currentInterim = '';
          let lastIsFinal = false;
          let highestConfidence = 0;
          let bestTranscript = '';

          for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              lastIsFinal = true;
              
              // Check all alternatives to find the one with highest confidence
              for (let j = 0; j < event.results[i].length; j++) {
                if (event.results[i][j].confidence > highestConfidence) {
                  highestConfidence = event.results[i][j].confidence;
                  bestTranscript = event.results[i][j].transcript;
                }
              }
              
              finalTranscript += (bestTranscript || event.results[i][0].transcript) + ' ';
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }

          if (finalTranscript.trim()) {
            setTranscript(prev => (prev + ' ' + finalTranscript).trim());
            
            // Reset inactivity timer when we get new speech
            if (inactivityTimerRef.current) {
              clearTimeout(inactivityTimerRef.current);
            }
            inactivityTimerRef.current = setTimeout(() => {
              console.log('Voice inactivity detected, restarting recognition');
              if (isListening) {
                restartRecognition();
              }
            }, 30000); // 30 seconds of inactivity
          }
          
          setInterimTranscript(currentInterim);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          isStartingRef.current = false; // Reset starting flag on error
          
          // Increment consecutive errors counter
          consecutiveErrorsRef.current++;
          
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
          } else if (consecutiveErrorsRef.current > 3) {
            // If we have multiple consecutive errors, notify user and try to restart
            toast({
              title: "Recognition Issues",
              description: "Having trouble with voice recognition. Attempting to restart...",
              variant: "destructive",
            });
            
            // Try a more aggressive restart
            setTimeout(() => {
              if (recognitionRef.current) {
                try {
                  recognitionRef.current.stop();
                } catch (e) {} // Ignore errors here
                
                setTimeout(() => {
                  try {
                    recognitionRef.current?.start();
                    consecutiveErrorsRef.current = 0;
                  } catch (e) {
                    console.error('Failed to restart recognition after errors:', e);
                    setIsListening(false);
                  }
                }, 1000);
              }
            }, 500);
          } else {
            // For other errors, try normal restart
            restartRecognition();
          }
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          isStartingRef.current = false; // Reset starting flag on end
          
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
      isStartingRef.current = false; // Reset starting flag on error
    }
  }, [detectedLanguage, isListening]);

  // Restart recognition after errors or unexpected stops with exponential backoff
  const restartRecognition = useCallback(() => {
    // Cancel any existing restart timers
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    
    // Don't restart if we intentionally stopped
    if (!isListening) return;
    
    // Don't attempt to restart if we're already in the process of starting
    if (isStartingRef.current) return;
    
    const backoffTime = Math.min(300 * Math.pow(2, consecutiveErrorsRef.current), 10000);
    console.log(`Attempting to restart speech recognition in ${backoffTime}ms (attempt #${consecutiveErrorsRef.current + 1})`);
    
    restartTimerRef.current = setTimeout(() => {
      try {
        if (recognitionRef.current) {
          // First try to stop it cleanly (might throw if already stopped)
          try {
            recognitionRef.current.stop();
          } catch (e) {}
          
          // Small delay before starting again
          setTimeout(() => {
            try {
              // Set flag to indicate we're starting
              isStartingRef.current = true;
              
              recognitionRef.current?.start();
              console.log('Speech recognition restarted');
            } catch (e) {
              console.error('Failed to restart speech recognition:', e);
              isStartingRef.current = false; // Reset flag on error
              
              // If we have a critical error, try reinitializing completely
              if (consecutiveErrorsRef.current > 5) {
                console.log('Too many restart failures, attempting full reinitialization');
                isInitializedRef.current = false;
                initializeRecognition();
                
                setTimeout(() => {
                  try {
                    isStartingRef.current = true;
                    recognitionRef.current?.start();
                  } catch (e) {
                    console.error('Failed to start after reinitialization:', e);
                    setIsListening(false);
                    isStartingRef.current = false;
                  }
                }, 500);
              } else {
                setIsListening(false);
              }
            }
          }, 300);
        }
      } catch (e) {
        console.error('Failed to restart speech recognition:', e);
        setIsListening(false);
        isStartingRef.current = false;
      }
    }, backoffTime);
  }, [isListening, initializeRecognition]);

  // Update recognition language when changed
  useEffect(() => {
    if (recognitionRef.current && isInitializedRef.current) {
      recognitionRef.current.lang = detectedLanguage;
      
      // If currently listening, restart to apply new language
      if (isListening) {
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            try {
              recognitionRef.current?.start();
            } catch (e) {
              console.error('Failed to restart after language change:', e);
            }
          }, 300);
        } catch (e) {
          console.error('Error during language change restart:', e);
        }
      }
    }
  }, [detectedLanguage, isListening]);

  // Start listening with advanced preparation
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
    
    // Don't try to start if we're already in the process of starting
    if (isStartingRef.current) {
      console.log('Already attempting to start, wait a moment');
      return;
    }
    
    // Make sure recognition is initialized
    if (!isInitializedRef.current) {
      initializeRecognition();
    }
    
    // Reset consecutive errors counter on manual start
    consecutiveErrorsRef.current = 0;
    
    try {
      if (recognitionRef.current) {
        // Set flag to indicate we're starting
        isStartingRef.current = true;
        
        // Reset transcript when starting new listening session
        setTranscript('');
        setInterimTranscript('');
        
        // Ensure audio context is resumed if it was suspended
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume().catch(console.error);
        }
        
        // Start recognition after a small delay to ensure everything is set up
        setTimeout(() => {
          try {
            if (!isListening && recognitionRef.current) {
              recognitionRef.current.start();
              console.log('Speech recognition started after delay');
            }
          } catch (e) {
            console.error('Failed to start speech recognition after delay:', e);
            setIsListening(false);
            isStartingRef.current = false; // Reset flag on error
            
            // If starting failed with error about already started, try stopping and starting again
            if (e instanceof DOMException && e.name === 'InvalidStateError') {
              console.log('Recognition seems to be already running, trying to restart it');
              try {
                recognitionRef.current?.stop();
                setTimeout(() => {
                  try {
                    isStartingRef.current = true;
                    recognitionRef.current?.start();
                  } catch (stopError) {
                    console.error('Failed to restart recognition:', stopError);
                    isStartingRef.current = false;
                  }
                }, 500);
              } catch (stopError) {
                console.error('Failed to stop recognition:', stopError);
                isStartingRef.current = false;
              }
            }
            
            toast({
              title: "Recognition Error",
              description: "Could not start voice recognition. Please try again.",
              variant: "destructive",
            });
          }
        }, 300); // Increased delay for better reliability
      }
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
      isStartingRef.current = false; // Reset flag on error
      toast({
        title: "Recognition Error",
        description: "Could not start voice recognition. Please try again.",
        variant: "destructive",
      });
    }
  }, [isSupported, isListening, initializeRecognition]);

  // Stop listening with thorough cleanup
  const stopListening = useCallback(() => {
    try {
      console.log('Stopping speech recognition');
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      setIsListening(false);
      setInterimTranscript('');
      isStartingRef.current = false; // Reset starting flag
      
      // Clear all timers
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }
      
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      
      // Suspend audio context to save resources
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        audioContextRef.current.suspend().catch(console.error);
      }
    } catch (e) {
      console.error('Error stopping speech recognition:', e);
      setIsListening(false);
      isStartingRef.current = false; // Reset starting flag on error
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
