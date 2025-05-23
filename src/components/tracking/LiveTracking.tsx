import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Navigation, ChevronDown, ChevronUp, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from '@/hooks/use-toast';
import { useFavoriteCaregivers } from '@/hooks/useFavoriteCaregivers';
import LiveTrackingMap from './LiveTrackingMap';
import { useNavigate } from 'react-router-dom';

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
    id: '1',
    name: 'Priya Sharma',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    location: { lat: 12.9716, lng: 77.5946 }, // Bangalore
    eta: 15,
    status: 'en-route' as const
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    location: { lat: 12.9799, lng: 77.5903 }, // Near Bangalore
    eta: 8,
    status: 'en-route' as const
  },
  {
    id: '3',
    name: 'Ananya Patel',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    location: { lat: 12.9689, lng: 77.6093 }, // Also near Bangalore
    eta: 22,
    status: 'en-route' as const
  }
];

const LiveTracking = () => {
  const navigate = useNavigate();
  
  // Get bookings from localStorage
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const latestBooking = bookings.length > 0 ? bookings[bookings.length - 1] : null;
  
  // Get caregiver ID from booking or localStorage
  const selectedCaregiverId = latestBooking?.caregiverId?.toString() || localStorage.getItem('selectedCaregiverId') || '1';
  
  const { favorites, toggleFavorite } = useFavoriteCaregivers();
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  const [progress, setProgress] = useState(0);
  const [isMapOpen, setIsMapOpen] = useState(true);
  const [serviceDetails, setServiceDetails] = useState({
    address: latestBooking?.address || '123 Main Street, Bangalore',
    dateTime: latestBooking ? `${latestBooking.date}, ${latestBooking.time}` : 'Today, 3:00 PM',
    duration: latestBooking?.duration || '2 hours',
    payment: latestBooking?.paymentMethod === 'upi' ? 'UPI Payment' : 
             latestBooking?.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on delivery',
    service: latestBooking?.service || 'Personal Care',
    price: latestBooking?.totalPrice || '₹1,849'
  });
  
  // Track if the review page has been navigated to
  const [navigatedToReview, setNavigatedToReview] = useState(false);
  
  // Simulate caregiver location updates
  useEffect(() => {
    // In a real app, this would use a WebSocket or polling to get real-time updates
    const selectedCaregiverObj = mockCaregivers.find(cg => cg.id === selectedCaregiverId);
    
    if (selectedCaregiverObj) {
      setCaregiver({
        ...selectedCaregiverObj,
        id: selectedCaregiverId
      });
      
      // Store caregiver info for notifications
      localStorage.setItem('activeCaregiverName', selectedCaregiverObj.name);
      localStorage.setItem('activeCaregiverStatus', selectedCaregiverObj.status);
      localStorage.setItem('activeCaregiverETA', selectedCaregiverObj.eta.toString());
    } else if (selectedCaregiverId === '0') {
      // "Best match" was selected, assign a random caregiver
      const randomIndex = Math.floor(Math.random() * mockCaregivers.length);
      const randomCaregiver = mockCaregivers[randomIndex];
      setCaregiver({
        ...randomCaregiver,
        name: `${randomCaregiver.name} (Best Match)`,
      });
      
      // Store caregiver info for notifications
      localStorage.setItem('activeCaregiverName', `${randomCaregiver.name} (Best Match)`);
      localStorage.setItem('activeCaregiverStatus', randomCaregiver.status);
      localStorage.setItem('activeCaregiverETA', randomCaregiver.eta.toString());
    } else {
      // Fallback
      setCaregiver(mockCaregivers[0]);
      
      // Store caregiver info for notifications
      localStorage.setItem('activeCaregiverName', mockCaregivers[0].name);
      localStorage.setItem('activeCaregiverStatus', mockCaregivers[0].status);
      localStorage.setItem('activeCaregiverETA', mockCaregivers[0].eta.toString());
    }
    
    // Show a notification when caregiver is assigned
    if (!localStorage.getItem('notified_assignment_' + selectedCaregiverId)) {
      setTimeout(() => {
        const caregiverName = localStorage.getItem('activeCaregiverName') || 'Your caregiver';
        toast({
          title: "Caregiver Assigned",
          description: `${caregiverName} has been assigned to your service`,
        });
        localStorage.setItem('notified_assignment_' + selectedCaregiverId, 'true');
      }, 1000);
    }
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Update caregiver status when they arrive
          setCaregiver(c => {
            if (c) {
              const updatedCaregiver = {...c, status: 'arrived' as const, eta: 0};
              
              // Update stored status
              localStorage.setItem('activeCaregiverStatus', 'arrived');
              localStorage.setItem('activeCaregiverETA', '0');
              
              return updatedCaregiver;
            }
            return null;
          });
          
          // Show arrival notification
          if (!localStorage.getItem('notified_arrival_' + selectedCaregiverId)) {
            const caregiverName = localStorage.getItem('activeCaregiverName') || 'Your caregiver';
            toast({
              title: "Caregiver has arrived!",
              description: `${caregiverName} has arrived at your location.`,
            });
            localStorage.setItem('notified_arrival_' + selectedCaregiverId, 'true');
            
            // Navigate to review page after 3 seconds
            if (!navigatedToReview) {
              setTimeout(() => {
                setNavigatedToReview(true);
                navigate(`/caregiver/${selectedCaregiverId}/review`);
              }, 3000);
            }
          }
          
          return 100;
        }
        
        // Update ETA as progress increases
        if (caregiver && prev % 20 === 0) {
          const newEta = Math.max(0, caregiver.eta - 5);
          setCaregiver(c => c ? {...c, eta: newEta} : null);
          localStorage.setItem('activeCaregiverETA', newEta.toString());
          
          // Show ETA update notification
          if (newEta > 0 && !localStorage.getItem(`notified_eta_${selectedCaregiverId}_${newEta}`)) {
            const caregiverName = localStorage.getItem('activeCaregiverName') || 'Your caregiver';
            toast({
              title: "ETA Updated",
              description: `${caregiverName} will arrive in approximately ${newEta} minutes`,
            });
            localStorage.setItem(`notified_eta_${selectedCaregiverId}_${newEta}`, 'true');
          }
        }
        
        return prev + 5;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedCaregiverId, navigate, navigatedToReview]);
  
  const contactCaregiver = (method: 'call' | 'message') => {
    if (!caregiver) return;
    
    if (method === 'call') {
      toast({
        title: "Calling Caregiver",
        description: `Connecting you with ${caregiver.name}...`,
      });
    } else {
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${caregiver.name}. They will respond shortly.`,
      });
    }
  };
  
  const handleFavoriteToggle = () => {
    if (!caregiver) return;
    toggleFavorite(caregiver.id);
  };

  const handleReviewClick = () => {
    if (caregiver) {
      navigate(`/caregiver/${caregiver.id}/review`);
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
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 rounded-full"
            onClick={handleFavoriteToggle}
          >
            <svg 
              className="w-4 h-4" 
              fill={favorites.includes(caregiver.id) ? "currentColor" : "none"} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
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
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex w-full justify-between p-4 h-auto border rounded-lg">
                  <span>{isMapOpen ? 'Hide Map' : 'View Map'}</span>
                  {isMapOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2">
                  {isMapOpen && (
                    <LiveTrackingMap
                      caregiverPosition={{ 
                        lng: caregiver.location.lng, 
                        lat: caregiver.location.lat 
                      }}
                      destination={{ 
                        lng: caregiver.location.lng + 0.01, 
                        lat: caregiver.location.lat + 0.01 
                      }}
                    />
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </>
        )}
        
        {caregiver.status === 'arrived' && (
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-green-700 font-medium">Your caregiver has arrived!</p>
            <Button
              onClick={handleReviewClick}
              className="mt-3 bg-green-600 hover:bg-green-700"
            >
              Leave a Review
            </Button>
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
              <MapPin size={16} className="mr-2 text-muted-foreground flex-shrink-0" />
              <span>{serviceDetails.address}</span>
            </div>
            <div className="flex">
              <Clock size={16} className="mr-2 text-muted-foreground flex-shrink-0" />
              <span>{serviceDetails.dateTime} ({serviceDetails.duration})</span>
            </div>
            <div className="mt-4">
              <p className="font-medium">Service</p>
              <p className="text-sm text-muted-foreground">{serviceDetails.service}</p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="font-medium">Payment Method</p>
                <p className="text-sm text-muted-foreground">{serviceDetails.payment}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Total</p>
                <p className="text-sm">{serviceDetails.price}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LiveTracking;
