
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
  const isProcessingRef = useRef(false);
  
  // Process commands with improved deduplication and repeat prevention
  const processCommand = useCallback(async () => {
    // Don't process if there's no transcript
    if (!transcript.trim()) {
      return;
    }
    
    // Already loading or already processing, don't process again
    if (isLoading || isProcessingRef.current) return;
    
    // Prevent repeated command processing with a more strict check
    if (lastProcessedRef.current === transcript) {
      console.log("Exact duplicate command, skipping:", transcript);
      return;
    }
    
    // Check for duplicate commands in a longer time window (30 seconds)
    const currentTime = Date.now();
    const recentCommands = commandHistoryRef.current.filter(
      item => currentTime - item.timestamp < 30000
    );
    
    // More thorough duplicate detection
    const isDuplicate = recentCommands.some(item => {
      // Compare the first 15 words (if available)
      const currentWords = transcript.toLowerCase().split(' ').slice(0, 15).join(' ');
      const historyWords = item.command.toLowerCase().split(' ').slice(0, 15).join(' ');
      
      // Exact match
      if (currentWords === historyWords) return true;
      
      // Strong similarity check (contained phrases)
      if (currentWords.length > 15 && historyWords.includes(currentWords)) return true;
      if (historyWords.length > 15 && currentWords.includes(historyWords)) return true;
      
      // Count repeated words
      const currentWordsArr = currentWords.split(' ');
      const historyWordsArr = historyWords.split(' ');
      let matchCount = 0;
      
      currentWordsArr.forEach(word => {
        if (historyWordsArr.includes(word) && word.length > 3) matchCount++;
      });
      
      // If more than 70% of words match, consider it a duplicate
      return matchCount > Math.max(currentWordsArr.length, historyWordsArr.length) * 0.7;
    });
    
    if (isDuplicate) {
      console.log("Detected similar command recently, skipping:", transcript);
      return;
    }
    
    // Set processing flag to true
    isProcessingRef.current = true;
    setIsLoading(true);
    console.log("Processing voice command:", transcript);
    
    try {
      // Store the current transcript to prevent reprocessing
      const currentTranscript = transcript;
      lastProcessedRef.current = currentTranscript;
      
      // Add to command history
      commandHistoryRef.current = [
        ...commandHistoryRef.current.slice(-5), // Keep last 5 commands
        { command: currentTranscript, timestamp: currentTime }
      ];
      
      // Reset retry counter
      processingRetryCountRef.current = 0;
      
      // Clear timeout if it exists
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }
      
      // Clean the transcript of repetitions before processing
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
        isProcessingRef.current = false;
      }, 3000); // Increased delay to prevent rapid reprocessing
    }
  }, [transcript, navigate, addMessageToHistory, speakResponse, currentPage, setTranscript, isLoading]);
  
  // Enhanced preprocessing to clean up repetitions
  const preprocessTranscript = (text: string): string => {
    if (!text) return text;
    
    // Step 1: Remove filler words and common speech artifacts
    let processed = text.replace(/\b(um|uh|like|you know|I mean|actually)\b/gi, ' ');
    
    // Step 2: Fix common speech recognition errors
    processed = processed.replace(/go to the home/gi, 'go to home');
    processed = processed.replace(/go to the profile/gi, 'go to profile');
    processed = processed.replace(/can you (go|take me|navigate)/gi, '$1');
    
    // Step 3: Remove excessive repetitions (entire repeated phrases)
    processed = removeRepeatedPhrases(processed);
    
    // Step 4: Normalize spacing
    processed = processed.replace(/\s+/g, ' ').trim();
    
    return processed;
  };
  
  // Function to remove entirely repeated phrases
  const removeRepeatedPhrases = (text: string): string => {
    // Split into words for easier processing
    const words = text.split(' ');
    if (words.length <= 5) return text; // Don't process short phrases
    
    let result: string[] = [];
    let i = 0;
    
    while (i < words.length) {
      // Try to find repeating patterns of different lengths
      let foundRepetition = false;
      
      // Check for repeating patterns of different sizes (3-8 words)
      for (let patternLength = 3; patternLength <= 8; patternLength++) {
        // Don't try patterns longer than half the remaining text
        if (i + patternLength * 2 > words.length) continue;
        
        const pattern = words.slice(i, i + patternLength).join(' ');
        const nextChunk = words.slice(i + patternLength, i + patternLength * 2).join(' ');
        
        // If we found a repetition
        if (pattern.toLowerCase() === nextChunk.toLowerCase()) {
          // Add just one occurrence and skip ahead
          result = result.concat(words.slice(i, i + patternLength));
          i += patternLength * 2; // Skip both occurrences
          foundRepetition = true;
          break;
        }
      }
      
      if (!foundRepetition) {
        // No repetition found, add current word and continue
        result.push(words[i]);
        i++;
      }
    }
    
    return result.join(' ');
  };
  
  // Reset for new command
  const resetCommand = useCallback(() => {
    lastProcessedRef.current = '';
    isProcessingRef.current = false;
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
