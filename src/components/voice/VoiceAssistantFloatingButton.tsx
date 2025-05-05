
import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import { toast } from '@/hooks/use-toast';

interface VoiceAssistantFloatingButtonProps {
  setIsOpen: (isOpen: boolean) => void;
  isListening: boolean;
}

export const VoiceAssistantFloatingButton: React.FC<VoiceAssistantFloatingButtonProps> = ({
  setIsOpen,
  isListening,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Prevent multiple clicks and ensure proper initialization
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleButtonClick = () => {
    // Prevent multiple rapid clicks
    if (isButtonDisabled) return;
    
    setIsButtonDisabled(true);
    
    try {
      setIsOpen(true);
    } catch (error) {
      console.error('Failed to open voice assistant:', error);
      toast({
        title: "Voice Assistant Error",
        description: "Could not open voice assistant. Please try again.",
        variant: "destructive",
      });
    }
    
    // Re-enable after a short delay
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 1000);
  };

  return (
    <Button 
      onClick={handleButtonClick} 
      className={`fixed bottom-6 right-6 rounded-full shadow-lg w-16 h-16 z-[9999] transition-all duration-300 border-2 backdrop-blur-sm
        ${isListening 
          ? 'bg-red-500 hover:bg-red-600 border-red-300/30' 
          : 'bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 border-purple-300/30'
        }`}
      size="icon"
      variant="default"
      aria-label="Open voice assistant"
      disabled={isButtonDisabled && !isMounted}
    >
      <div className="relative flex items-center justify-center w-full h-full">
        <div 
          className={`absolute inset-0 rounded-full animate-pulse ${
            isListening ? 'bg-red-400/40' : 'bg-purple-400/30'
          }`} 
          style={{ animationDuration: isListening ? '1s' : '3s' }}
        ></div>
        <div className={`${isListening ? 'bg-white/50' : 'bg-white/30'} rounded-full p-2.5 backdrop-blur-sm`}>
          <Mic size={24} className="text-white filter drop-shadow-md" />
        </div>
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
