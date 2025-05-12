
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
      // Stop any existing sessions and reset before opening
      stopListening();
      stopSpeaking();
      
      // Clean transcript and response
      setIsOpen(true);
      
      // Start listening with a delay to ensure UI is ready
      setTimeout(() => {
        try {
          startListening();
          
          // Toast to help user know what to do (show only once per session)
          if (!sessionStorage.getItem('voiceAssistantHelpShown')) {
            sessionStorage.setItem('voiceAssistantHelpShown', 'true');
            setTimeout(() => {
              toast({
                title: "Voice Assistant Ready",
                description: "Say 'Help' to learn about available commands",
              });
            }, 1000);
          }
        } catch (error) {
          console.error('Failed to start listening:', error);
          toast({
            title: "Voice Assistant Error",
            description: "Could not initialize microphone. Please check browser permissions.",
            variant: "destructive",
          });
        }
      }, 800); // Increased delay for better initialization
    } catch (error) {
      console.error('Failed to open voice assistant:', error);
      toast({
        title: "Voice Assistant Error",
        description: "Could not open voice assistant. Please try again.",
        variant: "destructive",
      });
    }
  }, [setIsOpen, stopListening, stopSpeaking, startListening]);

  // Clean up resources when voice assistant closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        stopListening();
        stopSpeaking();
      }, 200);
    }
  }, [isOpen, stopListening, stopSpeaking]);
  
  // Handle speech synthesis errors by implementing a simplified retry mechanism
  useEffect(() => {
    const handleSpeechSynthesisError = () => {
      console.log("Speech synthesis error detected");
      
      // Only attempt to retry if not already speaking and auto-speak is on
      if (response && !isSpeaking && autoSpeaking) {
        // Short delay before retry
        setTimeout(() => {
          try {
            speakResponse(response);
          } catch (err) {
            console.error('Fallback speech synthesis attempt failed:', err);
            // If speech fails completely, show a toast with the response
            toast({
              title: "Voice Output",
              description: response.length > 60 ? response.substring(0, 60) + "..." : response,
              duration: 5000,
            });
          }
        }, 300);
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
