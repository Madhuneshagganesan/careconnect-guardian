
import React from 'react';
import { AlertDialogContent, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { VoiceAssistantUI } from './VoiceAssistantUI';

interface VoiceAssistantDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isListening: boolean;
  toggleListening: () => void;
  transcript: string;
  interimTranscript?: string;
  conversationHistory: Array<{ role: string; content: string }>;
  isLoading: boolean;
  isSpeaking: boolean;
  response: string;
  processCommand: () => void;
  speakResponse: (text: string) => void;
  stopSpeaking: () => void;
  autoSpeaking: boolean;
  setAutoSpeaking: (value: boolean) => void;
  voices: SpeechSynthesisVoice[];
  currentVoice: SpeechSynthesisVoice | null;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  detectedLanguage?: string;
  setDetectedLanguage?: (lang: string) => void;
}

export const VoiceAssistantDialog: React.FC<VoiceAssistantDialogProps> = ({
  isOpen,
  setIsOpen,
  isListening,
  toggleListening,
  transcript,
  interimTranscript,
  conversationHistory,
  isLoading,
  isSpeaking,
  response,
  processCommand,
  speakResponse,
  stopSpeaking,
  autoSpeaking,
  setAutoSpeaking,
  voices,
  currentVoice,
  setVoice,
  detectedLanguage,
  setDetectedLanguage
}) => {
  if (!isOpen) return null;
  
  return (
    <AlertDialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border border-purple-100/50 shadow-lg rounded-xl">
      <AlertDialogTitle className="sr-only">Voice Assistant</AlertDialogTitle>
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
        detectedLanguage={detectedLanguage}
        setDetectedLanguage={setDetectedLanguage}
      />
    </AlertDialogContent>
  );
};
