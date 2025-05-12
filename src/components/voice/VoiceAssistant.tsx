
import React, { useCallback, useEffect } from 'react';
import { AlertDialog } from "@/components/ui/alert-dialog";
import { VoiceAssistantDialog } from './VoiceAssistantDialog';
import { VoiceAssistantFloatingButton } from './VoiceAssistantFloatingButton';
import { useVoiceAssistantState } from '@/hooks/useVoiceAssistantState';
import { toast } from '@/hooks/use-toast';

const VoiceAssistant = () => {
  const {
    isOpen,
    setIsOpen,
    autoSpeaking,
    setAutoSpeaking,
    isListening,
    transcript,
    interimTranscript,
    toggleListening,
    stopListening,
    startListening,
    conversationHistory,
    isLoading,
    isSpeaking,
    response,
    processCommand,
    speakResponse,
    stopSpeaking,
    voices,
    currentVoice,
    setVoice,
    detectedLanguage,
    setDetectedLanguage,
    isSystemStable
  } = useVoiceAssistantState();
  
  // Track errors for better error handling
  const errorCount = React.useRef(0);
  const lastErrorTime = React.useRef(0);
  
  const handleOpenDialog = useCallback(() => {
    try {
      // First ensure any existing sessions are stopped
      stopSpeaking();
      
      // Then stop listening with a delay to ensure proper cleanup
      setTimeout(() => {
        stopListening();
        
        // Then open the dialog with a longer delay for stable state
        setTimeout(() => {
          setIsOpen(true);
          
          // Toast to help user know what to do (show only once per session)
          if (!sessionStorage.getItem('voiceAssistantHelpShown')) {
            sessionStorage.setItem('voiceAssistantHelpShown', 'true');
            setTimeout(() => {
              toast({
                title: "Voice Assistant Ready",
                description: "Say 'Help' to learn about available commands",
              });
            }, 1800);
          }
        }, 800);
      }, 500);
    } catch (error) {
      console.error('Failed to open voice assistant:', error);
      
      // Track errors
      const now = Date.now();
      if (now - lastErrorTime.current < 10000) {
        errorCount.current++;
      } else {
        errorCount.current = 1;
      }
      lastErrorTime.current = now;
      
      // If too many errors, show a more helpful message
      const message = errorCount.current > 2
        ? "Voice assistant is having trouble. Please try refreshing the page."
        : "Could not open voice assistant. Please try again.";
        
      toast({
        title: "Voice Assistant Error",
        description: message,
        variant: "destructive",
      });
    }
  }, [setIsOpen, stopListening, stopSpeaking]);

  // Clean up resources with improved sequence when voice assistant closes
  useEffect(() => {
    if (!isOpen) {
      // First stop speaking
      stopSpeaking();
      
      // Then stop listening with a longer delay to ensure they don't conflict
      setTimeout(() => {
        stopListening();
      }, 800);
    }
  }, [isOpen, stopListening, stopSpeaking]);
  
  // Reset error tracking when system stabilizes
  useEffect(() => {
    if (isSystemStable) {
      errorCount.current = 0;
    }
  }, [isSystemStable]);
  
  // Handle speech synthesis errors without recursive calls
  useEffect(() => {
    const handleSpeechSynthesisError = () => {
      console.log("Speech synthesis error detected");
      
      // Only attempt to retry if not already speaking and auto-speak is on
      // and there's a valid response and we're not in an error cascade
      if (response && !isSpeaking && autoSpeaking && errorCount.current < 3 && isSystemStable) {
        // Short delay before retry
        setTimeout(() => {
          try {
            // Only try to speak if we're not already speaking
            if (!isSpeaking && isSystemStable) {
              speakResponse(response);
            }
          } catch (err) {
            console.error('Fallback speech synthesis attempt failed:', err);
            errorCount.current++;
            
            // If speech fails completely, show a toast with the response
            if (errorCount.current >= 2) {
              toast({
                title: "Voice Output",
                description: response.length > 60 ? response.substring(0, 60) + "..." : response,
                duration: 5000,
              });
            }
          }
        }, 1200); // Increased delay for better stability
      }
    };
    
    window.addEventListener('speech-synthesis-error', handleSpeechSynthesisError);
    
    return () => {
      window.removeEventListener('speech-synthesis-error', handleSpeechSynthesisError);
    };
  }, [response, isSpeaking, autoSpeaking, speakResponse, isSystemStable]);
  
  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <VoiceAssistantDialog
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
          autoSpeaking={autoSpeaking}
          setAutoSpeaking={setAutoSpeaking}
          voices={voices}
          currentVoice={currentVoice}
          setVoice={setVoice}
          detectedLanguage={detectedLanguage}
          setDetectedLanguage={setDetectedLanguage}
        />
      </AlertDialog>
      
      {/* Always visible floating button */}
      <VoiceAssistantFloatingButton
        openDialog={handleOpenDialog}
        isListening={isListening}
      />
    </>
  );
};

export default VoiceAssistant;
