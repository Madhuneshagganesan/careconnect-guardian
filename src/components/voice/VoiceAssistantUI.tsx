
import React from 'react';
import { Mic, MicOff, Volume2, Volume, Loader2, X, Eye, Speaker } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface VoiceAssistantUIProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isListening: boolean;
  toggleListening: () => void;
  transcript: string;
  interimTranscript?: string;
  conversationHistory: Message[];
  isLoading: boolean;
  isSpeaking: boolean;
  response: string;
  processCommand: () => void;
  speakResponse: (text: string) => void;
  stopSpeaking: () => void;
  isAutoSpeaking?: boolean;
  setAutoSpeaking?: (value: boolean) => void;
  voices?: SpeechSynthesisVoice[];
  currentVoice?: SpeechSynthesisVoice | null;
  setVoice?: (voice: SpeechSynthesisVoice) => void;
}

export const VoiceAssistantUI: React.FC<VoiceAssistantUIProps> = ({
  isOpen,
  setIsOpen,
  isListening,
  toggleListening,
  transcript,
  interimTranscript = '',
  conversationHistory,
  isLoading,
  isSpeaking,
  response,
  processCommand,
  speakResponse,
  stopSpeaking,
  isAutoSpeaking = false,
  setAutoSpeaking,
  voices = [],
  currentVoice = null,
  setVoice
}) => {
  // If this component is being used in the dialog, render the full UI
  if (isOpen) {
    return (
      <>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {conversationHistory.length > 0 ? (
            <div className="space-y-3" aria-live="polite">
              {conversationHistory.map((msg, index) => (
                <Card 
                  key={index} 
                  className={`p-3 ${msg.role === 'user' ? 'bg-muted' : 'bg-primary/10 border-primary/20'}`}
                >
                  <p className="text-sm mb-1 font-medium">{msg.role === 'user' ? 'You:' : 'Assistant:'}</p>
                  <p className="text-sm">{msg.content}</p>
                </Card>
              ))}
            </div>
          ) : (
            transcript && (
              <Card className="p-3 mb-4 bg-muted">
                <p className="text-sm mb-1 font-medium">You:</p>
                <p className="text-sm">{transcript}</p>
              </Card>
            )
          )}
          
          {interimTranscript && (
            <Card className="p-3 mb-4 bg-gray-100 border border-dashed border-gray-300">
              <p className="text-sm italic text-gray-500">{interimTranscript}...</p>
            </Card>
          )}
          
          {isLoading && (
            <div className="flex justify-center my-4" aria-label="Processing your request">
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
              aria-label="Close dialog"
            >
              <X size={16} />
            </Button>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Try saying "Go to home page", "Go to caregivers page", "Go to how it works page", "Go to about us page", or ask about specific services like "Tell me about meal preparation".
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Accessibility controls */}
        <div className="flex flex-wrap gap-4 px-4 py-2 bg-muted/50 rounded-md mb-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="auto-speak" 
              checked={isAutoSpeaking}
              onCheckedChange={setAutoSpeaking}
            />
            <Label htmlFor="auto-speak" className="flex items-center gap-1">
              <Speaker size={16} />
              <span>Auto-speak responses</span>
            </Label>
          </div>
          
          {voices.length > 0 && setVoice && (
            <div className="flex items-center space-x-2">
              <select 
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                value={currentVoice?.name || ''}
                onChange={(e) => {
                  const selectedVoice = voices.find(v => v.name === e.target.value);
                  if (selectedVoice) setVoice(selectedVoice);
                }}
                aria-label="Select voice"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant={isListening ? "destructive" : "default"}
              className="flex-1"
              onClick={toggleListening}
              disabled={isLoading}
              aria-pressed={isListening}
              aria-label={isListening ? "Stop listening" : "Start listening"}
            >
              {isListening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
              {isListening ? "Stop Listening" : "Start Listening"}
            </Button>
            
            <Button
              variant="outline"
              disabled={!transcript || isLoading}
              onClick={processCommand}
              className="flex-1"
              aria-label="Process command"
            >
              Process
            </Button>
          </div>
          
          {isSpeaking ? (
            <Button 
              variant="secondary" 
              onClick={stopSpeaking}
              aria-label="Stop speaking"
            >
              <Volume className="mr-2 h-4 w-4" />
              Stop Speaking
            </Button>
          ) : response ? (
            <Button 
              variant="secondary" 
              onClick={() => speakResponse(response)}
              aria-label="Speak response"
            >
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
