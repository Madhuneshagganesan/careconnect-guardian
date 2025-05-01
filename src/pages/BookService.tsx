
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from '@/components/ui/use-toast';
import ProgressSteps from '@/components/booking/ProgressSteps';
import ServiceSelection from '@/components/booking/ServiceSelection';
import ScheduleSelection from '@/components/booking/ScheduleSelection';
import CaregiverSelection from '@/components/booking/CaregiverSelection';
import BookingConfirmation from '@/components/booking/BookingConfirmation';
import BookingStepNavigation from '@/components/booking/BookingStepNavigation';
import useBookingState from '@/hooks/useBookingState';

const BookService = () => {
  const navigate = useNavigate();
  const {
    // Step state
    currentStep,
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
    isServiceStepValid,
    isScheduleStepValid,
    isCaregiverStepValid
  } = useBookingState();
  
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    
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
          <ServiceSelection 
            services={services}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
          />
        );
      
      case 2:
        return (
          <ScheduleSelection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
          />
        );
      
      case 3:
        return (
          <CaregiverSelection
            caregivers={caregivers}
            selectedCaregiverId={selectedCaregiverId}
            setSelectedCaregiverId={setSelectedCaregiverId}
          />
        );
      
      case 4:
        return (
          <BookingConfirmation
            serviceTitle={selectedServiceObj?.title}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            durationLabel={selectedDurationObj?.label}
            selectedCaregiverName={selectedCaregiverObj?.name}
            address={address}
            setAddress={setAddress}
            servicePrice={servicePrice}
            selectedDurationPrice={selectedDurationObj?.price || 0}
            totalPrice={totalPrice}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            upiId={upiId}
            setUpiId={setUpiId}
            isSubmitting={isSubmitting}
            handleConfirmBooking={handleConfirmBooking}
            handleSaveForLater={handleSaveForLater}
          />
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
            <ProgressSteps 
              currentStep={currentStep} 
              steps={['Select Service', 'Schedule', 'Choose Caregiver', 'Confirm']} 
            />
            
            {/* Step Content */}
            {getStepContent()}
            
            {/* Navigation Buttons */}
            <BookingStepNavigation 
              currentStep={currentStep}
              totalSteps={4}
              handleBack={handleBack}
              handleNext={handleNext}
              isNextDisabled={
                (currentStep === 1 && !isServiceStepValid) ||
                (currentStep === 2 && !isScheduleStepValid) ||
                (currentStep === 3 && !isCaregiverStepValid)
              }
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookService;
