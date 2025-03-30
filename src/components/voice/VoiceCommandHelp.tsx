
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/shadcn-button';
import { HelpCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { pageContextResponses } from '@/utils/voiceCommands';

const VoiceCommandHelp = () => {
  const location = useLocation();
  const currentPage = location.pathname;
  
  // Get page-specific help text if available
  const pageContext = pageContextResponses[currentPage] || {
    helpText: "You can ask me to navigate to different pages or tell you about our services."
  };

  // Organize commands by category for better readability
  const commandCategories = [
    {
      category: "Navigation",
      examples: [
        "Go to home page",
        "Go to caregivers",
        "How it works",
        "About us",
        "Book a caregiver"
      ]
    },
    {
      category: "Services",
      examples: [
        "Tell me about meal preparation",
        "I need cooking help",
        "Looking for cleaning services",
        "Need transportation assistance",
        "Need medication help"
      ]
    },
    {
      category: "Current Page",
      examples: [
        "Where am I?",
        "What can I do on this page?",
        "Help me with this page",
        "What is this page about?"
      ]
    },
    {
      category: "Conversational",
      examples: [
        "Hello",
        "Thank you",
        "What can you do?",
        "Help"
      ]
    }
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          aria-label="Voice command help"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Voice Command Help</h3>
          <p className="text-xs text-muted-foreground">
            {pageContext.helpText}
          </p>
          
          <ScrollArea className="h-72 rounded-md">
            <div className="space-y-4 px-1 py-2">
              {commandCategories.map((item, index) => (
                <div key={index}>
                  <h4 className="mb-1 text-xs font-medium text-primary">{item.category}</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {item.examples.map((example, i) => (
                      <li key={i} className="text-xs">{example}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VoiceCommandHelp;
