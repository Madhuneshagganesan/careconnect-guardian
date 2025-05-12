
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
    setDetectedLanguage
  } = useVoiceAssistantState();
  
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
            }, 1500);
          }
        }, 500);
      }, 300);
    } catch (error) {
      console.error('Failed to open voice assistant:', error);
      toast({
        title: "Voice Assistant Error",
        description: "Could not open voice assistant. Please try again.",
        variant: "destructive",
      });
    }
  }, [setIsOpen, stopListening, stopSpeaking]);

  // Clean up resources with improved sequence when voice assistant closes
  useEffect(() => {
    if (!isOpen) {
      // First stop speaking
      stopSpeaking();
      
      // Then stop listening with a delay to ensure they don't conflict
      setTimeout(() => {
        stopListening();
      }, 500);
    }
  }, [isOpen, stopListening, stopSpeaking]);
  
  // Handle speech synthesis errors without recursive calls
  useEffect(() => {
    const handleSpeechSynthesisError = () => {
      console.log("Speech synthesis error detected");
      
      // Only attempt to retry if not already speaking and auto-speak is on
      if (response && !isSpeaking && autoSpeaking) {
        // Short delay before retry
        setTimeout(() => {
          try {
            // Only try to speak if we're not already speaking
            if (!isSpeaking) {
              speakResponse(response);
            }
          } catch (err) {
            console.error('Fallback speech synthesis attempt failed:', err);
            // If speech fails completely, show a toast with the response
            toast({
              title: "Voice Output",
              description: response.length > 60 ? response.substring(0, 60) + "..." : response,
              duration: 5000,
            });
          }
        }, 800); // Increased delay for better stability
      }
    };
    
    window.addEventListener('speech-synthesis-error', handleSpeechSynthesisError);
    
    return () => {
      window.removeEventListener('speech-synthesis-error', handleSpeechSynthesisError);
    };
  }, [response, isSpeaking, autoSpeaking, speakResponse]);
  
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
