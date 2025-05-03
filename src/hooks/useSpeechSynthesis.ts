import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voicesByLang, setVoicesByLang] = useState<Record<string, SpeechSynthesisVoice[]>>({});
  const synthRef = useRef<SpeechSynthesis | null>(null);
  
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      // Load available voices
      const loadVoices = () => {
        const availableVoices = synthRef.current?.getVoices() || [];
        setVoices(availableVoices);
        
        // Group voices by language
        const voiceMap: Record<string, SpeechSynthesisVoice[]> = {};
        availableVoices.forEach(voice => {
          const langCode = voice.lang.split('-')[0];
          if (!voiceMap[langCode]) {
            voiceMap[langCode] = [];
          }
          voiceMap[langCode].push(voice);
        });
        setVoicesByLang(voiceMap);
        
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
      if (synthRef.current) synthRef.current.cancel();
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
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // If language is specified, try to find a voice for that language
    if (language) {
      const langCode = language.split('-')[0];
      const languageVoices = voicesByLang[langCode];
      
      if (languageVoices && languageVoices.length > 0) {
        utterance.voice = languageVoices[0]; // Use the first voice of that language
        utterance.lang = language;
      } else if (currentVoice) {
        utterance.voice = currentVoice;
      }
    } 
    // Otherwise, use the selected voice
    else if (currentVoice) {
      utterance.voice = currentVoice;
    }
    
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
  
  // Get available voices for a specific language
  const getVoicesForLanguage = (langCode: string): SpeechSynthesisVoice[] => {
    return voicesByLang[langCode] || [];
  };
  
  return {
    isSpeaking,
    speakResponse,
    stopSpeaking,
    voices,
    currentVoice,
    setVoice,
    getVoicesForLanguage
  };
};
