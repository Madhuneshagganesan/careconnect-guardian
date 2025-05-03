
import React, { useState, useEffect } from 'react';
import { 
  AlertDialog, 
  AlertDialogContent
} from "@/components/ui/alert-dialog";
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useConversationHistory } from '@/hooks/useConversationHistory';
import { useVoiceCommandProcessor } from '@/hooks/useVoiceCommandProcessor';
import { useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { VoiceAssistantUI } from './VoiceAssistantUI';

const VoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [autoSpeaking, setAutoSpeaking] = useState(false);
  const location = useLocation();
  const currentPage = location.pathname;
  
  // Initialize hooks
  const { 
    isListening, 
    transcript, 
    interimTranscript,
    toggleListening, 
    stopListening, 
    setTranscript,
    isSupported
  } = useSpeechRecognition();
  
  const { 
    isSpeaking, 
    speakResponse, 
    stopSpeaking,
    voices,
    currentVoice,
    setVoice
  } = useSpeechSynthesis();
  
  const { 
    conversationHistory, 
    addMessageToHistory,
    clearHistory
  } = useConversationHistory();
  
  const { 
    isLoading, 
    response, 
    processCommand, 
    setResponse 
  } = useVoiceCommandProcessor(
    transcript, 
    setTranscript, 
    stopListening, 
    speakResponse, 
    addMessageToHistory,
    currentPage
  );
  
  // Listen for voice assistant close event
  useEffect(() => {
    const handleVoiceAssistantClose = () => {
      setIsOpen(false);
    };
    
    document.addEventListener('voiceAssistantClose', handleVoiceAssistantClose);
    
    return () => {
      document.removeEventListener('voiceAssistantClose', handleVoiceAssistantClose);
    };
  }, []);
  
  // Check if browser supports speech recognition
  useEffect(() => {
    if (!isSupported) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Try using Chrome or Edge.",
        variant: "destructive",
      });
    }
  }, [isSupported]);
  
  // Auto-speak responses when enabled
  useEffect(() => {
    if (autoSpeaking && response && !isSpeaking && !isLoading) {
      speakResponse(response);
    }
  }, [response, autoSpeaking, isSpeaking, isLoading, speakResponse]);
  
  // Automatically process voice commands after a short delay
  useEffect(() => {
    if (transcript && isListening) {
      const timeoutId = setTimeout(() => {
        processCommand();
      }, 1500); // Short delay to be more responsive
      
      return () => clearTimeout(timeoutId);
    }
  }, [transcript, isListening, processCommand]);
  
  // Let the user know the feature is ready
  useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem('voiceAssistantWelcomeShown');
    if (!hasShownWelcome) {
      setTimeout(() => {
        toast({
          title: "Voice Assistant Ready",
          description: "Click the mic icon in the bottom right corner to use voice commands",
        });
        sessionStorage.setItem('voiceAssistantWelcomeShown', 'true');
      }, 3000);
    }
  }, []);
  
  // Reset conversation when dialog is opened/closed
  useEffect(() => {
    if (!isOpen) {
      // When closing, wait a bit in case there's audio playing
      const timeoutId = setTimeout(() => {
        clearHistory();
        setResponse('');
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, clearHistory, setResponse]);
  
  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <VoiceAssistantUI
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isListening={isListening}
            toggleListening={toggleListening}
            transcript={transcript}
            interimTranscript={interimTranscript}
            conversationHistory={conversationHistory}
            isLoading={isLoading}
            isSpeaking={isSpeaking}
            response={response}
            processCommand={processCommand}
            speakResponse={speakResponse}
            stopSpeaking={stopSpeaking}
            isAutoSpeaking={autoSpeaking}
            setAutoSpeaking={setAutoSpeaking}
            voices={voices}
            currentVoice={currentVoice}
            setVoice={setVoice}
          />
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Always visible floating button */}
      <VoiceAssistantUI
        isOpen={false}
        setIsOpen={setIsOpen}
        isListening={isListening}
        toggleListening={toggleListening}
        transcript={transcript}
        conversationHistory={conversationHistory}
        isLoading={isLoading}
        isSpeaking={isSpeaking}
        response={response}
        processCommand={processCommand}
        speakResponse={speakResponse}
        stopSpeaking={stopSpeaking}
      />
    </>
  );
};

export default VoiceAssistant;
