import { useState, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';

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

  // Keep a reference to current listening state to use in callbacks
  useEffect(() => {
    listeningStateRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    // Only initialize once
    if (initializingRef.current) return;
    initializingRef.current = true;
    
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        // Initialize speech recognition
        if (!recognitionRef.current) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = detectedLanguage;
        
          recognitionRef.current.onstart = () => {
            console.log('Recognition started successfully');
            setIsListening(true);
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
              toast({
                title: "Voice Recognition Error",
                description: `Error: ${event.error}. Trying to recover...`,
                variant: "destructive",
              });
              if (listeningStateRef.current) {
                safeRestartRecognition();
              }
            }
          };

          recognitionRef.current.onend = () => {
            console.log('Recognition ended naturally');
            // Only restart if we're still meant to be listening
            if (listeningStateRef.current) {
              console.log('Still listening - attempting to restart');
              safeRestartRecognition();
            } else {
              console.log('Not listening anymore, not restarting recognition');
            }
          };
        }
        
        // Update language when it changes
        if (recognitionRef.current) {
          recognitionRef.current.lang = detectedLanguage;
        }

        setIsSupported(true);
      } catch (error) {
        console.error('Error initializing speech recognition:', error);
        setIsSupported(false);
        toast({
          title: "Speech Recognition Error",
          description: "Could not initialize speech recognition. Please try another browser.",
          variant: "destructive",
        });
      }
    } else {
      setIsSupported(false);
    }
    
    return () => {
      cleanupRecognition();
    };
  }, [detectedLanguage]);
  
  const cleanupRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (error) {
        console.error('Error aborting speech recognition:', error);
      }
    }
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
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
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = detectedLanguage;
      
      // Re-add event handlers
      recognitionRef.current.onstart = () => {
        console.log('Recognition started (recreated)');
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let currentInterim = '';

        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
            
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

        if (finalTranscript.trim()) {
          setTranscript(prevTranscript => {
            const newTranscript = (prevTranscript + ' ' + finalTranscript).trim();
            return newTranscript;
          });
        }
        
        setInterimTranscript(currentInterim);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error (recreated)', event.error);
        if (event.error === 'not-allowed') {
          setIsListening(false);
          listeningStateRef.current = false;
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to use voice recognition.",
            variant: "destructive",
          });
        } else if (event.error === 'no-speech') {
          console.log('No speech detected');
        } else if (event.error === 'aborted') {
          console.log('Recognition aborted - attempting restart');
          if (listeningStateRef.current) {
            safeRestartRecognition();
          }
        } else {
          if (listeningStateRef.current) {
            safeRestartRecognition();
          }
        }
      };
      
      recognitionRef.current.onend = () => {
        console.log('Recognition ended (recreated)');
        if (listeningStateRef.current) {
          safeRestartRecognition();
        }
      };
      
      // Try to start the new recognition
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start recreated recognition:', error);
        setIsListening(false);
        listeningStateRef.current = false;
        toast({
          title: "Recognition Failed",
          description: "Voice recognition couldn't be started. Please try refreshing the page.",
          variant: "destructive",
        });
      }
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
    if (!recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }
    
    // Don't start if already listening
    if (isListening) {
      console.log('Already listening, not starting again');
      return;
    }
    
    try {
      console.log('Starting speech recognition');
      // Set current state in ref for callbacks
      listeningStateRef.current = true;
      
      // Clean up any existing instances
      cleanupRecognition();
      
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
