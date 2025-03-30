
import { NavigateFunction } from 'react-router-dom';

// Define the command types
type CommandData = {
  path: string;
  response: string;
};

// Define commands interfaces
export interface NavigationCommands {
  [key: string]: CommandData;
}

export interface ServiceCategories {
  [key: string]: CommandData;
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

// Find best match for a command
export const findBestCommandMatch = (userCommand: string) => {
  // First check for exact matches in navigation commands
  if (navigationCommands[userCommand]) {
    return { type: 'navigation', data: navigationCommands[userCommand] };
  }
  
  // Check for exact matches in service categories
  if (serviceCategories[userCommand]) {
    return { type: 'service', data: serviceCategories[userCommand] };
  }
  
  // If no exact match, look for partial matches in navigation commands
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
  
  // If no match found
  return null;
};

// Process voice commands
export const processVoiceCommand = async (
  command: string,
  navigate: NavigateFunction,
  addMessageToHistory: (role: string, content: string) => void,
  speakResponseFn: (text: string) => void
) => {
  let responseText = '';
  let navigationPath = '';
  let navigationDelay = 1000;

  // Find the best match for the command
  const match = findBestCommandMatch(command);
  
  if (match) {
    navigationPath = match.data.path;
    responseText = match.data.response;
  } else {
    // Handle search-like queries
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
      // Conversational fallback responses
      if (command.includes('hello') || command.includes('hi') || command.includes('hey')) {
        responseText = "Hello! I'm your Guardian Go assistant. How can I help you today? You can ask me to navigate to different pages like 'go to home page' or 'show caregivers'.";
      } 
      else if (command.includes('thank')) {
        responseText = "You're welcome! Is there anything else I can help you with?";
      }
      else if (command.includes('bye') || command.includes('goodbye')) {
        responseText = "Goodbye! Feel free to ask for help anytime.";
      }
      else if (command.includes('help') || command.includes('assist')) {
        responseText = "I can help you navigate the app. Try saying 'go to home page', 'show caregivers', or ask about specific services like 'tell me about meal preparation'.";
      }
      else if (command.includes('what can you do') || command.includes('your capabilities')) {
        responseText = "I can help you navigate the app, find information about our services, assist with booking a caregiver, and answer questions about how our service works.";
      }
      else {
        responseText = "I'm not sure I understood that. You can try saying 'go to home page', 'go to caregivers page', 'go to how it works page', 'go to about us page', or 'go to book a caregiver page'.";
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
  
  return responseText;
};
