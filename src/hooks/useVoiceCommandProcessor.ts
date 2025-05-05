
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface CommandResult {
  response: string;
  path?: string;
  shouldClose?: boolean;
}

export const useVoiceCommandProcessor = (
  transcript: string, 
  setTranscript: (text: string) => void,
  stopListening: () => void,
  speakResponse: (text: string) => void,
  addMessageToHistory: (role: string, content: string) => void,
  currentPage: string
) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const lastProcessedRef = useRef('');
  
  // Process commands
  const processCommand = async () => {
    if (!transcript.trim() || transcript === lastProcessedRef.current) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Store the current transcript to prevent reprocessing
      const currentTranscript = transcript;
      lastProcessedRef.current = currentTranscript;
      
      // Add user input to conversation history
      addMessageToHistory('user', currentTranscript);
      
      const command = currentTranscript.toLowerCase().trim();
      
      // Process command
      let result: CommandResult = { response: '' };
      
      // Navigation commands
      if (command.includes('home') || command.includes('main page')) {
        result = { response: 'Taking you to the home page', path: '/' };
      } 
      else if (command.includes('services') || command.includes('offerings')) {
        result = { response: 'Taking you to our services', path: '/services' };
      }
      else if (command.includes('caregiver') || command.includes('care')) {
        result = { response: 'Taking you to our caregivers', path: '/caregivers' };
      }
      else if (command.includes('book') || command.includes('appointment')) {
        result = { response: 'Taking you to book a service', path: '/book-service' };
      }
      else if (command.includes('profile') || command.includes('account')) {
        result = { response: 'Taking you to your profile', path: '/profile' };
      }
      else if (command.includes('close') || command.includes('bye') || command.includes('exit')) {
        result = { response: 'Closing voice assistant', shouldClose: true };
      }
      // Help commands
      else if (command.includes('help') || command.includes('what can you do')) {
        result = { 
          response: 'I can help you navigate the site, find information, or book services. Try saying "Go to home page" or "Tell me about services".'
        };
      }
      // Search
      else {
        // Treat as search query
        result = { 
          response: `Searching for "${command}"`,
          path: '/services'
        };
        
        // Store search term in session storage
        try {
          sessionStorage.setItem('voiceSearchQuery', command);
        } catch (e) {
          console.error('Error storing search query:', e);
        }
      }
      
      // Set response
      setResponse(result.response);
      
      // Add response to conversation history
      addMessageToHistory('assistant', result.response);
      
      // Speak response
      speakResponse(result.response);
      
      // Navigate if a path was set
      if (result.path) {
        setTimeout(() => navigate(result.path || '/'), 1000);
      }
      
      // Handle closing
      if (result.shouldClose) {
        setTimeout(() => {
          document.dispatchEvent(new CustomEvent('closeVoiceAssistant'));
        }, 1500);
      }
      
      // Clear transcript
      setTranscript('');
      
    } catch (error) {
      console.error('Error processing command:', error);
      const errorMessage = "I'm sorry, I had trouble processing that request.";
      setResponse(errorMessage);
      addMessageToHistory('assistant', errorMessage);
      speakResponse(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset for new command
  const resetCommand = () => {
    lastProcessedRef.current = '';
  };
  
  return {
    isLoading,
    response,
    processCommand,
    setResponse,
    resetCommand
  };
};
