
import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, CheckCircle, Info, Shield } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/shadcn-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UpiPaymentForm from '@/components/payment/UpiPaymentForm';
import CardPaymentForm from '@/components/payment/CardPaymentForm';
import { toast } from '@/hooks/use-toast';

interface PaymentDetailsProps {
  servicePrice: number;
  selectedDurationPrice: number;
  totalPrice: number;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  upiId: string;
  setUpiId: (id: string) => void;
  onPaymentSuccess?: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  servicePrice,
  selectedDurationPrice,
  totalPrice,
  paymentMethod,
  setPaymentMethod,
  upiId,
  setUpiId,
  onPaymentSuccess
}) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentFormType, setPaymentFormType] = useState<'upi' | 'card' | null>(null);
  
  // Save payment method to local storage whenever it changes
  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    if (bookings.length > 0) {
      const latestBooking = bookings[bookings.length - 1];
      latestBooking.paymentMethod = paymentMethod;
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
  }, [paymentMethod]);
  
  const handlePayNow = () => {
    if (paymentMethod === 'cash') {
      toast({
        title: "Cash Payment Selected",
        description: "You'll pay after service completion.",
      });
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    } else if (paymentMethod === 'upi') {
      setPaymentFormType('upi');
      setShowPaymentForm(true);
    } else if (paymentMethod === 'card') {
      setPaymentFormType('card');
      setShowPaymentForm(true);
    }
  };
  
  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };
  
  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
  };

  if (showPaymentForm) {
    return paymentFormType === 'upi' ? (
      <UpiPaymentForm 
        amount={totalPrice} 
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
      />
    ) : (
      <CardPaymentForm 
        amount={totalPrice} 
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
      />
    );
  }

  return (
    <AnimatedCard className="mb-6">
      <h3 className="text-lg font-medium mb-4">Payment Details</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <p className="text-muted-foreground">Service fee</p>
          <p>₹{servicePrice}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-muted-foreground">Duration</p>
          <p>₹{selectedDurationPrice}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-muted-foreground">Convenience fee</p>
          <p>₹99</p>
        </div>
      </div>
      
      <Tabs defaultValue="payment-method">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="payment-method">Payment Method</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payment-method" className="mt-4">
          <div 
            className={`border rounded-lg p-3 flex items-center mb-2 cursor-pointer ${
              paymentMethod === 'cash' ? 'bg-purple-50 border-purple-500' : 'hover:bg-purple-50/50'
            }`}
            onClick={() => setPaymentMethod('cash')}
          >
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-purple-600 font-bold text-xs">₹</span>
            </div>
            <div>
              <p className="text-sm font-medium">Cash on Delivery</p>
              <p className="text-xs text-muted-foreground">Pay after service completion</p>
            </div>
            {paymentMethod === 'cash' && <CheckCircle size={16} className="text-purple-500 ml-auto" />}
          </div>
          
          <div 
            className={`border rounded-lg p-3 flex items-center cursor-pointer ${
              paymentMethod === 'upi' ? 'bg-purple-50 border-purple-500' : 'hover:bg-purple-50/50'
            }`}
            onClick={() => setPaymentMethod('upi')}
          >
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <Smartphone size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium">UPI Payment</p>
              <p className="text-xs text-muted-foreground">Pay using any UPI app</p>
            </div>
            {paymentMethod === 'upi' && <CheckCircle size={16} className="text-purple-500 ml-auto" />}
          </div>
          
          <div 
            className={`border rounded-lg p-3 flex items-center cursor-pointer ${
              paymentMethod === 'card' ? 'bg-purple-50 border-purple-500' : 'hover:bg-purple-50/50'
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <CreditCard size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Credit/Debit Card</p>
              <p className="text-xs text-muted-foreground">Pay with your card</p>
            </div>
            {paymentMethod === 'card' && <CheckCircle size={16} className="text-purple-500 ml-auto" />}
          </div>
          
          <Button
            onClick={handlePayNow}
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
          >
            Pay Now
          </Button>
        </TabsContent>
      </Tabs>
      
      <div className="border-t border-border pt-3 mt-4">
        <div className="flex justify-between font-medium">
          <p>Total</p>
          <p>₹{totalPrice}</p>
        </div>
      </div>
      
      <div className="flex items-center p-3 mt-4 bg-purple-50 rounded-lg">
        <Shield size={18} className="text-purple-500 mr-3 flex-shrink-0" />
        <p className="text-sm">
          Secure payment processing. Your payment information is encrypted and protected.
        </p>
      </div>
    </AnimatedCard>
  );
};

export default PaymentDetails;
