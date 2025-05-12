
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
  
  // Process utterances queue
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
      processQueue(); // Try next item in queue
      return;
    }
    
    if (!text || !text.trim()) {
      processingUtteranceRef.current = false;
      processQueue(); // Try next item in queue
      return;
    }
    
    try {
      // Cancel any ongoing speech first
      stopSpeaking();
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      currentUtteranceRef.current = utterance;
      
      // Set voice
      if (currentVoice) {
        utterance.voice = currentVoice;
      }
      
      // Improve speech quality
      utterance.rate = 1.0; // Normal rate
      utterance.pitch = 1.0; // Normal pitch
      utterance.volume = 1.0; // Full volume
      
      // Set callbacks
      utterance.onstart = () => {
        setIsSpeaking(true);
        attemptCountRef.current = 0; // Reset attempt counter on successful start
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        processingUtteranceRef.current = false;
        
        // Process next item in queue
        setTimeout(() => processQueue(), 300);
        
        // Reset speech synthesis in some browsers to prevent issues
        if (navigator.userAgent.includes('Chrome')) {
          synthRef.current?.cancel();
        }
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        
        // Only try a limited number of times before giving up
        attemptCountRef.current += 1;
        
        if (attemptCountRef.current <= 3) {
          console.log(`Speech synthesis error, retrying (attempt ${attemptCountRef.current})`);
          
          // Try again after a delay with progressive backoff
          setTimeout(() => {
            if (synthRef.current) {
              synthRef.current.cancel();
              
              try {
                // Try with a slightly modified text to avoid same error
                const modifiedText = text + " ";
                const newUtterance = new SpeechSynthesisUtterance(modifiedText);
                
                // Try with a different voice if available
                if (voices.length > 1) {
                  const alternateVoice = voices.find(v => v !== currentVoice) || voices[0];
                  newUtterance.voice = alternateVoice;
                } else if (currentVoice) {
                  newUtterance.voice = currentVoice;
                }
                
                newUtterance.rate = 1.0;
                newUtterance.pitch = 1.0;
                newUtterance.onend = utterance.onend;
                newUtterance.onerror = utterance.onerror;
                
                window.speechSynthesis.speak(newUtterance);
                currentUtteranceRef.current = newUtterance;
              } catch (retryError) {
                console.error('Error during speech synthesis retry:', retryError);
                setIsSpeaking(false);
                currentUtteranceRef.current = null;
                processingUtteranceRef.current = false;
                
                // Process next item in queue
                setTimeout(() => processQueue(), 300);
              }
            }
          }, attemptCountRef.current * 300); // Progressive backoff
        } else {
          // Give up after too many attempts and show the message as text
          console.log('Too many speech synthesis errors, displaying as text');
          toast({
            title: "Voice Output",
            description: text.length > 100 ? text.substring(0, 100) + "..." : text,
            duration: 5000,
          });
          
          setIsSpeaking(false);
          currentUtteranceRef.current = null;
          processingUtteranceRef.current = false;
          
          // Process next item in queue
          setTimeout(() => processQueue(), 300);
        }
      };
      
      // Chrome bug workaround - split long text into paragraphs
      if (text.length > 100 && navigator.userAgent.includes('Chrome')) {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        
        // Speak first sentence immediately
        const firstSentence = new SpeechSynthesisUtterance(sentences[0]);
        if (currentVoice) firstSentence.voice = currentVoice;
        firstSentence.rate = 1.0;
        firstSentence.onend = utterance.onend;
        firstSentence.onerror = utterance.onerror;
        
        window.speechSynthesis.speak(firstSentence);
        currentUtteranceRef.current = firstSentence;
        
        // Add remaining sentences to queue if there are more
        if (sentences.length > 1) {
          for (let i = 1; i < sentences.length; i++) {
            utterancesQueue.current.push({ text: sentences[i] });
          }
        }
      } else {
        // Speak normally for short text
        window.speechSynthesis.speak(utterance);
      }
      
      // Chrome bug workaround - prevent cutting off
      if (navigator.userAgent.includes('Chrome')) {
        const intervalId = setInterval(() => {
          if (synthRef.current && isSpeaking && currentUtteranceRef.current) {
            synthRef.current.pause();
            synthRef.current.resume();
          } else {
            clearInterval(intervalId);
          }
        }, 5000);
        
        // Clear interval when speech ends
        utterance.onend = () => {
          clearInterval(intervalId);
          setIsSpeaking(false);
          currentUtteranceRef.current = null;
          processingUtteranceRef.current = false;
          
          // Process next item in queue
          setTimeout(() => processQueue(), 300);
        };
        
        utterance.onerror = (event) => {
          clearInterval(intervalId);
          utterance.onerror(event); // Call the original error handler
        };
      }
      
    } catch (error) {
      console.error('Error with speech synthesis:', error);
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
      processingUtteranceRef.current = false;
      
      // Process next item in queue
      setTimeout(() => processQueue(), 300);
    }
  }, [voices, currentVoice, isSpeaking]);
  
  // Public speak response function
  const speakResponse = useCallback((text: string) => {
    if (!text || !text.trim()) return;
    
    // Add to queue and process
    utterancesQueue.current.push({ text });
    
    if (!processingUtteranceRef.current) {
      processQueue();
    }
  }, [processQueue]);
  
  // Stop speaking with improved cleanup
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      try {
        synthRef.current.cancel();
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        processingUtteranceRef.current = false;
        utterancesQueue.current = []; // Clear queue
        
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
