import { NavigateFunction } from 'react-router-dom';

// Define the command types
type CommandData = {
  path: string;
  response: string;
};

// Command match result type
interface CommandMatch {
  type: 'assistant' | 'navigation' | 'service';
  data: CommandData | { response: string; path?: string };
}

// Define commands interfaces
export interface NavigationCommands {
  [key: string]: CommandData;
}

export interface ServiceCategories {
  [key: string]: CommandData;
}

export interface AssistantCommands {
  [key: string]: string;
}

// Context-specific responses for different pages
export interface PageContextResponses {
  [key: string]: {
    general: string[];
    helpText: string;
  };
}

// Navigation commands collection
export const navigationCommands: NavigationCommands = {
  // Home page navigation (8 variations)
  'go to home': { path: '/', response: "Taking you to the home page." },
  'go to home page': { path: '/', response: "Taking you to the home page." },
  'home page': { path: '/', response: "Navigating to the home page." },
  'go home': { path: '/', response: "Taking you home." },
  'homepage': { path: '/', response: "Going to the homepage." },
  'main page': { path: '/', response: "Taking you to the main page." },
  'navigate to home': { path: '/', response: "Navigating to home." },
  'take me home': { path: '/', response: "Taking you to the home page." },
  
  // Caregivers page navigation (8 variations)
  'go to caregivers': { path: '/caregivers', response: "Taking you to the caregivers page." },
  'go to caregivers page': { path: '/caregivers', response: "Navigating to the caregivers page." },
  'caregivers page': { path: '/caregivers', response: "Going to the caregivers page." },
  'show caregivers': { path: '/caregivers', response: "Showing you our caregivers." },
  'find caregivers': { path: '/caregivers', response: "Let's find you a caregiver." },
  'find caregiver': { path: '/caregivers', response: "Let's find you a caregiver." },
  'navigate to caregivers': { path: '/caregivers', response: "Navigating to caregivers." },
  'view caregivers': { path: '/caregivers', response: "Viewing caregiver profiles." },
  
  // How it works page navigation (8 variations)
  'go to how it works': { path: '/how-it-works', response: "Taking you to the how it works page." },
  'go to how it works page': { path: '/how-it-works', response: "Navigating to how it works." },
  'how it works page': { path: '/how-it-works', response: "Going to the how it works page." },
  'how it works': { path: '/how-it-works', response: "Let me explain how it works." },
  'how does it work': { path: '/how-it-works', response: "Let me show you how it works." },
  'explanation': { path: '/how-it-works', response: "Let me show you how our service works." },
  'service process': { path: '/how-it-works', response: "Taking you to our service process explanation." },
  'steps to use': { path: '/how-it-works', response: "Let me show you the steps to use our service." },
  
  // About us page navigation (8 variations)
  'go to about': { path: '/about', response: "Taking you to the about us page." },
  'go to about us': { path: '/about', response: "Navigating to about us." },
  'go to about us page': { path: '/about', response: "Taking you to the about us page." },
  'about us page': { path: '/about', response: "Going to the about us page." },
  'about us': { path: '/about', response: "Let me tell you about us." },
  'about': { path: '/about', response: "Going to the about page." },
  'who are you': { path: '/about', response: "Let me show you who we are." },
  'company information': { path: '/about', response: "Taking you to our company information page." },
  
  // Book service page navigation (10 variations)
  'go to book a caregiver': { path: '/book-service', response: "Taking you to book a caregiver." },
  'go to book a caregiver page': { path: '/book-service', response: "Navigating to book a caregiver." },
  'book a caregiver': { path: '/book-service', response: "Let's book a caregiver for you." },
  'book a caregiver page': { path: '/book-service', response: "Going to book a caregiver page." },
  'book caregiver': { path: '/book-service', response: "Let's book a caregiver." },
  'book service': { path: '/book-service', response: "Let's book a service for you." },
  'book a service': { path: '/book-service', response: "Taking you to book a service." },
  'make reservation': { path: '/book-service', response: "Let's make a reservation for you." },
  'schedule service': { path: '/book-service', response: "Let's schedule a service for you." },
  'appointment': { path: '/book-service', response: "Let's set up an appointment for you." },
  
  // Profile page navigation (8 variations)
  'go to profile': { path: '/profile', response: "Taking you to your profile." },
  'go to profile page': { path: '/profile', response: "Navigating to your profile." },
  'profile page': { path: '/profile', response: "Going to your profile page." },
  'my profile': { path: '/profile', response: "Taking you to your profile." },
  'profile': { path: '/profile', response: "Going to your profile." },
  'my account': { path: '/profile', response: "Taking you to your account." },
  'my settings': { path: '/profile', response: "Going to your settings." },
  'view profile': { path: '/profile', response: "Viewing your profile." },
  
  // Services page navigation (10 variations)
  'go to services': { path: '/services', response: "Taking you to our services." },
  'go to services page': { path: '/services', response: "Navigating to services page." },
  'services page': { path: '/services', response: "Going to the services page." },
  'our services': { path: '/services', response: "Let me show you our services." },
  'services': { path: '/services', response: "Going to services." },
  'what services': { path: '/services', response: "Let me show you what services we offer." },
  'service offerings': { path: '/services', response: "Taking you to our service offerings." },
  'service options': { path: '/services', response: "Let me show you our service options." },
  'available services': { path: '/services', response: "Showing you our available services." },
  'what do you offer': { path: '/services', response: "Let me show you what we offer." }
};

