
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, Volume, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from '@/components/ui/use-toast';

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  
  // Initialize speech recognition and synthesis
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
      };
    }
    
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      stopListening();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);
  
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const startListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }
    
    recognitionRef.current.start();
    setIsListening(true);
    setTranscript('');
  };
  
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };
  
  const processVoiceCommand = async () => {
    if (!transcript.trim()) return;
    
    setIsLoading(true);
    stopListening();
    
    try {
      // In a real app, you would send the transcript to your backend/API
      // For this demo, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Process common voice commands
      let responseText = '';
      const command = transcript.toLowerCase();
      
      if (command.includes('book') && (command.includes('service') || command.includes('caregiver'))) {
        responseText = "I can help you book a service. Taking you to the booking page now.";
        setTimeout(() => navigate('/book-service'), 1500);
      } 
      else if (command.includes('find') && command.includes('caregiver')) {
        responseText = "Let me show you our available caregivers.";
        setTimeout(() => navigate('/caregivers'), 1500);
      }
      else if (command.includes('track') && (command.includes('caregiver') || command.includes('service'))) {
        responseText = "I'll check the status of your current service for you.";
        setTimeout(() => navigate('/profile'), 1500);
      } 
      else if (command.includes('profile') || command.includes('account')) {
        responseText = "Opening your profile settings.";
        setTimeout(() => navigate('/profile'), 1500);
      }
      else if (command.includes('services') || command.includes('what services')) {
        responseText = "Here are the services we offer.";
        setTimeout(() => navigate('/services'), 1500);
      }
      else if (command.includes('how') && command.includes('work')) {
        responseText = "Let me show you how Guardian Go works.";
        setTimeout(() => navigate('/how-it-works'), 1500);
      }
      else if (command.includes('about')) {
        responseText = "Taking you to our About Us page.";
        setTimeout(() => navigate('/about'), 1500);
      }
      else if (command.includes('contact') || command.includes('help')) {
        responseText = "You can contact our support team through your profile page. Taking you there now.";
        setTimeout(() => navigate('/profile'), 1500);
      }
      else if (command.includes('emergency') || command.includes('help immediately')) {
        responseText = "I'm alerting our emergency team right away. Help is on the way.";
        toast({
          title: "Emergency Alert",
          description: "Our care team has been notified and will contact you immediately.",
          variant: "destructive",
        });
      } 
      else if (command.includes('login') || command.includes('sign in')) {
        responseText = "Taking you to the login page.";
        setTimeout(() => navigate('/login'), 1500);
      }
      else if (command.includes('sign up') || command.includes('register')) {
        responseText = "Taking you to the sign up page.";
        setTimeout(() => navigate('/signup'), 1500);
      }
      else if (command.includes('log out') || command.includes('sign out')) {
        responseText = "Do you want me to log you out?";
        // This would require additional confirmation in a real app
      }
      else {
        responseText = "I'm sorry, I didn't understand that request. You can ask me to book a service, find caregivers, track your service, view your profile, or get help.";
      }
      
      setResponse(responseText);
      speakResponse(responseText);
    } catch (error) {
      console.error('Error processing voice command', error);
      toast({
        title: "Processing Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const speakResponse = (text: string) => {
    if (!synthRef.current) {
      toast({
        title: "Not Supported",
        description: "Voice synthesis is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };
  
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };
  
  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-6 right-6 rounded-full shadow-lg w-14 h-14 z-50"
        size="icon"
      >
        <Mic size={24} />
      </Button>
      
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-between">
              <span>Voice Assistant</span>
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
              Ask me to book a service, find caregivers, track your caregiver, or get help with your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            {transcript && (
              <Card className="p-3 mb-4 bg-muted">
                <p className="text-sm">{transcript}</p>
              </Card>
            )}
            
            {response && (
              <Card className="p-3 bg-primary/10 border-primary/20">
                <p className="text-sm">{response}</p>
              </Card>
            )}
            
            {isLoading && (
              <div className="flex justify-center my-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
              >
                {isListening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                {isListening ? "Stop Listening" : "Start Listening"}
              </Button>
              
              <Button
                variant="outline"
                disabled={!transcript || isLoading}
                onClick={processVoiceCommand}
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
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default VoiceAssistant;
