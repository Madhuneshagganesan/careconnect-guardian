
import React, { useState } from 'react';
import { processCardPayment } from '@/services/paymentService';
import { Button } from '@/components/ui/shadcn-button';
import { CreditCard, Calendar, User, KeyRound } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface CardPaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const CardPaymentForm: React.FC<CardPaymentFormProps> = ({ amount, onSuccess, onCancel }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
    cardName?: string;
  }>({});

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Limit to 16 digits
    const limitedDigits = digits.slice(0, 16);
    
    // Format with spaces every 4 digits
    const groups = [];
    for (let i = 0; i < limitedDigits.length; i += 4) {
      groups.push(limitedDigits.slice(i, i + 4));
    }
    
    return groups.join(' ');
  };

  const formatExpiry = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    } else {
      return digits;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardExpiry(formatExpiry(e.target.value));
  };

  const validateForm = (): boolean => {
    const newErrors: {
      cardNumber?: string;
      cardExpiry?: string;
      cardCvv?: string;
      cardName?: string;
    } = {};
    
    // Card number validation
    if (!cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumber.replace(/\s+/g, '').length < 15) {
      newErrors.cardNumber = 'Invalid card number';
    }
    
    // Expiry validation
    if (!cardExpiry) {
      newErrors.cardExpiry = 'Expiry date is required';
    } else if (!cardExpiry.includes('/') || cardExpiry.length !== 5) {
      newErrors.cardExpiry = 'Use MM/YY format';
    }
    
    // CVV validation
    if (!cardCvv) {
      newErrors.cardCvv = 'CVV is required';
    } else if (cardCvv.length < 3) {
      newErrors.cardCvv = 'Invalid CVV';
    }
    
    // Name validation
    if (!cardName) {
      newErrors.cardName = 'Cardholder name is required';
    } else if (cardName.length < 3) {
      newErrors.cardName = 'Enter full name';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const success = await processCardPayment(
        amount,
        {
          number: cardNumber.replace(/\s+/g, ''),
          expiry: cardExpiry,
          cvv: cardCvv,
          name: cardName
        }
      );
      
      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error('Card payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg border border-border shadow-sm">
      <h3 className="text-lg font-medium mb-4">Card Payment</h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Card Number */}
          <div className="space-y-1">
            <label htmlFor="cardNumber" className="block text-sm font-medium text-muted-foreground">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className={`pl-10 w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-guardian-500 ${
                  errors.cardNumber ? 'border-red-500' : 'border-border'
                }`}
                disabled={isProcessing}
              />
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            </div>
            {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber}</p>}
          </div>
          
          {/* Card Details Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Expiry Date */}
            <div className="space-y-1">
              <label htmlFor="cardExpiry" className="block text-sm font-medium text-muted-foreground">
                Expiry Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cardExpiry"
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className={`pl-10 w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-guardian-500 ${
                    errors.cardExpiry ? 'border-red-500' : 'border-border'
                  }`}
                  maxLength={5}
                  disabled={isProcessing}
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              </div>
              {errors.cardExpiry && <p className="text-xs text-red-500">{errors.cardExpiry}</p>}
            </div>
            
            {/* CVV */}
            <div className="space-y-1">
              <label htmlFor="cardCvv" className="block text-sm font-medium text-muted-foreground">
                CVV
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="cardCvv"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  className={`pl-10 w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-guardian-500 ${
                    errors.cardCvv ? 'border-red-500' : 'border-border'
                  }`}
                  maxLength={4}
                  disabled={isProcessing}
                />
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              </div>
              {errors.cardCvv && <p className="text-xs text-red-500">{errors.cardCvv}</p>}
            </div>
          </div>
          
          {/* Card Holder Name */}
          <div className="space-y-1">
            <label htmlFor="cardName" className="block text-sm font-medium text-muted-foreground">
              Cardholder Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                className={`pl-10 w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-guardian-500 ${
                  errors.cardName ? 'border-red-500' : 'border-border'
                }`}
                disabled={isProcessing}
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            </div>
            {errors.cardName && <p className="text-xs text-red-500">{errors.cardName}</p>}
          </div>
          
          {/* Amount Display */}
          <div className="bg-guardian-50 p-3 rounded-md text-center">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-medium">₹{amount.toFixed(2)}</p>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 bg-guardian-600 hover:bg-guardian-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Pay Now'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CardPaymentForm;
