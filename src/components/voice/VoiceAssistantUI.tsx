
import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Volume, Loader2, X, Speaker, Language, Play, Settings } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LANGUAGE_OPTIONS = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'pt-BR', name: 'Portuguese' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'hi-IN', name: 'Hindi' },
];

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
  detectedLanguage?: string;
  setDetectedLanguage?: (lang: string) => void;
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
  setVoice,
  detectedLanguage = 'en-US',
  setDetectedLanguage
}) => {
  const [activeTab, setActiveTab] = useState<string>("chat");
  
  // If this component is being used in the dialog, render the full UI
  if (isOpen) {
    return (
      <>
        <Tabs defaultValue="chat" className="w-full" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-[200px] grid-cols-2 bg-purple-50">
              <TabsTrigger value="chat" className="data-[state=active]:bg-purple-200 data-[state=active]:text-purple-900">
                Chat
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-purple-200 data-[state=active]:text-purple-900">
                Settings
              </TabsTrigger>
            </TabsList>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full border-purple-200 hover:bg-purple-50"
              onClick={() => setIsOpen(false)}
              aria-label="Close dialog"
            >
              <X size={16} className="text-purple-700" />
            </Button>
          </div>
          
          <TabsContent value="chat" className="mt-0">
            <div className="py-4 max-h-[60vh] overflow-y-auto custom-scrollbar bg-gradient-to-b from-white to-purple-50/30 rounded-lg">
              {conversationHistory.length > 0 ? (
                <div className="space-y-4 px-2" aria-live="polite">
                  {conversationHistory.map((msg, index) => (
                    <Card 
                      key={index} 
                      className={`p-4 transition-all shadow-md hover:shadow-lg ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200/50 ml-4 mr-2' 
                          : 'bg-gradient-to-r from-purple-50 to-pink-50/50 border-purple-200/30 mr-4 ml-2'
                      } rounded-2xl`}
                    >
                      <p className="text-sm mb-1 font-semibold flex items-center">
                        {msg.role === 'user' ? (
                          <>
                            <span className="bg-slate-200/80 text-slate-700 text-xs px-2 py-1 rounded-md mr-2">You</span>
                          </>
                        ) : (
                          <>
                            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-md mr-2">Assistant</span>
                          </>
                        )}
                      </p>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                transcript && (
                  <Card className="p-4 mb-4 bg-slate-50 border-slate-200/30 rounded-2xl shadow-md mx-2">
                    <p className="text-sm mb-1 font-semibold flex items-center">
                      <span className="bg-slate-200/80 text-slate-700 text-xs px-2 py-1 rounded-md mr-2">You</span>
                    </p>
                    <p className="text-sm leading-relaxed">{transcript}</p>
                  </Card>
                )
              )}
              
              {interimTranscript && (
                <Card className="p-4 mb-4 mx-2 bg-slate-50/80 border border-dashed border-slate-200 rounded-2xl animate-pulse">
                  <p className="text-sm italic text-slate-500">{interimTranscript}...</p>
                </Card>
              )}
              
              {isLoading && (
                <div className="flex justify-center my-6 items-center" aria-label="Processing your request">
                  <div className="relative">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    <div className="absolute inset-0 h-8 w-8 rounded-full border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin opacity-30"></div>
                  </div>
                  <span className="ml-3 text-sm text-slate-600">Processing...</span>
                </div>
              )}
              
              {!isLoading && !transcript && conversationHistory.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Mic size={24} className="text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-2">Voice Assistant</h3>
                  <p className="text-sm text-center text-slate-500 max-w-xs">
                    Click the microphone button below and start speaking. I'll listen and help you navigate or answer questions.
                  </p>
                </div>
              )}
            </div>
            
            <AlertDialogHeader>
              <AlertDialogDescription className="text-xs leading-relaxed text-slate-500 mt-2">
                {detectedLanguage && detectedLanguage !== 'en-US' ? (
                  <div className="flex items-center gap-1 text-purple-600">
                    <Language size={14} />
                    <span>Speaking in {LANGUAGE_OPTIONS.find(l => l.code === detectedLanguage)?.name || detectedLanguage}</span>
                  </div>
                ) : (
                  "Try saying \"Go to home page\", \"Go to caregivers\", or ask about services"
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-4">
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  variant={isListening ? "destructive" : "default"}
                  className={`flex-1 ${!isListening ? "bg-purple-500 hover:bg-purple-600" : ""}`}
                  onClick={toggleListening}
                  disabled={isLoading}
                  aria-pressed={isListening}
                  aria-label={isListening ? "Stop listening" : "Start listening"}
                >
                  {isListening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                  {isListening ? "Stop" : "Start"}
                </Button>
                
                <Button
                  variant="outline"
                  disabled={!transcript || isLoading}
                  onClick={processCommand}
                  className="flex-1 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                  aria-label="Process command"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Process
                </Button>
              </div>
              
              {isSpeaking ? (
                <Button 
                  variant="secondary" 
                  onClick={stopSpeaking}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700"
                  aria-label="Stop speaking"
                >
                  <Volume className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              ) : response ? (
                <Button 
                  variant="secondary" 
                  onClick={() => speakResponse(response)}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700"
                  aria-label="Speak response"
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                  Speak
                </Button>
              ) : null}
            </AlertDialogFooter>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0 space-y-4">
            <div className="p-4 bg-white rounded-lg border border-purple-100/50 shadow-sm">
              <h3 className="text-sm font-medium text-slate-800 mb-3 flex items-center gap-2">
                <Speaker size={16} className="text-purple-600" />
                Voice Settings
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-speak" className="text-sm text-slate-600">Auto-speak responses</Label>
                  <Switch 
                    id="auto-speak" 
                    checked={isAutoSpeaking}
                    onCheckedChange={setAutoSpeaking}
                    className="data-[state=checked]:bg-purple-500"
                  />
                </div>
                
                {voices && voices.length > 0 && setVoice && (
                  <div className="space-y-2">
                    <Label htmlFor="voice-select" className="text-sm text-slate-600">Assistant voice</Label>
                    <select 
                      id="voice-select"
                      className="w-full h-9 rounded-md border border-purple-200 bg-white px-3 text-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all"
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
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-purple-100/50 shadow-sm">
              <h3 className="text-sm font-medium text-slate-800 mb-3 flex items-center gap-2">
                <Language size={16} className="text-purple-600" />
                Language Settings
              </h3>
              
              {setDetectedLanguage && (
                <div className="space-y-2">
                  <Label htmlFor="language-select" className="text-sm text-slate-600">Recognition language</Label>
                  <select 
                    id="language-select"
                    className="w-full h-9 rounded-md border border-purple-200 bg-white px-3 text-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all"
                    value={detectedLanguage}
                    onChange={(e) => setDetectedLanguage(e.target.value)}
                    aria-label="Select recognition language"
                  >
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Speech recognition will also try to auto-detect your speaking language
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-purple-100/50 shadow-sm">
              <h3 className="text-sm font-medium text-slate-800 mb-3 flex items-center gap-2">
                <Settings size={16} className="text-purple-600" />
                Help & Information
              </h3>
              
              <VoiceCommandHelp />
              
              <p className="text-xs text-slate-500 mt-3">
                The voice assistant can understand multiple languages and will try to respond in the detected language.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  }
  
  // If not showing in dialog, just render the floating button
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
