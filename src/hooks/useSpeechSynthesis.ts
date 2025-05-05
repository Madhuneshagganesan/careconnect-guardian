
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isInitialized = useRef(false);
  
  // Initialize speech synthesis on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      isInitialized.current = true;
      
      // Load available voices
      const loadVoices = () => {
        const availableVoices = synthRef.current?.getVoices() || [];
        setVoices(availableVoices);
        
        // Set a default voice (preferably English)
        if (availableVoices.length > 0) {
          const englishVoice = availableVoices.find(
            voice => voice.lang.includes('en-')
          );
          setCurrentVoice(englishVoice || availableVoices[0]);
        }
      };
      
      // Chrome loads voices asynchronously
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
      
      loadVoices();
    }
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);
  
  const speakResponse = (text: string, language?: string) => {
    if (!synthRef.current) {
      toast({
        title: "Not Supported",
        description: "Voice synthesis is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice based on language or default to current voice
    if (language && voices.length > 0) {
      const langCode = language.split('-')[0];
      const matchingVoice = voices.find(v => v.lang.startsWith(langCode));
      
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      } else if (currentVoice) {
        utterance.voice = currentVoice;
      }
    } else if (currentVoice) {
      utterance.voice = currentVoice;
    }
    
    // Set callbacks
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      toast({
        title: "Speech Error",
        description: "There was an error while speaking the response.",
        variant: "destructive",
      });
    };
    
    // Speak
    setIsSpeaking(true);
    synthRef.current.speak(utterance);
  };
  
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };
  
  const setVoice = (voice: SpeechSynthesisVoice) => {
    setCurrentVoice(voice);
  };
  
  return {
    isSpeaking,
    speakResponse,
    stopSpeaking,
    voices,
    currentVoice,
    setVoice
  };
};
