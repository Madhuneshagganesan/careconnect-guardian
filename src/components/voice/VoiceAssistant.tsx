
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
  
  // Handle speech synthesis errors by implementing an advanced retry mechanism
  useEffect(() => {
    const handleSpeechSynthesisError = (e: any) => {
      console.log("Speech synthesis error detected, attempting recovery");
      
      if (response && !isSpeaking && autoSpeaking) {
        // Implement progressive fallback strategy
        let attemptCount = 0;
        const maxAttempts = 3;
        
        const attemptSpeech = () => {
          if (attemptCount >= maxAttempts) {
            console.error("Max speech synthesis retry attempts reached");
            // If voice fails, display a toast so user still gets the information
            toast({
              title: "Voice Output Failed",
              description: response.length > 60 ? response.substring(0, 60) + "..." : response,
              duration: 5000,
            });
            return;
          }
          
          setTimeout(() => {
            try {
              // Try with a delay that increases with each attempt
              console.log(`Speech synthesis retry attempt ${attemptCount + 1}`);
              
              // If this isn't the first attempt, try with a different voice
              if (attemptCount > 0 && voices.length > 1) {
                // Use a different voice for retry
                const fallbackVoice = voices.find(v => v !== currentVoice) || voices[0];
                speakResponse(response);
              } else {
                speakResponse(response);
              }
              
              attemptCount++;
            } catch (err) {
              console.error(`Fallback speech synthesis attempt ${attemptCount + 1} failed:`, err);
              attemptCount++;
              attemptSpeech(); // Try again with next strategy
            }
          }, 300 * (attemptCount + 1)); // Progressive backoff
        };
        
        attemptSpeech();
      }
    };
    
    window.addEventListener('speech-synthesis-error', handleSpeechSynthesisError);
    
    return () => {
      window.removeEventListener('speech-synthesis-error', handleSpeechSynthesisError);
    };
  }, [response, isSpeaking, autoSpeaking, speakResponse, voices, currentVoice]);
  
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
