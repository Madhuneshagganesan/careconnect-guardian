
import React from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';

interface VoiceAssistantFloatingButtonProps {
  setIsOpen: (isOpen: boolean) => void;
  isListening: boolean;
}

export const VoiceAssistantFloatingButton: React.FC<VoiceAssistantFloatingButtonProps> = ({
  setIsOpen,
  isListening,
}) => {
  return (
    <Button 
      onClick={() => setIsOpen(true)} 
      className="fixed bottom-6 right-6 rounded-full shadow-lg w-14 h-14 z-50 bg-guardian-500 hover:bg-guardian-600"
      size="icon"
      variant="default"
      aria-label="Open voice assistant"
    >
      <Mic size={24} className="text-white" />
      {isListening && (
        <span className="absolute top-0 right-0 flex h-3 w-3" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
      <span className="sr-only">Open voice assistant</span>
    </Button>
  );
};
