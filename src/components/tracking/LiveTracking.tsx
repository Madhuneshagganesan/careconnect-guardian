
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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

const LiveTracking = () => {
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  const [progress, setProgress] = useState(0);
  
  // Simulate caregiver location updates
  useEffect(() => {
    // In a real app, this would use a WebSocket or polling to get real-time updates
    const mockCaregiver: Caregiver = {
      id: 'cg-123',
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      location: {
        lat: 37.7749,
        lng: -122.4194
      },
      eta: 15,
      status: 'en-route'
    };
    
    setCaregiver(mockCaregiver);
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Update caregiver status when they arrive
          setCaregiver(c => c ? {...c, status: 'arrived', eta: 0} : null);
          return 100;
        }
        return prev + 5;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
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
        <Button variant="outline" size="sm" className="ml-auto">
          Contact
        </Button>
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
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LiveTracking;
