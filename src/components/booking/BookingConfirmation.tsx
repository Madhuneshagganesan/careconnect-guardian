
import React from 'react';
import { CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import BookingSummary from './BookingSummary';
import PaymentDetails from './PaymentDetails';

interface BookingConfirmationProps {
  serviceTitle?: string;
  selectedDate: string;
  selectedTime: string;
  durationLabel?: string;
  selectedCaregiverName?: string;
  address: string;
  setAddress: (address: string) => void;
  servicePrice: number;
  selectedDurationPrice: number;
  totalPrice: number;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  upiId: string;
  setUpiId: (id: string) => void;
  isSubmitting: boolean;
  handleConfirmBooking: () => void;
  handleSaveForLater: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  serviceTitle,
  selectedDate,
  selectedTime,
  durationLabel,
  selectedCaregiverName,
  address,
  setAddress,
  servicePrice,
  selectedDurationPrice,
  totalPrice,
  paymentMethod,
  setPaymentMethod,
  upiId,
  setUpiId,
  isSubmitting,
  handleConfirmBooking,
  handleSaveForLater
}) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Review & Confirm</h2>
      
      <BookingSummary 
        serviceTitle={serviceTitle}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        durationLabel={durationLabel}
        selectedCaregiverName={selectedCaregiverName}
        address={address}
        setAddress={setAddress}
      />
      
      <PaymentDetails 
        servicePrice={servicePrice}
        selectedDurationPrice={selectedDurationPrice}
        totalPrice={totalPrice}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        upiId={upiId}
        setUpiId={setUpiId}
        onPaymentSuccess={() => {
          // This is a placeholder for when payment is successful
          // Store the payment method in the booking
          const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
          if (bookings.length > 0) {
            const latestBooking = bookings[bookings.length - 1];
            latestBooking.paymentMethod = paymentMethod;
            localStorage.setItem('bookings', JSON.stringify(bookings));
          }
        }}
      />
      
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
};

export default BookingConfirmation;
