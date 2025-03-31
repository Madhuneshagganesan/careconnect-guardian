
import React, { useState } from 'react';
import { AlertTriangle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

const SOSButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  
  const emergencyContact = user?.emergencyContact || "911"; // Default to 911 if no emergency contact
  
  const handleEmergencyCall = () => {
    toast({
      title: "Emergency Call Initiated",
      description: `Calling emergency services and contacting ${emergencyContact}...`,
      variant: "destructive",
    });
    
    // In a real app, this would trigger an actual emergency protocol
    setTimeout(() => {
      toast({
        title: "Help is on the way",
        description: "Emergency services have been notified of your location.",
      });
    }, 3000);
    
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)} 
        className="fixed bottom-6 left-6 rounded-full shadow-lg w-14 h-14 z-50 bg-red-600 hover:bg-red-700 animate-pulse"
        size="icon"
        variant="destructive"
      >
        <AlertTriangle size={24} className="text-white" />
      </Button>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Emergency Assistance
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This will alert emergency services and your emergency contact. 
              Are you sure you want to proceed with this emergency call?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleEmergencyCall}
            >
              <Phone className="mr-2 h-4 w-4" />
              Call Emergency Services
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SOSButton;
