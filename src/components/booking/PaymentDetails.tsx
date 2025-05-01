
import React, { useState } from 'react';
import { CreditCard, Smartphone, CheckCircle, Info } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';

interface PaymentDetailsProps {
  servicePrice: number;
  selectedDurationPrice: number;
  totalPrice: number;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  upiId: string;
  setUpiId: (id: string) => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  servicePrice,
  selectedDurationPrice,
  totalPrice,
  paymentMethod,
  setPaymentMethod,
  upiId,
  setUpiId
}) => {
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
      
      <div className="flex items-center p-3 mt-4 bg-guardian-50 rounded-lg">
        <Info size={18} className="text-guardian-500 mr-3 flex-shrink-0" />
        <p className="text-sm">
          By confirming this booking, you agree to our Terms of Service and Privacy Policy. Your payment will only be processed after service completion.
        </p>
      </div>
    </AnimatedCard>
  );
};

export default PaymentDetails;
