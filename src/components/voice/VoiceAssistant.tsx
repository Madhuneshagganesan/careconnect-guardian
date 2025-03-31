
import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useConversationHistory } from '@/hooks/useConversationHistory';
import { useVoiceCommandProcessor } from '@/hooks/useVoiceCommandProcessor';
import { VoiceAssistantUI } from './VoiceAssistantUI';
import { useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const VoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPage = location.pathname;
  
  // Initialize hooks
  const { 
    isListening, 
    transcript, 
    toggleListening, 
    stopListening, 
    setTranscript 
  } = useSpeechRecognition();
  
  const { 
    isSpeaking, 
    speakResponse, 
    stopSpeaking 
  } = useSpeechSynthesis();
  
  const { 
    conversationHistory, 
    addMessageToHistory 
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
  
  // Check if browser supports speech recognition
  useEffect(() => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Try using Chrome or Edge.",
        variant: "destructive",
      });
    }
  }, []);
  
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
            conversationHistory={conversationHistory}
            isLoading={isLoading}
            isSpeaking={isSpeaking}
            response={response}
            processCommand={processCommand}
            speakResponse={speakResponse}
            stopSpeaking={stopSpeaking}
          />
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Always visible floating button */}
      <VoiceAssistantUI
        isOpen={isOpen}
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
