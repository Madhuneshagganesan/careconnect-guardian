
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
  const commandHistoryRef = useRef<{command: string, timestamp: number}[]>([]);
  const processingRetryCountRef = useRef(0);
  
  // Process commands with debouncing and intelligent detection of duplicates
  const processCommand = useCallback(async () => {
    // Don't process if there's no transcript
    if (!transcript.trim()) {
      return;
    }
    
    // Already loading, don't process again
    if (isLoading) return;
    
    // Check for duplicate commands in a short time window (command history)
    const currentTime = Date.now();
    const recentCommands = commandHistoryRef.current.filter(
      item => currentTime - item.timestamp < 10000 // Look at last 10 seconds
    );
    
    // Check if this is a duplicate of a recent command
    const isDuplicate = recentCommands.some(item => {
      // Compare the first 10 words (if available)
      const currentWords = transcript.toLowerCase().split(' ').slice(0, 10).join(' ');
      const historyWords = item.command.toLowerCase().split(' ').slice(0, 10).join(' ');
      
      // If the core parts match closely, consider it a duplicate
      return currentWords === historyWords || 
             (currentWords.length > 5 && historyWords.includes(currentWords)) ||
             (historyWords.length > 5 && currentWords.includes(historyWords));
    });
    
    if (isDuplicate && processingRetryCountRef.current < 1) {
      console.log("Detected duplicate command, skipping processing:", transcript);
      processingRetryCountRef.current++;
      return;
    }
    
    setIsLoading(true);
    console.log("Processing voice command:", transcript);
    
    try {
      // Store the current transcript to prevent reprocessing
      const currentTranscript = transcript;
      lastProcessedRef.current = currentTranscript;
      
      // Add to command history
      commandHistoryRef.current = [
        ...commandHistoryRef.current.slice(-9), // Keep last 9 commands
        { command: currentTranscript, timestamp: Date.now() }
      ];
      
      // Reset retry counter
      processingRetryCountRef.current = 0;
      
      // Clear timeout if it exists
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }
      
      // Intelligent processing of the transcript
      const processedTranscript = preprocessTranscript(currentTranscript);
      console.log("Processed transcript:", processedTranscript);
      
      // Process the command with the processed transcript
      const responseText = await processVoiceCommand(
        processedTranscript,
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
  
  // Preprocess transcript for better command recognition
  const preprocessTranscript = (text: string): string => {
    if (!text) return text;
    
    // Step 1: Remove filler words and common speech artifacts
    let processed = text.replace(/\b(um|uh|like|you know|I mean|actually)\b/gi, ' ');
    
    // Step 2: Fix common speech recognition errors
    processed = processed.replace(/go to the home/gi, 'go to home');
    processed = processed.replace(/go to the profile/gi, 'go to profile');
    processed = processed.replace(/can you (go|take me|navigate)/gi, '$1');
    
    // Step 3: Simplify repetitive phrases and words
    processed = simplifyRepetitiveTranscript(processed);
    
    // Step 4: Normalize spacing
    processed = processed.replace(/\s+/g, ' ').trim();
    
    return processed;
  };
  
  // Function to simplify repetitive phrases in transcript
  const simplifyRepetitiveTranscript = (text: string): string => {
    if (!text) return text;
    
    // Split by spaces
    const words = text.split(' ');
    const seenPhrases = new Set<string>();
    
    // For longer repetitive phrases (3-4 words)
    for (let phraseLength = 4; phraseLength >= 2; phraseLength--) {
      if (words.length <= phraseLength) continue;
      
      for (let i = 0; i <= words.length - phraseLength; i++) {
        const phrase = words.slice(i, i + phraseLength).join(' ').toLowerCase();
        
        // Count occurrences of this phrase in the text
        let count = 0;
        let pos = text.toLowerCase().indexOf(phrase);
        
        while (pos !== -1) {
          count++;
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
    
    // Check for single word repetition (more than 2 letters to avoid removing "I I" etc)
    const wordMap: Record<string, number> = {};
    words.forEach(word => {
      const lowerWord = word.toLowerCase();
      if (lowerWord.length > 1) { // Only track words with more than 1 letter
        wordMap[lowerWord] = (wordMap[lowerWord] || 0) + 1;
      }
    });
    
    // If a word repeats more than 3 times, simplify further
    Object.entries(wordMap).forEach(([word, count]) => {
      if (count > 2 && word.length > 2) {
        const regex = new RegExp(`(${word}\\s*){2,}`, 'gi');
        simplifiedText = simplifiedText.replace(regex, `${word} `);
      }
    });
    
    return simplifiedText.trim();
  };
  
  // Reset for new command
  const resetCommand = useCallback(() => {
    lastProcessedRef.current = '';
    setResponse('');
    processingRetryCountRef.current = 0;
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