// Service categories commands collection
export const serviceCategories: ServiceCategories = {
  // Meal-related services (5 variations)
  'cooking': { path: '/services', response: "I found our cooking assistance services. Let me take you there." },
  'cooking help': { path: '/services', response: "We offer cooking assistance services. Let me show you those options." },
  'meal preparation': { path: '/services', response: "Our caregivers can help with meal preparation. Let me show you our services." },
  'food preparation': { path: '/services', response: "We can help with food preparation. Let me show you those services." },
  'meal assistance': { path: '/services', response: "Our meal assistance services are available. Let me show you." },
  
  // Cleaning services (5 variations)
  'cleaning': { path: '/services', response: "I found our home cleaning services. Let me take you there." },
  'housekeeping': { path: '/services', response: "We offer housekeeping services. Let me show you those options." },
  'house cleaning': { path: '/services', response: "Our house cleaning services can help keep your home tidy. Let me show you." },
  'cleaning service': { path: '/services', response: "Our cleaning services are available. Let me show you the options." },
  'home maintenance': { path: '/services', response: "We offer home maintenance services. Let me show you." },
  
  // Medication services (5 variations)
  'medication': { path: '/services', response: "Our medication management services are available. Taking you to the services page." },
  'medicine': { path: '/services', response: "We can help with medicine management. Let me show you our services." },
  'medication reminders': { path: '/services', response: "Our medication reminder services can help. Let me show you." },
  'prescription management': { path: '/services', response: "We offer prescription management services. Let me show you." },
  'medication assistance': { path: '/services', response: "Our medication assistance services are available. Let me show you." },
  
  // Medical coordination services (5 variations)
  'doctor': { path: '/services', response: "We can coordinate with doctors and medical appointments. Taking you to services." },
  'medical': { path: '/services', response: "We offer medical assistance services. Taking you to the services page." },
  'medical coordination': { path: '/services', response: "Our medical coordination services can help. Let me show you." },
  'doctor appointments': { path: '/services', response: "We can help with doctor appointments. Let me show you our services." },
  'healthcare coordination': { path: '/services', response: "Our healthcare coordination services are available. Let me show you." },
  
  // Transportation services (5 variations)
  'transportation': { path: '/services', response: "Our transportation services can help you get around. Let me show you the details." },
  'drive': { path: '/services', response: "We provide transportation services. Let me take you to that section." },
  'rides': { path: '/services', response: "Our ride services can help you get to appointments. Let me show you." },
  'transportation assistance': { path: '/services', response: "We offer transportation assistance. Let me show you our services." },
  'driving service': { path: '/services', response: "Our driving services are available. Let me show you the options." },
  
  // Shopping services (5 variations)
  'shopping': { path: '/services', response: "We can help with shopping. Let me show you our services." },
  'grocery': { path: '/services', response: "Our caregivers can assist with grocery shopping. Let me show you our services." },
  'grocery shopping': { path: '/services', response: "We offer grocery shopping assistance. Let me show you." },
  'shopping assistance': { path: '/services', response: "Our shopping assistance services are available. Let me show you." },
  'errand running': { path: '/services', response: "We can help with running errands. Let me show you our services." },
  
  // Companionship services (5 variations)
  'companionship': { path: '/services', response: "We offer companionship services. Let me take you to that section." },
  'company': { path: '/services', response: "Our companionship services provide social interaction. Let me show you the details." },
  'social interaction': { path: '/services', response: "We offer social interaction services. Let me show you those options." },
  'companion care': { path: '/services', response: "Our companion care services are available. Let me show you." },
  'friendship': { path: '/services', response: "Our caregivers provide friendship and companionship. Let me show you our services." },
  
  // Personal care services (5 variations)
  'personal care': { path: '/services', response: "We provide personal care services. Let me show you that section." },
  'bathing': { path: '/services', response: "Our personal care services include bathing assistance. Let me take you to services." },
  'grooming': { path: '/services', response: "We offer grooming assistance. Let me show you our services." },
  'toileting': { path: '/services', response: "Our caregivers can assist with toileting. Let me show you our services." },
  'dressing': { path: '/services', response: "We provide dressing assistance. Let me show you our services." },
  
  // Exercise services (5 variations)
  'exercise': { path: '/services', response: "We can help with exercise and physical activity. Let me show you our services." },
  'fitness': { path: '/services', response: "Our caregivers can assist with fitness routines. Taking you to services." },
  'physical activity': { path: '/services', response: "We offer physical activity assistance. Let me show you our services." },
  'mobility': { path: '/services', response: "Our mobility assistance services are available. Let me show you." },
  'exercise help': { path: '/services', response: "We provide exercise assistance. Let me show you our services." }
};

