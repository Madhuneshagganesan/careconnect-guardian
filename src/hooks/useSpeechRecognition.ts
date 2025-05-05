
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
      stopListening();
    };
  }, []);

  // Initialize speech recognition
  const initializeRecognition = useCallback(() => {
    if (isInitializedRef.current) return;
    
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
          }
          
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          setIsListening(false);
        };
        
        isInitializedRef.current = true;
      }
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      setIsSupported(false);
    }
  }, [detectedLanguage]);

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
        setTranscript('');
        setInterimTranscript('');
        recognitionRef.current.start();
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
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        console.log('Stopping speech recognition');
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
    }
    
    setIsListening(false);
    setInterimTranscript('');
  }, [isListening]);

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
