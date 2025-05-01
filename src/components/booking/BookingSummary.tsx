
import React, { useState } from 'react';
import { CheckCircle, Calendar, Clock, MapPin, Edit, Info } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { toast } from '@/components/ui/use-toast';

interface BookingSummaryProps {
  serviceTitle: string | undefined;
  selectedDate: string;
  selectedTime: string;
  durationLabel: string | undefined;
  selectedCaregiverName: string | undefined;
  address: string;
  setAddress: (address: string) => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  serviceTitle,
  selectedDate,
  selectedTime,
  durationLabel,
  selectedCaregiverName,
  address,
  setAddress
}) => {
  const [isAddressEditing, setIsAddressEditing] = useState(false);
  
  const handleAddressUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddressEditing(false);
    toast({
      title: "Address Updated",
      description: "Your service address has been updated successfully.",
    });
  };

  return (
    <AnimatedCard className="mb-6">
      <h3 className="text-lg font-medium mb-4">Booking Summary</h3>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="w-6 h-6 mt-0.5 rounded-full bg-guardian-100 flex items-center justify-center mr-3">
            <CheckCircle size={14} className="text-guardian-600" />
          </div>
          <div>
            <p className="font-medium">Service Type</p>
            <p className="text-muted-foreground">
              {serviceTitle || 'Not selected'}
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="w-6 h-6 mt-0.5 rounded-full bg-guardian-100 flex items-center justify-center mr-3">
            <Calendar size={14} className="text-guardian-600" />
          </div>
          <div>
            <p className="font-medium">Date & Time</p>
            <p className="text-muted-foreground">
              {selectedDate || 'Not selected'} at {selectedTime || 'Not selected'}
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="w-6 h-6 mt-0.5 rounded-full bg-guardian-100 flex items-center justify-center mr-3">
            <Clock size={14} className="text-guardian-600" />
          </div>
          <div>
            <p className="font-medium">Duration</p>
            <p className="text-muted-foreground">
              {durationLabel || 'Not selected'}
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="w-6 h-6 mt-0.5 rounded-full bg-guardian-100 flex items-center justify-center mr-3">
            <MapPin size={14} className="text-guardian-600" />
          </div>
          <div className="flex-grow">
            <p className="font-medium">Location</p>
            {isAddressEditing ? (
              <form onSubmit={handleAddressUpdate} className="mt-1">
                <div className="flex">
                  <input 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    className="flex-grow border border-input rounded-l-md px-3 py-1 text-sm"
                  />
                  <button 
                    type="submit" 
                    className="bg-guardian-500 text-white rounded-r-md px-3 py-1 text-sm"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="text-muted-foreground">{address}</p>
                <button 
                  className="text-sm text-guardian-600 font-medium mt-1 flex items-center"
                  onClick={() => setIsAddressEditing(true)}
                >
                  <Edit size={14} className="mr-1" /> 
                  Change address
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="w-6 h-6 mt-0.5 rounded-full bg-guardian-100 flex items-center justify-center mr-3">
            <svg className="w-3.5 h-3.5 text-guardian-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Caregiver</p>
            <p className="text-muted-foreground">
              {selectedCaregiverName || 'Not selected'}
            </p>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default BookingSummary;