// Assistant control commands
export const assistantCommands: AssistantCommands = {
  // Close/exit commands
  'close': 'Closing the assistant.',
  'close assistant': 'Closing the voice assistant.',
  'exit': 'Exiting the voice assistant.',
  'exit assistant': 'Exiting the assistant.',
  'dismiss': 'Dismissing the assistant.',
  'bye': 'Goodbye! Closing the assistant.',
  'goodbye': 'Goodbye! Closing the assistant.',
  'end conversation': 'Ending our conversation.',
  
  // Help commands
  'help': 'I can help you navigate the site, find information, or book services. Try saying "Go to home page" or "Tell me about meal preparation".',
  'what can you do': 'I can navigate to different pages, provide information about our services, and help you book appointments. Try asking me about specific services or saying "Go to profile".',
  'commands': 'Some commands you can use include "Go to home", "Book a caregiver", "Tell me about services", or "Close assistant".',
  'show commands': 'You can navigate by saying "Go to [page name]", ask about services like "Tell me about cleaning", or control me by saying "Close" or "Stop listening".',
  
  // FAQ commands
  'hours of operation': 'Our caregivers are available 24/7. You can book services at any time through our website.',
  'pricing': 'Our pricing varies based on the type of service and duration. Please visit the services page for detailed pricing information.',
  'insurance': 'We accept most major insurance plans. Please contact us directly for specific information about your insurance coverage.',
  'qualifications': 'All our caregivers are certified professionals with background checks, relevant degrees, and extensive experience in their fields.',
};

// Page-specific context responses
export const pageContextResponses: PageContextResponses = {
  "/": {
    general: [
      "I see you're on the home page. You can ask me to navigate to different sections or tell you more about our services.",
      "Welcome to Guardian Go. From here, you can explore our caregivers, learn about our services, or navigate to other pages.",
      "You're currently on the home page. What would you like to know about our services?"
    ],
    helpText: "Since you're on the home page, you can ask me to show you our caregivers, navigate to services, or help you book a service."
  },
  "/caregivers": {
    general: [
      "I see you're browsing our caregivers. You can ask me for help filtering or selecting a caregiver.",
      "On this page, you can explore our available caregivers. Need help finding someone with specific skills?",
      "You're viewing our caregivers. Let me know if you'd like to filter by specific services or expertise."
    ],
    helpText: "While browsing caregivers, you can ask me to help you find caregivers with specific skills or availability."
  },
  "/services": {
    general: [
      "You're on our services page. I can help explain any of our services in more detail.",
      "This page shows all the services we offer. Need more information about a specific service?",
      "You're viewing our service options. Would you like me to explain any particular service in more detail?"
    ],
    helpText: "On the services page, you can ask about specific services like meal preparation, medication management, or transportation."
  },
  "/how-it-works": {
    general: [
      "You're on our 'How It Works' page. I can help explain our process or answer specific questions.",
      "This page explains how our service works. Do you have any questions about our process?",
      "You're learning about how our service works. Let me know if you need clarification on any step."
    ],
    helpText: "While on this page, you can ask about specific steps in our process or how to get started with our service."
  },
  "/about": {
    general: [
      "You're on our About page. I can tell you more about our company history or values.",
      "This page provides information about our company. Anything specific you'd like to know?",
      "You're learning about our company. Feel free to ask questions about our team or mission."
    ],
    helpText: "On this page, you can ask about our company history, mission, values, or team."
  },
  "/book-service": {
    general: [
      "I see you're booking a service. I can help you complete this process if you have questions.",
      "You're on the booking page. Need help selecting a service or caregiver?",
      "You're setting up a service booking. Let me know if you need assistance with any part of the form."
    ],
    helpText: "While booking a service, you can ask for help with filling out the form, selecting dates, or choosing caregivers."
  },
  "/profile": {
    general: [
      "You're viewing your profile. I can help you update information or manage your preferences.",
      "This is your profile page. Need help updating your details or preferences?",
      "You're on the profile page. I can assist with updating information or managing account settings."
    ],
    helpText: "On your profile page, you can ask for help updating your information, managing preferences, or viewing your service history."
  }
};

