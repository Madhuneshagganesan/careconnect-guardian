
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('en-US');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isInitializedRef = useRef(false);

  // Initialize recognition on mount
  useEffect(() => {
    const checkSupportAndInit = () => {
      if (typeof window !== 'undefined' && 
          ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        setIsSupported(true);
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = detectedLanguage;
        isInitializedRef.current = true;
        
        setupRecognitionHandlers();
      } else {
        setIsSupported(false);
        console.error("Speech recognition not supported in this browser");
      }
    };
    
    checkSupportAndInit();
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.abort();
        } catch (e) {
          console.error('Error cleaning up speech recognition:', e);
        }
      }
    };
  }, []);

  // Update language when it changes
  useEffect(() => {
    if (recognitionRef.current && isInitializedRef.current) {
      recognitionRef.current.lang = detectedLanguage;
    }
  }, [detectedLanguage]);

  // Set up event handlers for the recognition instance
  const setupRecognitionHandlers = () => {
    if (!recognitionRef.current) return;
    
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
      }
    };

    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended');
      // Only update state if we're not currently in listening state
      // This avoids causing unnecessary re-renders when auto-restarting
      if (isListening) {
        setIsListening(false);
      }
      
      // Auto-restart if we were supposed to be listening
      if (isListening && recognitionRef.current) {
        try {
          setTimeout(() => {
            if (isListening && recognitionRef.current) {
              recognitionRef.current.start();
            }
          }, 300);
        } catch (e) {
          console.error('Error restarting speech recognition:', e);
          setIsListening(false);
        }
      }
    };
  };

  const startListening = () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (!recognitionRef.current) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = detectedLanguage;
        setupRecognitionHandlers();
      }
      
      setTranscript('');
      setInterimTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
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
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
    }
    
    setIsListening(false);
    setInterimTranscript('');
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
