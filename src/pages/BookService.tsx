import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { 
  CheckCircle, Calendar, Clock, MapPin, Info, 
  ArrowRight, ArrowLeft, Edit, AlertCircle, CreditCard, Smartphone
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { format, addDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

const BookService = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'EEE, dd MMM'));
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<number | null>(null);
  const [isAddressEditing, setIsAddressEditing] = useState(false);
  const [address, setAddress] = useState('123 Main Street, Bangalore');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [servicePrice, setServicePrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [upiId, setUpiId] = useState('');
  
  // Get today's date and the next 6 days
  const generateDates = () => {
    const today = new Date();
    const dates = [];
    
    for(let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      let label = '';
      
      if (i === 0) label = 'Today';
      else if (i === 1) label = 'Tomorrow';
      else label = format(date, 'EEE, dd MMM');
      
      dates.push({
        value: format(date, 'yyyy-MM-dd'),
        label: label,
        date: date
      });
    }
    
    return dates;
  };
  
  const dates = generateDates();
  
  const services = [
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
    }
  ];
  
  const durations = [
    { id: '1hour', label: '1 hour', hours: 1, price: 0 },
    { id: '2hours', label: '2 hours', hours: 2, price: 600 },
    { id: '4hours', label: '4 hours (Half day)', hours: 4, price: 1200 },
    { id: '8hours', label: '8 hours (Full day)', hours: 8, price: 2400 }
  ];
  
  // Generate time slots from 9 AM to 5 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const isPM = hour >= 12;
      const displayHour = hour > 12 ? hour - 12 : hour;
      const time = `${displayHour}:00 ${isPM ? 'PM' : 'AM'}`;
      slots.push(time);
    }
    return slots;
  };
  
  const times = generateTimeSlots();
  
  const caregivers = [
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

  // Calculate total price whenever service or duration changes
  useEffect(() => {
    if (!selectedService || !selectedDuration) {
      setTotalPrice(0);
      return;
    }
    
    const selectedServiceObj = services.find(s => s.id === selectedService);
    const selectedDurationObj = durations.find(d => d.id === selectedDuration);
    
    if (selectedServiceObj && selectedDurationObj) {
      const basePrice = selectedServiceObj.price;
      setServicePrice(basePrice);
      const durationPrice = selectedDurationObj.price;
      const convenienceFee = 99;
      setTotalPrice(basePrice + durationPrice + convenienceFee);
    }
  }, [selectedService, selectedDuration]);
  
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

  const handleAddressUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddressEditing(false);
    toast({
      title: "Address Updated",
      description: "Your service address has been updated successfully.",
    });
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    
    const selectedServiceObj = services.find(s => s.id === selectedService);
    const selectedDurationObj = durations.find(d => d.id === selectedDuration);
    const selectedCaregiverObj = selectedCaregiverId === 0 ? 
      { name: "Best available match" } : 
      caregivers.find(c => c.id === selectedCaregiverId);
    
    try {
      // In a real app, you would store this to Supabase or another backend
      // For now, we'll just store in localStorage to simulate it
      const bookingData = {
        id: Date.now().toString(),
        service: selectedServiceObj?.title || 'Unknown service',
        date: selectedDate,
        time: selectedTime,
        duration: selectedDurationObj?.label || 'Unknown duration',
        caregiver: selectedCaregiverObj?.name || 'Unknown caregiver',
        caregiverId: selectedCaregiverId,
        address: address,
        totalPrice: totalPrice,
        paymentMethod: paymentMethod,
        upiId: paymentMethod === 'upi' ? upiId : '',
        status: 'booked'
      };
      
      // Store the booking data in localStorage
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      localStorage.setItem('bookings', JSON.stringify([...existingBookings, bookingData]));
      
      // Store the selected caregiver for tracking
      localStorage.setItem('selectedCaregiverId', selectedCaregiverId?.toString() || '');
      
      toast({
        title: "Booking Confirmed!",
        description: `Your ${selectedServiceObj?.title} service has been booked successfully with ${selectedCaregiverObj?.name} for ${selectedDate} at ${selectedTime}.`,
      });
      
      // Redirect to profile page after booking
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      console.error("Error saving booking:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveForLater = () => {
    const selectedServiceObj = services.find(s => s.id === selectedService);
    
    toast({
      title: "Booking Saved",
      description: `Your ${selectedServiceObj?.title} booking has been saved for later. You can access it from your profile.`,
    });
    
    navigate('/profile');
  };
  
  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedService === service.id
                      ? 'border-guardian-500 bg-guardian-50'
                      : 'border-border hover:border-guardian-200 hover:bg-guardian-50/50'
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{service.title}</h3>
                    {selectedService === service.id && (
                      <CheckCircle size={18} className="text-guardian-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                  <p className="text-sm font-medium">₹{service.price}/hour</p>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Schedule Your Service</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Select a Date</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
                {dates.map((date, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                      selectedDate === date.label
                        ? 'border-guardian-500 bg-guardian-50 text-guardian-700'
                        : 'border-border hover:border-guardian-200'
                    }`}
                    onClick={() => setSelectedDate(date.label)}
                  >
                    <p className={`text-sm ${selectedDate === date.label ? 'font-medium' : ''}`}>{date.label}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Select a Time</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {times.map((time) => (
                  <div
                    key={time}
                    className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                      selectedTime === time
                        ? 'border-guardian-500 bg-guardian-50 text-guardian-700'
                        : 'border-border hover:border-guardian-200'
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    <p className={`text-sm ${selectedTime === time ? 'font-medium' : ''}`}>{time}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Duration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {durations.map((duration) => (
                  <div
                    key={duration.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedDuration === duration.id
                        ? 'border-guardian-500 bg-guardian-50 text-guardian-700'
                        : 'border-border hover:border-guardian-200'
                    }`}
                    onClick={() => setSelectedDuration(duration.id)}
                  >
                    <div className="flex justify-between">
                      <p className={`text-sm ${selectedDuration === duration.id ? 'font-medium' : ''}`}>
                        {duration.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {duration.price > 0 ? `+₹${duration.price}` : '+₹0'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Choose a Caregiver</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {caregivers.map((caregiver) => (
                <div
                  key={caregiver.id}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedCaregiverId === caregiver.id
                      ? 'border-guardian-500 bg-guardian-50'
                      : 'border-border hover:border-guardian-200 hover:bg-guardian-50/50'
                  }`}
                  onClick={() => setSelectedCaregiverId(caregiver.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-guardian-100 rounded-full flex items-center justify-center">
                      <span className="text-guardian-400">Photo</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{caregiver.name}</h3>
                      <p className="text-sm text-muted-foreground">{caregiver.specialty}</p>
                    </div>
                    {selectedCaregiverId === caregiver.id && (
                      <CheckCircle size={18} className="text-guardian-500 ml-auto" />
                    )}
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium text-sm">{caregiver.rating}</span>
                      <span className="text-xs text-muted-foreground ml-1">({caregiver.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="text-sm text-guardian-600 font-medium">
                    View full profile
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center p-3 bg-guardian-50 rounded-lg mb-4">
              <Info size={18} className="text-guardian-500 mr-3" />
              <p className="text-sm">
                Not sure which caregiver to choose? Select "Assign Best Match" and we'll find the best available caregiver for your needs.
              </p>
            </div>
            
            <div 
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                selectedCaregiverId === 0
                  ? 'border-guardian-500 bg-guardian-50'
                  : 'border-border hover:border-guardian-200 hover:bg-guardian-50/50'
              }`}
              onClick={() => setSelectedCaregiverId(0)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-guardian-500/10 rounded-full flex items-center justify-center text-guardian-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Assign Best Match</h3>
                    <p className="text-sm text-muted-foreground">Let us find the best caregiver for you</p>
                  </div>
                </div>
                {selectedCaregiverId === 0 && (
                  <CheckCircle size={18} className="text-guardian-500" />
                )}
              </div>
            </div>
          </div>
        );
      
      case 4:
        const selectedServiceObj = services.find(s => s.id === selectedService);
        const selectedDurationObj = durations.find(d => d.id === selectedDuration);
        const selectedCaregiverObj = selectedCaregiverId === 0 
          ? { name: "Best available match" } 
          : caregivers.find(c => c.id === selectedCaregiverId);
          
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Review & Confirm</h2>
            
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
                      {selectedServiceObj?.title || 'Not selected'}
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
                      {selectedDurationObj?.label || 'Not selected'}
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
                      {selectedCaregiverObj?.name || 'Not selected'}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedCard>
            
            <AnimatedCard className="mb-6">
              <h3 className="text-lg font-medium mb-4">Payment Details</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Service fee</p>
                  <p>₹{servicePrice}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Duration ({selectedDurationObj?.label})</p>
                  <p>₹{selectedDurationObj?.price || 0}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Convenience fee</p>
                  <p>₹99</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-4">
                <h4 className="font-medium">Payment Method</h4>
                <div 
                  className={`border rounded-lg p-3 flex items-center mb-2 cursor-pointer ${
                    paymentMethod === 'cash' ? 'bg-guardian-50 border-guardian-500' : 'hover:bg-guardian-50/50'
                  }`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary font-bold text-xs">₹</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground">Pay after service completion</p>
                  </div>
                  {paymentMethod === 'cash' && <CheckCircle size={16} className="text-guardian-500 ml-auto" />}
                </div>
                
                <div 
                  className={`border rounded-lg p-3 flex items-center cursor-pointer ${
                    paymentMethod === 'upi' ? 'bg-guardian-50 border-guardian-500' : 'hover:bg-guardian-50/50'
                  }`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <Smartphone size={16} className="text-primary" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">UPI Payment</p>
                    <p className="text-xs text-muted-foreground">Pay using any UPI app</p>
                    
                    {paymentMethod === 'upi' && (
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Enter your UPI ID (e.g. name@bank)"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full border border-input rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                    )}
                  </div>
                  {paymentMethod === 'upi' && <CheckCircle size={16} className="text-guardian-500 ml-3" />}
                </div>
                
                <div 
                  className={`border rounded-lg p-3 flex items-center cursor-pointer ${
                    paymentMethod === 'card' ? 'bg-guardian-50 border-guardian-500' : 'hover:bg-guardian-50/50'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <CreditCard size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Credit/Debit Card</p>
                    <p className="text-xs text-muted-foreground">Pay with your card</p>
                  </div>
                  {paymentMethod === 'card' && <CheckCircle size={16} className="text-guardian-500 ml-auto" />}
                </div>
              </div>
              
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-medium">
                  <p>Total</p>
                  <p>₹{totalPrice}</p>
                </div>
              </div>
            </AnimatedCard>
            
            <div className="flex items-center p-3 bg-guardian-50 rounded-lg mb-6">
              <Info size={18} className="text-guardian-500 mr-3 flex-shrink-0" />
              <p className="text-sm">
                By confirming this booking, you agree to our Terms of Service and Privacy Policy. Your payment will only be processed after service completion.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="primary" 
                size="lg" 
                fullWidth 
                isLoading={isSubmitting}
                onClick={handleConfirmBooking}
                disabled={paymentMethod === 'upi' && !upiId}
              >
                {!isSubmitting && <CheckCircle size={18} className="mr-2" />}
                Confirm Booking
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                fullWidth
                onClick={handleSaveForLater}
              >
                Save for Later
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between mb-4">
                {['Select Service', 'Schedule', 'Choose Caregiver', 'Confirm'].map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        currentStep > index + 1 
                          ? 'bg-guardian-500 text-white' 
                          : currentStep === index + 1
                            ? 'bg-guardian-100 text-guardian-700 border-2 border-guardian-500'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {currentStep > index + 1 ? (
                        <CheckCircle size={20} />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <p className={`text-xs sm:text-sm text-center ${
                      currentStep === index + 1 ? 'text-guardian-700 font-medium' : 'text-muted-foreground'
                    }`}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
              <div className="relative h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-guardian-500 transition-all duration-300"
                  style={{ width: `${(currentStep - 1) * 33.33}%` }}
                ></div>
              </div>
            </div>
            
            {/* Step Content */}
            {getStepContent()}
            
            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 ? (
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="flex items-center"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 4 && (
                <Button 
                  variant="primary" 
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !selectedService) ||
                    (currentStep === 2 && (!selectedDate || !selectedTime || !selectedDuration)) ||
                    (currentStep === 3 && selectedCaregiverId === null)
                  }
                  className="flex items-center"
                >
                  Next
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookService;
