
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Navigation, ChevronDown, ChevronUp, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from '@/components/ui/use-toast';

interface Caregiver {
  id: string;
  name: string;
  avatar: string;
  location: {
    lat: number;
    lng: number;
  };
  eta: number; // minutes
  status: 'assigned' | 'en-route' | 'arrived' | 'in-service' | 'completed';
}

// Mock data for caregivers
const mockCaregivers = [
  {
    id: 'cg-123',
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    location: { lat: 37.7749, lng: -122.4194 },
    eta: 15,
    status: 'en-route' as const
  },
  {
    id: 'cg-124',
    name: 'Michael Rodriguez',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    location: { lat: 37.7833, lng: -122.4167 },
    eta: 8,
    status: 'en-route' as const
  },
  {
    id: 'cg-125',
    name: 'Emily Chen',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    location: { lat: 37.7951, lng: -122.4048 },
    eta: 22,
    status: 'en-route' as const
  }
];

const LiveTracking = () => {
  // Get caregiver ID from session or URL parameter in a real app
  const caregiverIdRef = useRef<string>(localStorage.getItem('selectedCaregiverId') || 'cg-124');
  
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  const [progress, setProgress] = useState(0);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  
  // Simulate caregiver location updates
  useEffect(() => {
    // In a real app, this would use a WebSocket or polling to get real-time updates
    const selectedCaregiver = mockCaregivers.find(cg => cg.id === caregiverIdRef.current) || mockCaregivers[0];
    
    setCaregiver(selectedCaregiver as Caregiver);
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Update caregiver status when they arrive
          setCaregiver(c => c ? {...c, status: 'arrived' as const, eta: 0} : null);
          return 100;
        }
        return prev + 5;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Initialize map when map container is visible
  useEffect(() => {
    if (isMapOpen && mapRef.current && caregiver && !mapInstanceRef.current) {
      // Simulate map initialization
      // In a real app, this would use a map library like Google Maps, Mapbox, etc.
      const mockMapInit = () => {
        const mapDiv = mapRef.current;
        if (!mapDiv) return;
        
        // Create a mock map for demonstration purposes
        const mapHTML = `
          <div class="relative w-full h-full">
            <div class="absolute inset-0 flex items-center justify-center bg-guardian-50 rounded-lg">
              <div class="text-center">
                <div class="w-10 h-10 bg-guardian-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
                  <MapPin size={20} />
                </div>
                <p class="font-medium text-guardian-700">Caregiver Location</p>
                <p class="text-sm text-guardian-600">Lat: ${caregiver.location.lat.toFixed(4)}, Lng: ${caregiver.location.lng.toFixed(4)}</p>
                <div class="mt-4 text-center">
                  <p class="text-sm text-muted-foreground">This is a mock map for demonstration</p>
                  <p class="text-sm text-muted-foreground">In a real app, this would show a real map with live tracking</p>
                </div>
              </div>
            </div>
            <div class="absolute bottom-4 right-4 z-10">
              <div class="bg-white p-2 rounded-lg shadow-md">
                <Button variant="outline" size="sm" class="h-8 w-8 p-0" title="Zoom In">+</Button>
                <Button variant="outline" size="sm" class="h-8 w-8 p-0 mt-1" title="Zoom Out">-</Button>
              </div>
            </div>
          </div>
        `;
        
        mapDiv.innerHTML = mapHTML;
        mapInstanceRef.current = true;
      };
      
      mockMapInit();
    }
  }, [isMapOpen, caregiver]);
  
  const contactCaregiver = (method: 'call' | 'message') => {
    if (method === 'call') {
      toast({
        title: `Calling ${caregiver?.name}`,
        description: `Connecting to ${caregiver?.name}...`,
      });
    } else {
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${caregiver?.name}.`,
      });
    }
  };
  
  if (!caregiver) {
    return (
      <Card className="p-6 shadow-md w-full max-w-md mx-auto">
        <div className="text-center py-8">
          <p className="text-lg font-medium">No active service right now</p>
          <Button className="mt-4" asChild>
            <a href="/book-service">Book a Service</a>
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6 shadow-md w-full max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <img 
          src={caregiver.avatar} 
          alt={caregiver.name}
          className="w-16 h-16 rounded-full border-2 border-primary" 
        />
        <div>
          <h3 className="font-medium text-lg">{caregiver.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
              caregiver.status === 'en-route' ? 'bg-amber-500' : 
              caregiver.status === 'arrived' ? 'bg-green-500' : 
              caregiver.status === 'in-service' ? 'bg-blue-500' : 'bg-gray-500'
            }`}></span>
            <span className="capitalize">{caregiver.status.replace('-', ' ')}</span>
          </div>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 rounded-full" 
            onClick={() => contactCaregiver('call')}
          >
            <Phone size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 rounded-full"
            onClick={() => contactCaregiver('message')}
          >
            <MessageSquare size={18} />
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {caregiver.status === 'en-route' && (
          <>
            <div className="bg-muted p-4 rounded-lg flex items-center space-x-3">
              <Clock className="text-muted-foreground" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Estimated arrival in</p>
                <p className="font-medium">{caregiver.eta} minutes</p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Caregiver location</span>
                <span>Your location</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-1">
                <div className="flex items-center">
                  <Navigation size={16} className="text-primary mr-1" />
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="text-primary mr-1" />
                </div>
              </div>
            </div>
            
            <Collapsible
              open={isMapOpen}
              onOpenChange={setIsMapOpen}
              className="w-full border rounded-lg overflow-hidden"
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex w-full justify-between p-4 h-auto">
                  <span>View Map</span>
                  {isMapOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div ref={mapRef} className="h-[250px] w-full" />
              </CollapsibleContent>
            </Collapsible>
          </>
        )}
        
        {caregiver.status === 'arrived' && (
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-green-700 font-medium">Your caregiver has arrived!</p>
          </div>
        )}
        
        {caregiver.status === 'in-service' && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-700 font-medium">Service in progress</p>
            <p className="text-sm text-blue-600 mt-1">Started at 2:30 PM</p>
          </div>
        )}
        
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Service Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex">
              <MapPin size={16} className="mr-2 text-muted-foreground" />
              <span>123 Main Street, San Francisco, CA</span>
            </div>
            <div className="flex">
              <Clock size={16} className="mr-2 text-muted-foreground" />
              <span>Today, 3:00 PM - 5:00 PM</span>
            </div>
            <div className="mt-4">
              <p className="font-medium">Payment Method</p>
              <p className="text-sm text-muted-foreground">Cash on delivery</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LiveTracking;
