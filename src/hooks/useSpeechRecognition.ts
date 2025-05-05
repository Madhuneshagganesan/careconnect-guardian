import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('en-US');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const restartTimeoutRef = useRef<number | null>(null);
  const listeningStateRef = useRef<boolean>(false);
  const initializingRef = useRef<boolean>(false);
  const initAttempts = useRef<number>(0);
  const maxInitAttempts = 3;

  // Keep a reference to current listening state to use in callbacks
  useEffect(() => {
    listeningStateRef.current = isListening;
  }, [isListening]);

  const initializeRecognition = () => {
    if (initializingRef.current || initAttempts.current >= maxInitAttempts) return;
    
    initializingRef.current = true;
    initAttempts.current += 1;
    
    try {
      console.log('Initializing speech recognition, attempt:', initAttempts.current);
      
      // Check browser support
      if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        console.error('Speech recognition not supported');
        setIsSupported(false);
        initializingRef.current = false;
        return;
      }
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      // Clean up any existing instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.onstart = null;
          recognitionRef.current.abort();
        } catch (e) {
          console.error('Error cleaning up recognition instance:', e);
        }
      }
      
      // Create new recognition instance
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = detectedLanguage;
      
      // Set up event handlers
      recognitionRef.current.onstart = () => {
        console.log('Recognition started successfully');
        setIsListening(true);
        initializingRef.current = false;
        initAttempts.current = 0; // Reset attempts on successful start
      };
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let currentInterim = '';

        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
            
            // Try to detect language from the transcript content
            if (finalTranscript.length > 10) {
              try {
                const detectedLang = detectLanguageFromText(finalTranscript);
                if (detectedLang && detectedLang !== detectedLanguage) {
                  setDetectedLanguage(detectedLang);
                  if (recognitionRef.current) {
                    recognitionRef.current.lang = detectedLang;
                  }
                }
              } catch (error) {
                console.error('Language detection error:', error);
              }
            }
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        // Only update if we have new content
        if (finalTranscript.trim()) {
          setTranscript(prevTranscript => {
            const newTranscript = (prevTranscript + ' ' + finalTranscript).trim();
            return newTranscript;
          });
        }
        
        setInterimTranscript(currentInterim);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        initializingRef.current = false;
        
        if (event.error === 'not-allowed') {
          setIsListening(false);
          listeningStateRef.current = false;
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to use voice recognition.",
            variant: "destructive",
          });
        } else if (event.error === 'no-speech') {
          // No need to show an error for no speech detected
          console.log('No speech detected');
        } else if (event.error === 'aborted') {
          console.log('Recognition aborted - attempting restart');
          if (listeningStateRef.current) {
            safeRestartRecognition();
          }
        } else {
          if (listeningStateRef.current) {
            console.log('Attempting to restart after error:', event.error);
            safeRestartRecognition();
          }
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Recognition ended naturally');
        initializingRef.current = false;
        
        // Only restart if we're still meant to be listening
        if (listeningStateRef.current) {
          console.log('Still listening - attempting to restart');
          safeRestartRecognition();
        } else {
          console.log('Not listening anymore, not restarting recognition');
        }
      };
      
      setIsSupported(true);
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      toast({
        title: "Speech Recognition Error",
        description: "Could not initialize speech recognition. Please try refreshing the page.",
        variant: "destructive",
      });
      setIsSupported(false);
      initializingRef.current = false;
    }
  };

  // Initialize on component mount and when language changes
  useEffect(() => {
    initializeRecognition();
    
    return () => {
      cleanupRecognition();
    };
  }, [detectedLanguage]);
  
  const cleanupRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onstart = null;
        recognitionRef.current.abort();
      } catch (error) {
        console.error('Error aborting speech recognition:', error);
      }
    }
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    initializingRef.current = false;
  };
  
  const safeRestartRecognition = () => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
    
    restartTimeoutRef.current = window.setTimeout(() => {
      if (!recognitionRef.current || !listeningStateRef.current) return;
      
      try {
        console.log('Safely restarting speech recognition');
        
        // First stop any existing session to ensure clean restart
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors if recognition wasn't started
          console.log('Ignoring stop error during restart:', e);
        }
        
        // Wait a moment before starting again
        setTimeout(() => {
          try {
            if (recognitionRef.current && listeningStateRef.current) {
              recognitionRef.current.start();
            }
          } catch (startError) {
            console.error('Failed to restart recognition:', startError);
            recreateRecognitionObject();
          }
        }, 300);
      } catch (error) {
        console.error('Error in safeRestartRecognition:', error);
        recreateRecognitionObject();
      }
    }, 500);
  };
  
  const recreateRecognitionObject = () => {
    try {
      console.log('Recreating recognition object');
      cleanupRecognition();
      
      if (!listeningStateRef.current) return;
      initializeRecognition();
      
      // Try to start the new recognition after a delay
      setTimeout(() => {
        try {
          if (recognitionRef.current && listeningStateRef.current) {
            recognitionRef.current.start();
          }
        } catch (error) {
          console.error('Failed to start recreated recognition:', error);
          
          // If we've had too many failures, stop trying
          if (initAttempts.current >= maxInitAttempts) {
            setIsListening(false);
            listeningStateRef.current = false;
            toast({
              title: "Recognition Failed",
              description: "Voice recognition couldn't be started after multiple attempts. Please refresh the page and try again.",
              variant: "destructive",
            });
          }
        }
      }, 500);
    } catch (error) {
      console.error('Error recreating recognition object:', error);
      setIsListening(false);
      listeningStateRef.current = false;
    }
  };
  
  const detectLanguageFromText = (text: string): string => {
    const text_lower = text.toLowerCase();
    
    // Spanish detection
    if (/(?:hola|gracias|buenos días|cómo estás|qué tal|por favor|de nada)/i.test(text_lower)) {
      return 'es-ES';
    }
    
    // French detection
    if (/(?:bonjour|merci|comment ça va|s'il vous plaît|de rien|au revoir)/i.test(text_lower)) {
      return 'fr-FR';
    }
    
    // German detection
    if (/(?:hallo|danke|guten tag|wie geht es|bitte|auf wiedersehen)/i.test(text_lower)) {
      return 'de-DE';
    }
    
    // Hindi detection
    if (/(?:नमस्ते|धन्यवाद|कैसे हो|कृपया|अलविदा)/i.test(text_lower)) {
      return 'hi-IN';
    }
    
    // Default to English if no match
    return 'en-US';
  };
  
  const startListening = () => {
    if (!isSupported) {
      initializeRecognition();
      if (!isSupported) {
        toast({
          title: "Not Supported",
          description: "Voice recognition is not supported in your browser. Please try Chrome or Edge.",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Don't start if already listening
    if (isListening || listeningStateRef.current) {
      console.log('Already listening, not starting again');
      return;
    }
    
    try {
      console.log('Starting speech recognition');
      // Set current state in ref for callbacks
      listeningStateRef.current = true;
      
      // Clean up any existing instances
      cleanupRecognition();
      
      // Make sure recognition is initialized
      if (!recognitionRef.current) {
        initializeRecognition();
      }
      
      if (!recognitionRef.current) {
        throw new Error("Failed to initialize speech recognition");
      }
      
      // Make sure the language is set correctly
      recognitionRef.current.lang = detectedLanguage;
      
      // Start a new session
      recognitionRef.current.start();
      
      // Clear the transcript
      setTranscript('');
      setInterimTranscript('');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: "Recognition Error",
        description: "Could not start voice recognition. Please refresh and try again.",
        variant: "destructive",
      });
      listeningStateRef.current = false;
      setIsListening(false);
      
      // Try to recreate the recognition object if it failed to start
      setTimeout(() => recreateRecognitionObject(), 1000);
    }
  };
  
  const stopListening = () => {
    console.log('Stopping speech recognition');
    // Set current state in ref for callbacks
    listeningStateRef.current = false;
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
    
    setIsListening(false);
    // Clear interim transcript when stopping
    setInterimTranscript('');
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
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
