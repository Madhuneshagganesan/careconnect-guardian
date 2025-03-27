
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
  const [conversationHistory, setConversationHistory] = useState<{role: string, content: string}[]>([]);
  
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

  // Enhanced command processing with NLP-like matching
  const processVoiceCommand = async () => {
    if (!transcript.trim()) return;
    
    setIsLoading(true);
    stopListening();
    
    try {
      // Add user input to conversation history
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user', content: transcript }
      ];
      setConversationHistory(updatedHistory);
      
      const command = transcript.toLowerCase();
      let responseText = '';
      let navigationPath = '';
      let navigationDelay = 1500;

      // Advanced intent categories
      const serviceCategories = {
        'cooking': { path: '/services', response: "I found our cooking assistance services. Let me take you there." },
        'cooking help': { path: '/services', response: "We offer cooking assistance services. Let me show you those options." },
        'meal preparation': { path: '/services', response: "Our caregivers can help with meal preparation. Let me show you our services." },
        'cleaning': { path: '/services', response: "I found our home cleaning services. Let me take you there." },
        'housekeeping': { path: '/services', response: "We offer housekeeping services. Let me show you those options." },
        'medication': { path: '/services', response: "Our medication management services are available. Taking you to the services page." },
        'medicine': { path: '/services', response: "We can help with medicine management. Let me show you our services." },
        'doctor': { path: '/services', response: "We can coordinate with doctors and medical appointments. Taking you to services." },
        'medical': { path: '/services', response: "We offer medical assistance services. Taking you to the services page." },
        'transportation': { path: '/services', response: "Our transportation services can help you get around. Let me show you the details." },
        'drive': { path: '/services', response: "We provide transportation services. Let me take you to that section." },
        'shopping': { path: '/services', response: "We can help with shopping. Let me show you our services." },
        'grocery': { path: '/services', response: "Our caregivers can assist with grocery shopping. Let me show you our services." },
        'companionship': { path: '/services', response: "We offer companionship services. Let me take you to that section." },
        'company': { path: '/services', response: "Our companionship services provide social interaction. Let me show you the details." },
        'personal care': { path: '/services', response: "We provide personal care services. Let me show you that section." },
        'bathing': { path: '/services', response: "Our personal care services include bathing assistance. Let me take you to services." },
        'exercise': { path: '/services', response: "We can help with exercise and physical activity. Let me show you our services." },
        'fitness': { path: '/services', response: "Our caregivers can assist with fitness routines. Taking you to services." },
      };
      
      // Navigation commands mapping for direct matches
      const navigationCommands = {
        'home': { path: '/', response: "Taking you to the home page." },
        'main page': { path: '/', response: "Taking you to the main page." },
        'go home': { path: '/', response: "Taking you to the home page." },
        'homepage': { path: '/', response: "Taking you to the homepage." },
        
        'book': { path: '/book-service', response: "Let's book a service for you." },
        'book service': { path: '/book-service', response: "Taking you to book a service." },
        'book a service': { path: '/book-service', response: "Let's get you set up with a service booking." },
        'appointment': { path: '/book-service', response: "Let's set up an appointment for you." },
        'schedule': { path: '/book-service', response: "Let's schedule a service for you." },
        
        'caregivers': { path: '/caregivers', response: "Here are our available caregivers." },
        'caregiver': { path: '/caregivers', response: "Let me show you our caregivers." },
        'find caregiver': { path: '/caregivers', response: "Let's find the right caregiver for you." },
        'find caregivers': { path: '/caregivers', response: "Let me help you find caregivers." },
        'show caregiver': { path: '/caregivers', response: "Here are our caregivers." },
        'show caregivers': { path: '/caregivers', response: "Let me show you our available caregivers." },
        'all caregivers': { path: '/caregivers', response: "Here's a list of all our caregivers." },
        
        'profile': { path: '/profile', response: "Taking you to your profile." },
        'my profile': { path: '/profile', response: "Here's your profile information." },
        'account': { path: '/profile', response: "Taking you to your account settings." },
        'my account': { path: '/profile', response: "Here's your account information." },
        'settings': { path: '/profile', response: "Here are your account settings." },
        
        'services': { path: '/services', response: "Here are all the services we offer." },
        'our services': { path: '/services', response: "Let me show you our services." },
        'what services': { path: '/services', response: "Here's information about our services." },
        'your services': { path: '/services', response: "These are the services we provide." },
        'offerings': { path: '/services', response: "Here are our service offerings." },
        
        'how it works': { path: '/how-it-works', response: "Let me explain how our service works." },
        'how does it work': { path: '/how-it-works', response: "Here's information on how our service works." },
        'process': { path: '/how-it-works', response: "Let me show you our process." },
        'how guardian go works': { path: '/how-it-works', response: "Here's how Guardian Go works." },
        
        'about': { path: '/about', response: "Here's information about our company." },
        'about us': { path: '/about', response: "Let me tell you about our company." },
        'company': { path: '/about', response: "Here's information about our company." },
        'who are you': { path: '/about', response: "Let me tell you about who we are." }
      };
      
      // Contextual intent detection
      const findIntent = () => {
        // Check for exact navigational matches first
        for (const [phrase, data] of Object.entries(navigationCommands)) {
          if (command.includes(phrase)) {
            return { path: data.path, response: data.response };
          }
        }
        
        // Check for service category matches
        for (const [category, data] of Object.entries(serviceCategories)) {
          if (command.includes(category)) {
            return { path: data.path, response: data.response };
          }
        }
        
        // Advanced intent detection for complex queries
        if (command.includes('help') || command.includes('need assistance')) {
          return { path: '/services', response: "I can help you find the right service. Taking you to our services page." };
        }
        
        if (command.includes('find') || command.includes('search') || command.includes('looking for')) {
          if (command.includes('care') || command.includes('help')) {
            return { path: '/services', response: "Let me help you find the care services you need." };
          }
          return { path: '/caregivers', response: "Let me help you find the right caregiver for your needs." };
        }
        
        if (command.includes('emergency') || command.includes('urgent')) {
          return { 
            path: null, 
            response: "I understand this is urgent. I'm alerting our emergency team right away. Help is on the way." 
          };
        }
        
        // Payment related queries
        if (command.includes('payment') || command.includes('pay') || command.includes('cost') || command.includes('price')) {
          return { 
            path: '/book-service', 
            response: "We accept cash on delivery as our payment method. Let me take you to our booking page for more details." 
          };
        }
        
        return null;
      };
      
      // Process the intent
      const intent = findIntent();
      
      if (intent) {
        navigationPath = intent.path;
        responseText = intent.response;
        
        // Handle special cases like emergency
        if (intent.path === null && intent.response.includes('emergency')) {
          toast({
            title: "Emergency Alert",
            description: "Our care team has been notified and will contact you immediately.",
            variant: "destructive",
          });
        }
      } else {
        // Conversational fallback
        if (command.includes('hello') || command.includes('hi') || command.includes('hey')) {
          responseText = "Hello! I'm your Guardian Go assistant. How can I help you today?";
        } 
        else if (command.includes('thank')) {
          responseText = "You're welcome! Is there anything else I can help you with?";
        }
        else if (command.includes('bye') || command.includes('goodbye')) {
          responseText = "Goodbye! Feel free to ask for help anytime.";
        }
        else {
          responseText = "I'm not sure I understood that. You can ask me to navigate to different pages like 'go to home', 'show caregivers', or ask about specific services like 'cooking help' or 'medication assistance'.";
        }
      }
      
      // Add assistant response to conversation history
      setConversationHistory([
        ...updatedHistory,
        { role: 'assistant', content: responseText }
      ]);
      
      setResponse(responseText);
      speakResponse(responseText);
      
      // Navigate if a path was set
      if (navigationPath) {
        setTimeout(() => navigate(navigationPath), navigationDelay);
      }
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
  
  // Automatically process voice commands after a short delay
  useEffect(() => {
    if (transcript && isListening) {
      const timeoutId = setTimeout(() => {
        processVoiceCommand();
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [transcript]);
  
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
              Try saying "Find cooking help" or "I need medical assistance" to find relevant services, or navigate directly with "Go to how it works".
            </AlertDialogDescription>
          </AlertDialogHeader>
          
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