// Default context for unknown pages
const defaultPageContext = {
  general: [
    "How can I assist you with navigating the site?",
    "What would you like to know about our services?",
    "I can help you find information or navigate to different sections."
  ],
  helpText: "You can ask me to navigate to different pages or tell you about our services."
};

// Find best match for a command
export const findBestCommandMatch = (userCommand: string): CommandMatch | null => {
  // First check for assistant control commands
  if (assistantCommands[userCommand]) {
    return { 
      type: 'assistant', 
      data: { 
        response: assistantCommands[userCommand],
        path: '' // Add empty path to ensure consistent structure
      } 
    };
  }
  
  // Then check for exact matches in navigation commands
  if (navigationCommands[userCommand]) {
    return { type: 'navigation', data: navigationCommands[userCommand] };
  }
  
  // Check for exact matches in service categories
  if (serviceCategories[userCommand]) {
    return { type: 'service', data: serviceCategories[userCommand] };
  }
  
  // If no exact match, look for partial matches in assistant commands
  for (const [phrase, response] of Object.entries(assistantCommands)) {
    if (userCommand.includes(phrase)) {
      return { 
        type: 'assistant', 
        data: { 
          response,
          path: '' // Add empty path to ensure consistent structure
        } 
      };
    }
  }
  
  // Look for partial matches in navigation commands
  for (const [phrase, data] of Object.entries(navigationCommands)) {
    if (userCommand.includes(phrase)) {
      return { type: 'navigation', data };
    }
  }
  
  // Look for partial matches in service categories
  for (const [category, data] of Object.entries(serviceCategories)) {
    if (userCommand.includes(category)) {
      return { type: 'service', data };
    }
  }
  
  // Look for key words/phrases in the command
  if (/home|main|start|landing/i.test(userCommand)) {
    return { type: 'navigation', data: navigationCommands['go to home'] };
  }
  
  if (/caregiver|care giver|find care|care provider/i.test(userCommand)) {
    return { type: 'navigation', data: navigationCommands['go to caregivers'] };
  }
  
  if (/how|works|process|steps|explain|explanation/i.test(userCommand)) {
    return { type: 'navigation', data: navigationCommands['go to how it works'] };
  }
  
  if (/about|us|company|who|info|information/i.test(userCommand)) {
    return { type: 'navigation', data: navigationCommands['go to about us'] };
  }
  
  if (/book|service|appointment|schedule|reserve|reservation/i.test(userCommand)) {
    return { type: 'navigation', data: navigationCommands['go to book a caregiver'] };
  }
  
  if (/profile|account|my info|settings|my details|user/i.test(userCommand)) {
    return { type: 'navigation', data: navigationCommands['go to profile'] };
  }
  
  if (/services|offerings|help|assistance|options|provide/i.test(userCommand)) {
    return { type: 'navigation', data: navigationCommands['go to services'] };
  }
  
  if (/close|exit|dismiss|shut|bye|goodbye|end/i.test(userCommand)) {
    return { 
      type: 'assistant', 
      data: { 
        response: 'Closing the assistant.',
        path: '' // Add empty path to ensure consistent structure
      } 
    };
  }
  
  // If no match found
  return null;
};

// Get context-aware response based on current page
const getPageContextResponse = (currentPage: string) => {
  const normalizedPage = currentPage.endsWith('/') 
    ? currentPage.slice(0, -1) 
    : currentPage;
  
  const pageContext = pageContextResponses[normalizedPage] || defaultPageContext;
  return pageContext.general[Math.floor(Math.random() * pageContext.general.length)];
};

