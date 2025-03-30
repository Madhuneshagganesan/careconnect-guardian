
import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useConversationHistory } from '@/hooks/useConversationHistory';
import { useVoiceCommandProcessor } from '@/hooks/useVoiceCommandProcessor';
import { VoiceAssistantUI } from './VoiceAssistantUI';
import { useLocation } from 'react-router-dom';

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
  
  // Automatically process voice commands after a short delay
  useEffect(() => {
    if (transcript && isListening) {
      const timeoutId = setTimeout(() => {
        processCommand();
      }, 1500); // Reduced slightly to be more responsive
      
      return () => clearTimeout(timeoutId);
    }
  }, [transcript, isListening, processCommand]);
  
  return (
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
  );
};

export default VoiceAssistant;
