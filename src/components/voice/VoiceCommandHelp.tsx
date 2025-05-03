
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
      category: "Assistant Controls",
      examples: [
        "Close",
        "Exit",
        "Bye",
        "Help",
        "What can you do?",
        "Show commands"
      ]
    },
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
      category: "FAQ",
      examples: [
        "Hours of operation",
        "Pricing",
        "Insurance",
        "Qualifications"
      ]
    }
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full border-guardian-200 hover:bg-guardian-50/50 bg-white/70"
          aria-label="Voice command help"
        >
          <HelpCircle className="h-4 w-4 text-guardian-600" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden bg-white/95 backdrop-blur-sm border border-guardian-100/60 shadow-lg rounded-lg">
        <div className="bg-gradient-to-r from-guardian-100 to-guardian-50/50 p-3 border-b border-guardian-100/50">
          <h3 className="font-medium text-guardian-800">Voice Command Help</h3>
          <p className="text-xs text-guardian-600 mt-1">
            {pageContext.helpText}
          </p>
        </div>
        
        <ScrollArea className="h-72 px-3 py-2 custom-scrollbar">
          <div className="space-y-4">
            {commandCategories.map((item, index) => (
              <div key={index} className="pb-2 last:pb-0">
                <h4 className="mb-2 text-xs font-semibold text-guardian-700 bg-guardian-50 p-1.5 rounded-md">{item.category}</h4>
                <ul className="grid grid-cols-1 gap-1">
                  {item.examples.map((example, i) => (
                    <li key={i} className="text-xs flex items-center">
                      <span className="inline-block w-1.5 h-1.5 bg-guardian-300 rounded-full mr-2"></span>
                      <span className="text-muted-foreground">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default VoiceCommandHelp;