// Process voice commands
export const processVoiceCommand = async (
  command: string,
  navigate: NavigateFunction,
  addMessageToHistory: (role: string, content: string) => void,
  speakResponseFn: (text: string) => void,
  currentPage: string = '/'
) => {
  let responseText = '';
  let navigationPath = '';
  let navigationDelay = 1000;
  let closeAssistant = false;
  
  const isCurrentPageQuery = /where am i|what page|current page|this page/i.test(command);

  // Handle page-specific queries
  if (isCurrentPageQuery) {
    const pageContext = pageContextResponses[currentPage] || defaultPageContext;
    responseText = pageContext.helpText;
    
    // For specific responses about the current page
    if (currentPage === '/how-it-works') {
      responseText += " Our process is designed to make finding care simple and reliable.";
    } else if (currentPage === '/caregivers') {
      responseText += " All our caregivers are thoroughly vetted and trained.";
    } else if (currentPage === '/services') {
      responseText += " We offer a wide range of services to meet your specific needs.";
    }
  } else {
    // Find the best match for the command using existing logic
    const match = findBestCommandMatch(command);
    
    if (match) {
      if (match.type === 'assistant') {
        responseText = match.data.response;
        
        // Check if this is a close/exit command
        if (/close|exit|dismiss|bye|goodbye|end/i.test(command) || 
            /close|exit|dismiss|bye|goodbye|end/i.test(responseText)) {
          closeAssistant = true;
        }
      } else if (match.type === 'navigation') {
        navigationPath = match.data.path;
        
        // Only add context if not navigating to the current page
        if (navigationPath !== currentPage) {
          responseText = match.data.response;
        } else {
          responseText = `You're already on ${match.data.path === '/' ? 'the home page' : 'this page'}. ${getPageContextResponse(currentPage)}`;
          navigationPath = ''; // Don't navigate if already on the page
        }
      } else if (match.type === 'service') {
        navigationPath = match.data.path;
        responseText = match.data.response;
      }
    } else {
      // Handle search-like queries with context awareness
      if (command.includes('search') || command.includes('find') || command.includes('looking for')) {
        // Extract what they're searching for
        let searchTerm = command.replace(/search for|search|find|looking for|i need|i want/gi, '').trim();
        
        if (searchTerm) {
          responseText = `I'll help you find information about "${searchTerm}". Let me take you to our services page where you can explore options.`;
          navigationPath = '/services';
        } else {
          responseText = "What would you like me to search for? You can say things like 'find cooking help' or 'search for medication assistance'.";
        }
      } else {
        // Conversational fallback responses with context awareness
        if (command.includes('hello') || command.includes('hi') || command.includes('hey')) {
          responseText = "Hello! " + getPageContextResponse(currentPage);
        } 
        else if (command.includes('thank')) {
          responseText = "You're welcome! Is there anything else I can help you with?";
        }
        else if (command.includes('bye') || command.includes('goodbye')) {
          responseText = "Goodbye! Feel free to ask for help anytime.";
          closeAssistant = true;
        }
        else if (command.includes('help') || command.includes('assist')) {
          const pageContext = pageContextResponses[currentPage] || defaultPageContext;
          responseText = pageContext.helpText;
        }
        else if (command.includes('what can you do') || command.includes('your capabilities')) {
          responseText = "I can help you navigate the app, find information about our services, assist with booking a caregiver, and answer questions. " + getPageContextResponse(currentPage);
        }
        else {
          // Add context to the default fallback response
          responseText = "I'm not sure I understood that. " + getPageContextResponse(currentPage);
        }
      }
    }
  }
  
  // Add assistant response to conversation history
  addMessageToHistory('assistant', responseText);
  
  // Speak the response
  speakResponseFn(responseText);
  
  // Navigate if a path was set
  if (navigationPath) {
    setTimeout(() => navigate(navigationPath), navigationDelay);
  }
  
  // Handle closing the assistant
  if (closeAssistant) {
    // We'll pass this back to the VoiceAssistant component via callback
    // The actual closing will happen in the component
    setTimeout(() => {
      // This will be handled by whoever calls processVoiceCommand
      document.dispatchEvent(new CustomEvent('closeVoiceAssistant'));
    }, 1500);  // Give time for the response to be spoken
  }
  
  return responseText;
};
