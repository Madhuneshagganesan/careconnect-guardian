
import React from 'react';
import { Mic, MicOff, Volume2, Volume, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import { Card } from '@/components/ui/card';
import {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Message } from '@/hooks/useConversationHistory';
import VoiceCommandHelp from './VoiceCommandHelp';

interface VoiceAssistantUIProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isListening: boolean;
  toggleListening: () => void;
  transcript: string;
  conversationHistory: Message[];
  isLoading: boolean;
  isSpeaking: boolean;
  response: string;
  processCommand: () => void;
  speakResponse: (text: string) => void;
  stopSpeaking: () => void;
}

export const VoiceAssistantUI: React.FC<VoiceAssistantUIProps> = ({
  isOpen,
  setIsOpen,
  isListening,
  toggleListening,
  transcript,
  conversationHistory,
  isLoading,
  isSpeaking,
  response,
  processCommand,
  speakResponse,
  stopSpeaking
}) => {
  // If this component is being used in the dialog, render the full UI
  if (isOpen) {
    return (
      <>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {conversationHistory.length > 0 ? (
            <div className="space-y-3">
              {conversationHistory.map((msg, index) => (
                <Card 
                  key={index} 
                  className={`p-3 ${msg.role === 'user' ? 'bg-muted' : 'bg-primary/10 border-primary/20'}`}
                >
                  <p className="text-sm">{msg.content}</p>
                </Card>
              ))}
            </div>
          ) : (
            transcript && (
              <Card className="p-3 mb-4 bg-muted">
                <p className="text-sm">{transcript}</p>
              </Card>
            )
          )}
          
          {isLoading && (
            <div className="flex justify-center my-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
              className="h-8 w-8 p-0"
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </Button>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Try saying "Go to home page", "Go to caregivers page", "Go to how it works page", "Go to about us page", or ask about specific services like "Tell me about meal preparation".
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant={isListening ? "destructive" : "default"}
              className="flex-1"
              onClick={toggleListening}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
              {isListening ? "Stop Listening" : "Start Listening"}
            </Button>
            
            <Button
              variant="outline"
              disabled={!transcript || isLoading}
              onClick={processCommand}
              className="flex-1"
            >
              Process
            </Button>
          </div>
          
          {isSpeaking ? (
            <Button variant="secondary" onClick={stopSpeaking}>
              <Volume className="mr-2 h-4 w-4" />
              Stop Speaking
            </Button>
          ) : response ? (
            <Button variant="secondary" onClick={() => speakResponse(response)}>
              <Volume2 className="mr-2 h-4 w-4" />
              Speak Response
            </Button>
          ) : null}
        </AlertDialogFooter>
      </>
    );
  }
  
  // If not showing in dialog, just render the floating button
  return (
    <Button 
      onClick={() => setIsOpen(true)} 
      className="fixed bottom-6 right-6 rounded-full shadow-lg w-14 h-14 z-50 bg-guardian-500 hover:bg-guardian-600"
      size="icon"
      variant="default"
    >
      <Mic size={24} className="text-white" />
      {isListening && <span className="absolute top-0 right-0 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>}
    </Button>
  );
};
