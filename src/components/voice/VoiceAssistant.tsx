
import React, { useState, useEffect } from 'react';
import { 
  AlertDialog, 
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter 
} from "@/components/ui/alert-dialog";
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useConversationHistory } from '@/hooks/useConversationHistory';
import { useVoiceCommandProcessor } from '@/hooks/useVoiceCommandProcessor';
import { useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';

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
  
  // Listen for voice assistant close event
  useEffect(() => {
    const handleVoiceAssistantClose = () => {
      setIsOpen(false);
    };
    
    document.addEventListener('voiceAssistantClose', handleVoiceAssistantClose);
    
    return () => {
      document.removeEventListener('voiceAssistantClose', handleVoiceAssistantClose);
    };
  }, []);
  
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
  
  // Render dialog content when the dialog is open
  const renderDialogContent = () => {
    return (
      <>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {conversationHistory.length > 0 ? (
            <div className="space-y-3">
              {conversationHistory.map((msg, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-md ${msg.role === 'user' ? 'bg-muted' : 'bg-primary/10 border-primary/20'}`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))}
            </div>
          ) : (
            transcript && (
              <div className="p-3 mb-4 rounded-md bg-muted">
                <p className="text-sm">{transcript}</p>
              </div>
            )
          )}
          
          {isLoading && (
            <div className="flex justify-center my-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          )}
        </div>
        
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Voice Assistant</span>
              <VoiceCommandHelp />
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={() => setIsOpen(false)}
              aria-label="Close dialog"
            >
              <X size={16} />
            </Button>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Try saying "Go to home page", "Go to caregivers page", "Go to how it works page", "Go to about us page", "Close assistant", or ask about specific services like "Tell me about meal preparation".
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              className={`flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${isListening ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'}`}
              onClick={toggleListening}
              disabled={isLoading}
            >
              {isListening ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="1" x2="23" y1="1" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" x2="12" y1="19" y2="23"></line><line x1="8" x2="16" y1="23" y2="23"></line></svg>
                  Stop Listening
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="23"></line><line x1="8" x2="16" y1="23" y2="23"></line></svg>
                  Start Listening
                </>
              )}
            </button>
            
            <button
              className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              disabled={!transcript || isLoading}
              onClick={processCommand}
            >
              Process
            </button>
          </div>
          
          {isSpeaking ? (
            <button 
              className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium shadow-sm hover:bg-secondary/80"
              onClick={stopSpeaking}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon></svg>
              Stop Speaking
            </button>
          ) : response ? (
            <button 
              className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium shadow-sm hover:bg-secondary/80"
              onClick={() => speakResponse(response)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
              Speak Response
            </button>
          ) : null}
        </AlertDialogFooter>
      </>
    );
  };
  
  // Import VoiceCommandHelp component to prevent errors
  const VoiceCommandHelp = () => (
    <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background text-sm font-medium shadow-sm hover:bg-muted">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
    </button>
  );
  
  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="sm:max-w-md">
          {renderDialogContent()}
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Always visible floating button */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-6 right-6 rounded-full shadow-lg w-14 h-14 z-50 bg-guardian-500 hover:bg-guardian-600 text-white flex items-center justify-center"
        aria-label="Open voice assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="23"></line><line x1="8" x2="16" y1="23" y2="23"></line></svg>
        {isListening && (
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>
    </>
  );
};

export default VoiceAssistant;
