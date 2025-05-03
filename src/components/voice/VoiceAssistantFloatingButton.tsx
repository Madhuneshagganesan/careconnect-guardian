
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
      className="fixed bottom-6 right-6 rounded-full shadow-lg w-16 h-16 z-[9999] bg-gradient-to-b from-purple-500 to-violet-700 hover:from-purple-600 hover:to-violet-800 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm"
      size="icon"
      variant="default"
      aria-label="Open voice assistant"
    >
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="absolute inset-0 bg-purple-500/30 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
        <Mic size={24} className="text-white filter drop-shadow-md" />
        {isListening && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-30"></span>
            <span className="absolute top-2 right-2 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
        )}
      </div>
      <span className="sr-only">Open voice assistant</span>
    </Button>
  );
};
