
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
        <div className="py-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {conversationHistory.length > 0 ? (
            <div className="space-y-4" aria-live="polite">
              {conversationHistory.map((msg, index) => (
                <Card 
                  key={index} 
                  className={`p-4 transition-all shadow-sm hover:shadow-md ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-muted/80 to-muted border-muted/50 ml-4 mr-2' 
                      : 'bg-gradient-to-r from-guardian-50 to-guardian-100/50 border-guardian-200/30 mr-4 ml-2'
                  } rounded-2xl`}
                >
                  <p className="text-sm mb-1 font-semibold flex items-center">
                    {msg.role === 'user' ? (
                      <>
                        <span className="bg-muted-foreground/20 text-muted-foreground text-xs p-1 rounded-md mr-2">You</span>
                      </>
                    ) : (
                      <>
                        <span className="bg-guardian-100 text-guardian-700 text-xs p-1 rounded-md mr-2">Assistant</span>
                      </>
                    )}
                  </p>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </Card>
              ))}
            </div>
          ) : (
            transcript && (
              <Card className="p-4 mb-4 bg-muted/80 border-muted/30 rounded-2xl shadow-sm ml-4 mr-2">
                <p className="text-sm mb-1 font-semibold flex items-center">
                  <span className="bg-muted-foreground/20 text-muted-foreground text-xs p-1 rounded-md mr-2">You</span>
                </p>
                <p className="text-sm leading-relaxed">{transcript}</p>
              </Card>
            )
          )}
          
          {interimTranscript && (
            <Card className="p-4 mb-4 bg-gray-50 border border-dashed border-gray-300 rounded-2xl ml-4 mr-2 animate-pulse">
              <p className="text-sm italic text-gray-500">{interimTranscript}...</p>
            </Card>
          )}
          
          {isLoading && (
            <div className="flex justify-center my-6 items-center" aria-label="Processing your request">
              <div className="relative">
                <Loader2 className="h-8 w-8 animate-spin text-guardian-500" />
                <div className="absolute inset-0 h-8 w-8 rounded-full border-2 border-t-guardian-500 border-r-transparent border-b-transparent border-l-transparent animate-spin opacity-30"></div>
              </div>
              <span className="ml-3 text-sm text-muted-foreground">Processing...</span>
            </div>
          )}
        </div>
        
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-guardian-500 to-guardian-600 bg-clip-text text-transparent font-bold">Voice Assistant</span>
              <VoiceCommandHelp />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full border-guardian-200 hover:bg-guardian-50"
              onClick={() => setIsOpen(false)}
              aria-label="Close dialog"
            >
              <X size={16} className="text-guardian-700" />
            </Button>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
            Try saying "Go to home page", "Go to caregivers page", "Go to how it works page", "Go to about us page", or ask about specific services like "Tell me about meal preparation".
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Accessibility controls */}
        <div className="flex flex-wrap gap-4 px-4 py-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg mb-4 border border-muted/40">
          <div className="flex items-center space-x-2">
            <Switch 
              id="auto-speak" 
              checked={isAutoSpeaking}
              onCheckedChange={setAutoSpeaking}
              className="data-[state=checked]:bg-guardian-500"
            />
            <Label htmlFor="auto-speak" className="flex items-center gap-1 text-sm text-muted-foreground">
              <Speaker size={16} className="text-guardian-600" />
              <span>Auto-speak responses</span>
            </Label>
          </div>
          
          {voices.length > 0 && setVoice && (
            <div className="flex items-center space-x-2">
              <select 
                className="h-9 rounded-md border border-input bg-background/80 px-3 text-sm focus:border-guardian-300 focus:ring focus:ring-guardian-200 focus:ring-opacity-50 transition-all"
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
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-3">
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant={isListening ? "destructive" : "default"}
              className={`flex-1 ${!isListening ? "bg-guardian-500 hover:bg-guardian-600" : ""}`}
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
              className="flex-1 border-guardian-200 hover:bg-guardian-50 hover:text-guardian-700"
              aria-label="Process command"
            >
              Process
            </Button>
          </div>
          
          {isSpeaking ? (
            <Button 
              variant="secondary" 
              onClick={stopSpeaking}
              className="bg-guardian-100 hover:bg-guardian-200 text-guardian-700"
              aria-label="Stop speaking"
            >
              <Volume className="mr-2 h-4 w-4" />
              Stop Speaking
            </Button>
          ) : response ? (
            <Button 
              variant="secondary" 
              onClick={() => speakResponse(response)}
              className="bg-guardian-100 hover:bg-guardian-200 text-guardian-700"
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
      className="fixed bottom-6 right-6 rounded-full shadow-lg w-16 h-16 z-[9999] bg-gradient-to-tr from-guardian-600 to-guardian-400 hover:from-guardian-700 hover:to-guardian-500 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm"
      size="icon"
      variant="default"
      aria-label="Open voice assistant"
    >
      <div className="relative flex items-center justify-center w-full h-full">
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
