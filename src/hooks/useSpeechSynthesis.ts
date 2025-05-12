
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isInitialized = useRef(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Initialize speech synthesis on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      // Load available voices
      const loadVoices = () => {
        const availableVoices = synthRef.current?.getVoices() || [];
        
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
          
          // Set a default voice (preferably English)
          if (!currentVoice) {
            const englishVoice = availableVoices.find(
              voice => voice.lang.includes('en-')
            );
            setCurrentVoice(englishVoice || availableVoices[0]);
          }
          
          isInitialized.current = true;
        }
      };
      
      // Load voices immediately (works in Firefox)
      loadVoices();
      
      // Chrome loads voices asynchronously
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }

      // Create Audio Context for advanced audio processing
      try {
        audioContextRef.current = new AudioContext();
      } catch (e) {
        console.warn('AudioContext not supported, using standard speech synthesis');
      }
    }
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);
  
  // Speak response with enhanced quality and fallbacks
  const speakResponse = useCallback((text: string, language?: string, overrideVoice?: SpeechSynthesisVoice) => {
    if (!synthRef.current || !window.speechSynthesis) {
      toast({
        title: "Not Supported",
        description: "Voice synthesis is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }
    
    if (!text || !text.trim()) return;
    
    try {
      // Cancel any ongoing speech first
      stopSpeaking();
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      currentUtteranceRef.current = utterance;
      
      // Set voice based on language or default to current voice
      if (overrideVoice) {
        utterance.voice = overrideVoice;
      } else if (language && voices.length > 0) {
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
      
      // Improve speech quality
      utterance.rate = 1.0; // Normal rate
      utterance.pitch = 1.0; // Normal pitch
      utterance.volume = 1.0; // Full volume
      
      // Set callbacks
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        
        // Reset speech synthesis in some browsers to prevent issues
        if (navigator.userAgent.includes('Chrome')) {
          window.speechSynthesis.cancel();
        }
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        
        // Dispatch custom event for error handling
        window.dispatchEvent(new CustomEvent('speech-synthesis-error', { detail: event }));
      };
      
      // Speak
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
      
      // Chrome bug workaround - if speech doesn't start in 1 second, try again
      setTimeout(() => {
        if (currentUtteranceRef.current === utterance && !isSpeaking) {
          console.log('Speech synthesis may be stuck, attempting restart');
          
          // Force resume in case it's paused
          window.speechSynthesis.resume();
          
          // If still not working, try again
          setTimeout(() => {
            if (currentUtteranceRef.current === utterance && !isSpeaking) {
              window.speechSynthesis.cancel();
              window.speechSynthesis.speak(utterance);
            }
          }, 500);
        }
      }, 1000);
      
      // Prevent Chrome bug of cutting off long speeches
      const preventSpeechCutoff = () => {
        if (isSpeaking && currentUtteranceRef.current) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      };
      
      const intervalId = setInterval(preventSpeechCutoff, 5000);
      utterance.onend = () => {
        clearInterval(intervalId);
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
      };
      utterance.onerror = (event) => {
        clearInterval(intervalId);
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        window.dispatchEvent(new CustomEvent('speech-synthesis-error', { detail: event }));
      };
      
    } catch (error) {
      console.error('Error with speech synthesis:', error);
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    }
  }, [voices, currentVoice, isSpeaking]);
  
  // Stop speaking with improved cleanup
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      try {
        synthRef.current.cancel();
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        
        // In some browsers, additional cleanup might be needed
        if (audioContextRef.current && audioContextRef.current.state === 'running') {
          // Suspend audio context to free up resources
          audioContextRef.current.suspend().catch(console.error);
        }
      } catch (error) {
        console.error('Error stopping speech synthesis:', error);
      }
    }
  }, []);
  
  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setCurrentVoice(voice);
  }, []);
  
  return {
    isSpeaking,
    speakResponse,
    stopSpeaking,
    voices,
    currentVoice,
    setVoice
  };
};
