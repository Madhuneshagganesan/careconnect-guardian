import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { findBestCommandMatch, processVoiceCommand } from '@/utils/voiceCommands';

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
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Process commands with debouncing to prevent multiple executions
  const processCommand = useCallback(async () => {
    // Don't process if there's no transcript or if it's the same as last processed
    if (!transcript.trim() || transcript === lastProcessedRef.current) {
      return;
    }
    
    // Already loading, don't process again
    if (isLoading) return;
    
    setIsLoading(true);
    console.log("Processing voice command:", transcript);
    
    try {
      // Store the current transcript to prevent reprocessing
      const currentTranscript = transcript;
      lastProcessedRef.current = currentTranscript;
      
      // Clear timeout if it exists
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }
      
      // Simplify repetitive phrases in transcript
      const simplifiedTranscript = simplifyRepetitiveTranscript(currentTranscript);
      console.log("Simplified transcript:", simplifiedTranscript);
      
      // Process the command with simplified transcript
      const responseText = await processVoiceCommand(
        simplifiedTranscript,
        navigate,
        addMessageToHistory,
        speakResponse,
        currentPage
      );
      
      // Set response
      setResponse(responseText);
      
      // Add assistant response to history
      addMessageToHistory('assistant', responseText);
      
      // Clear transcript
      setTranscript('');
      
    } catch (error) {
      console.error('Error processing command:', error);
      const errorMessage = "I'm sorry, I had trouble processing that request.";
      setResponse(errorMessage);
      addMessageToHistory('assistant', errorMessage);
      
      toast({
        title: "Processing Error",
        description: "There was an error processing your voice command.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      
      // Set timeout to allow processing again after a delay
      processingTimeoutRef.current = setTimeout(() => {
        lastProcessedRef.current = '';
      }, 2000); // Increased delay to prevent rapid reprocessing
    }
  }, [transcript, navigate, addMessageToHistory, speakResponse, currentPage, setTranscript, isLoading]);
  
  // Function to simplify repetitive phrases in transcript
  const simplifyRepetitiveTranscript = (text: string): string => {
    if (!text) return text;
    
    // Split by spaces
    const words = text.split(' ');
    const result: string[] = [];
    const seenPhrases = new Set<string>();
    
    // For longer repetitive phrases (3-4 words)
    for (let phraseLength = 4; phraseLength >= 2; phraseLength--) {
      if (words.length <= phraseLength) continue;
      
      for (let i = 0; i <= words.length - phraseLength; i++) {
        const phrase = words.slice(i, i + phraseLength).join(' ').toLowerCase();
        
        // Count occurrences of this phrase in the text
        let count = 0;
        let position = -1;
        let pos = text.toLowerCase().indexOf(phrase);
        
        while (pos !== -1) {
          count++;
          position = pos;
          pos = text.toLowerCase().indexOf(phrase, pos + 1);
        }
        
        // If phrase repeats more than twice, add to seen phrases
        if (count >= 2) {
          seenPhrases.add(phrase);
        }
      }
    }
    
    // Build simplified text by keeping only one occurrence of repeated phrases
    let currentIndex = 0;
    let simplifiedText = text;
    
    seenPhrases.forEach(phrase => {
      // Replace multiple occurrences with a single occurrence
      const regex = new RegExp(`(${phrase}\\s*){2,}`, 'gi');
      simplifiedText = simplifiedText.replace(regex, `${phrase} `);
    });
    
    // Check for single word repetition
    const wordMap: Record<string, number> = {};
    words.forEach(word => {
      const lowerWord = word.toLowerCase();
      wordMap[lowerWord] = (wordMap[lowerWord] || 0) + 1;
    });
    
    // If a word repeats more than 3 times, simplify further
    Object.entries(wordMap).forEach(([word, count]) => {
      if (count > 3 && word.length > 2) {
        const regex = new RegExp(`(${word}\\s*){3,}`, 'gi');
        simplifiedText = simplifiedText.replace(regex, `${word} `);
      }
    });
    
    return simplifiedText.trim();
  };
  
  // Reset for new command
  const resetCommand = useCallback(() => {
    lastProcessedRef.current = '';
    setResponse('');
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    isLoading,
    response,
    processCommand,
    setResponse,
    resetCommand
  };
};
