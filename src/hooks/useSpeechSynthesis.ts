
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
  const attemptCountRef = useRef(0);
  const utterancesQueue = useRef<Array<{text: string}>>([]);
  const processingUtteranceRef = useRef(false);
  const lastSpokenTextRef = useRef<string>('');
  const lastSpeakTimeRef = useRef<number>(0);
  
  // Initialize speech synthesis on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      // Cancel any ongoing speech on initialization
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      
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
  
  // Process utterances queue with debouncing
  const processQueue = useCallback(() => {
    if (processingUtteranceRef.current || utterancesQueue.current.length === 0) {
      return;
    }
    
    processingUtteranceRef.current = true;
    const nextUtterance = utterancesQueue.current.shift();
    
    if (nextUtterance) {
      speakTextDirectly(nextUtterance.text);
    }
  }, []);
  
  // Direct text-to-speech function (internal)
  const speakTextDirectly = useCallback((text: string) => {
    if (!synthRef.current || !window.speechSynthesis) {
      processingUtteranceRef.current = false;
      setTimeout(() => processQueue(), 300);
      return;
    }
    
    if (!text || !text.trim()) {
      processingUtteranceRef.current = false;
      setTimeout(() => processQueue(), 300);
      return;
    }
    
    // Anti-stuttering: prevent identical text repeated within 2 seconds
    const currentTime = Date.now();
    if (text === lastSpokenTextRef.current && currentTime - lastSpeakTimeRef.current < 2000) {
      console.log('Preventing duplicate speech within 2 seconds', text);
      processingUtteranceRef.current = false;
      setTimeout(() => processQueue(), 300);
      return;
    }
    
    // Update last spoken information
    lastSpokenTextRef.current = text;
    lastSpeakTimeRef.current = currentTime;
    
    try {
      // Cancel any ongoing speech first with safety checks
      if (synthRef.current) {
        try {
          synthRef.current.cancel();
          // Short delay to ensure cancellation is complete
          setTimeout(() => {
            speakWithRetry(text);
          }, 100);
        } catch (e) {
          console.error('Error canceling previous speech:', e);
          speakWithRetry(text);
        }
      } else {
        speakWithRetry(text);
      }
    } catch (error) {
      console.error('Error with speech synthesis:', error);
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
      processingUtteranceRef.current = false;
      
      setTimeout(() => processQueue(), 300);
    }
  }, [processQueue]);
  
  // Helper function to speak with retry mechanism
  const speakWithRetry = useCallback((text: string) => {
    try {
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      currentUtteranceRef.current = utterance;
      
      // Set voice
      if (currentVoice) {
        utterance.voice = currentVoice;
      }
      
      // Improve speech quality
      utterance.rate = 0.95; // Slightly slower for clarity
      utterance.pitch = 1.0; // Normal pitch
      utterance.volume = 1.0; // Full volume
      
      // Create new handlers for this utterance
      utterance.onstart = () => {
        setIsSpeaking(true);
        attemptCountRef.current = 0; // Reset attempt counter on successful start
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        processingUtteranceRef.current = false;
        
        // Process next item in queue with delay
        setTimeout(() => processQueue(), 500);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        
        // Only try a limited number of times before giving up
        attemptCountRef.current += 1;
        
        if (attemptCountRef.current <= 2) {
          console.log(`Speech synthesis error, retrying (attempt ${attemptCountRef.current})`);
          
          // Try again after a delay with progressive backoff
          setTimeout(() => {
            if (synthRef.current) {
              synthRef.current.cancel();
              
              try {
                // Create a new utterance to avoid reusing the one with error
                const newUtterance = new SpeechSynthesisUtterance(text);
                
                if (currentVoice) {
                  newUtterance.voice = currentVoice;
                }
                
                newUtterance.rate = 0.9; // Even slower on retry
                newUtterance.pitch = 1.0;
                
                // Create fresh handlers
                newUtterance.onend = () => {
                  setIsSpeaking(false);
                  currentUtteranceRef.current = null;
                  processingUtteranceRef.current = false;
                  setTimeout(() => processQueue(), 500);
                };
                
                newUtterance.onerror = () => {
                  setIsSpeaking(false);
                  currentUtteranceRef.current = null;
                  processingUtteranceRef.current = false;
                  setTimeout(() => processQueue(), 500);
                  
                  // Display toast as fallback
                  toast({
                    title: "Voice Output",
                    description: text.length > 100 ? text.substring(0, 100) + "..." : text,
                    duration: 5000,
                  });
                };
                
                window.speechSynthesis.speak(newUtterance);
                currentUtteranceRef.current = newUtterance;
              } catch (retryError) {
                console.error('Error during speech synthesis retry:', retryError);
                setIsSpeaking(false);
                currentUtteranceRef.current = null;
                processingUtteranceRef.current = false;
                setTimeout(() => processQueue(), 500);
              }
            }
          }, attemptCountRef.current * 800); // Longer backoff
        } else {
          // Give up after too many attempts
          console.log('Too many speech synthesis errors, displaying as text');
          toast({
            title: "Voice Output",
            description: text.length > 100 ? text.substring(0, 100) + "..." : text,
            duration: 5000,
          });
          
          setIsSpeaking(false);
          currentUtteranceRef.current = null;
          processingUtteranceRef.current = false;
          setTimeout(() => processQueue(), 500);
        }
      };
      
      // For short texts (under 100 chars), use direct approach
      if (text.length <= 100) {
        window.speechSynthesis.speak(utterance);
      } else {
        // For longer texts, split by sentences to prevent cutoffs
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        
        // Queue all sentences except first
        if (sentences.length > 1) {
          for (let i = 1; i < sentences.length; i++) {
            utterancesQueue.current.push({ text: sentences[i] });
          }
        }
        
        // Speak first sentence immediately
        window.speechSynthesis.speak(utterance);
      }
      
    } catch (error) {
      console.error('Error in speakWithRetry:', error);
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
      processingUtteranceRef.current = false;
      setTimeout(() => processQueue(), 500);
    }
  }, [currentVoice, processQueue]);
  
  // Stop speaking with improved cleanup
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      try {
        synthRef.current.cancel();
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        processingUtteranceRef.current = false;
        utterancesQueue.current = []; // Clear queue
        
        // Reset last spoken text tracking
        lastSpokenTextRef.current = '';
        
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
  
  // Public speak response function with anti-stuttering protection
  const speakResponse = useCallback((text: string) => {
    if (!text || !text.trim()) return;
    
    // Anti-stuttering: deduplicate repeated phrases
    const cleanedText = deduplicateText(text);
    
    // Add to queue and process
    utterancesQueue.current.push({ text: cleanedText });
    
    if (!processingUtteranceRef.current) {
      processQueue();
    }
  }, [processQueue]);
  
  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setCurrentVoice(voice);
  }, []);
  
  // Helper function to deduplicate text
  const deduplicateText = (text: string): string => {
    if (!text || text.length < 10) return text;
    
    // Find and remove repeated phrases (3+ words)
    const words = text.split(' ');
    const phrases: string[] = [];
    const result: string[] = [];
    
    for (let i = 0; i < words.length; i++) {
      let dupFound = false;
      
      // Check for 3+ word phrases
      for (let len = 3; len <= 6; len++) {
        if (i + len <= words.length) {
          const phrase = words.slice(i, i + len).join(' ');
          
          if (phrases.includes(phrase)) {
            dupFound = true;
            break;
          }
          
          phrases.push(phrase);
        }
      }
      
      if (!dupFound) {
        result.push(words[i]);
      }
    }
    
    return result.join(' ');
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
