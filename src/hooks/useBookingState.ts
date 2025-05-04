import { useState, useEffect } from 'react';

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
}

export interface Caregiver {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  imageUrl: string;
}

export interface Duration {
  id: string;
  label: string;
  hours: number;
  price: number;
}

const useBookingState = () => {
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form state
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' }));
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<number | null>(null);
  const [address, setAddress] = useState('123 Main Street, Bangalore');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Payment details
  const [servicePrice, setServicePrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [upiId, setUpiId] = useState('');
  
  // Data definitions
  const services: Service[] = [
    {
      id: 'meal-preparation',
      title: 'Meal Preparation',
      description: 'Assistance with cooking and preparing nutritious meals',
      price: 300
    },
    {
      id: 'personal-care',
      title: 'Personal Care',
      description: 'Help with bathing, dressing, and personal hygiene',
      price: 350
    },
    {
      id: 'medical-assistance',
      title: 'Medical Assistance',
      description: 'Medication reminders and basic medical support',
      price: 400
    },
    {
      id: 'household-help',
      title: 'Household Help',
      description: 'Light housekeeping, laundry, and organization',
      price: 280
    },
    {
      id: 'errands',
      title: 'Errands & Shopping',
      description: 'Grocery shopping, prescription pickups, and more',
      price: 320
    },
    {
      id: 'companionship',
      title: 'Companionship',
      description: 'Social engagement, conversation, and activities',
      price: 250
    },
    {
      id: 'full-day-help',
      title: 'Full Day Help',
      description: 'Comprehensive assistance for the entire day, including all basic services',
      price: 450
    }
  ];
  
  const durations: Duration[] = [
    { id: '1hour', label: '1 hour', hours: 1, price: 0 },
    { id: '2hours', label: '2 hours', hours: 2, price: 600 },
    { id: '4hours', label: '4 hours (Half day)', hours: 4, price: 1200 },
    { id: '8hours', label: '8 hours (Full day)', hours: 8, price: 2400 }
  ];
  
  const caregivers: Caregiver[] = [
    {
      id: 1,
      name: 'Priya Sharma',
      specialty: 'Elder Care Specialist',
      rating: 4.9,
      reviews: 156,
      imageUrl: ''
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      specialty: 'Physiotherapy Assistant',
      rating: 4.8,
      reviews: 124,
      imageUrl: ''
    },
    {
      id: 3,
      name: 'Ananya Patel',
      specialty: 'Personal Care Aide',
      rating: 4.9,
      reviews: 212,
      imageUrl: ''
    }
  ];
  
  // Get selected objects based on IDs
  const selectedServiceObj = services.find(s => s.id === selectedService);
  const selectedDurationObj = durations.find(d => d.id === selectedDuration);
  const selectedCaregiverObj = selectedCaregiverId === 0 ? 
    { name: "Best available match", id: 0 } : 
    caregivers.find(c => c.id === selectedCaregiverId);
  
  // Calculate total price whenever service or duration changes
  useEffect(() => {
    if (!selectedService || !selectedDuration) {
      setTotalPrice(0);
      return;
    }
    
    const basePrice = selectedServiceObj?.price || 0;
    setServicePrice(basePrice);
    const durationPrice = selectedDurationObj?.price || 0;
    const convenienceFee = 99;
    setTotalPrice(basePrice + durationPrice + convenienceFee);
  }, [selectedService, selectedDuration, selectedServiceObj, selectedDurationObj]);
  
  // Navigation functions
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  return {
    // Step state
    currentStep,
    setCurrentStep,
    handleNext,
    handleBack,
    
    // Form state
    selectedService,
    setSelectedService,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedDuration,
    setSelectedDuration,
    selectedCaregiverId,
    setSelectedCaregiverId,
    address,
    setAddress,
    isSubmitting,
    setIsSubmitting,
    
    // Payment details
    servicePrice,
    totalPrice,
    paymentMethod,
    setPaymentMethod,
    upiId,
    setUpiId,
    
    // Data
    services,
    durations,
    caregivers,
    
    // Derived data
    selectedServiceObj,
    selectedDurationObj,
    selectedCaregiverObj,
    
    // Form validation
    isServiceStepValid: !!selectedService,
    isScheduleStepValid: !!selectedDate && !!selectedTime && !!selectedDuration,
    isCaregiverStepValid: selectedCaregiverId !== null,
    isPaymentStepValid: paymentMethod !== 'upi' || !!upiId
  };
};

export default useBookingState;
