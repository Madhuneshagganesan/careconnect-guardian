
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

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = detectedLanguage;
      
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
          restartRecognition();
        } else {
          toast({
            title: "Voice Recognition Error",
            description: `Error: ${event.error}. Attempting to restart.`,
            variant: "destructive",
          });
          restartRecognition();
        }
      };

      recognitionRef.current.onend = () => {
        // Only restart if we're still meant to be listening
        if (isListening) {
          restartRecognition();
        }
      };

      setIsSupported(true);
    }
    
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, [isListening, detectedLanguage]);
  
  const restartRecognition = () => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
    
    restartTimeoutRef.current = window.setTimeout(() => {
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Error restarting speech recognition:', error);
        }
      }
    }, 300);
  };
  
  const detectLanguageFromText = (text: string): string => {
    // Simple language detection based on common words
    // This is a very simplified version; in a real app, use a proper language detection library
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
    
    try {
      recognitionRef.current.lang = detectedLanguage;
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript('');
      setInterimTranscript('');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: "Recognition Error",
        description: "Could not start voice recognition. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const stopListening = () => {
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
