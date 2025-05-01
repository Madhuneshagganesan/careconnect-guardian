
import { toast } from '@/components/ui/use-toast';

export interface PaymentDetails {
  amount: number;
  currency: string;
  method: 'cash' | 'upi' | 'card';
  upiId?: string;
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  };
}

// Simulate API call delay
const simulateApiCall = async (time: number = 1500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

// Simulate payment processing
export const processPayment = async (paymentDetails: PaymentDetails): Promise<{
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
}> => {
  try {
    // Simulate API call delay
    await simulateApiCall();

    // Validate method-specific details
    if (paymentDetails.method === 'upi') {
      if (!paymentDetails.upiId) {
        return {
          success: false,
          errorMessage: 'UPI ID is required'
        };
      }

      // UPI ID validation (simple pattern check)
      const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
      if (!upiPattern.test(paymentDetails.upiId)) {
        return {
          success: false,
          errorMessage: 'Invalid UPI ID format'
        };
      }
    } else if (paymentDetails.method === 'card') {
      if (!paymentDetails.cardDetails) {
        return {
          success: false,
          errorMessage: 'Card details are required'
        };
      }
      
      // Simple card validation
      const { number, expiry, cvv, name } = paymentDetails.cardDetails;
      
      if (!number || number.replace(/\s+/g, '').length < 15) {
        return {
          success: false,
          errorMessage: 'Invalid card number'
        };
      }
      
      if (!expiry || !expiry.includes('/')) {
        return {
          success: false,
          errorMessage: 'Invalid expiry date'
        };
      }
      
      if (!cvv || cvv.length < 3) {
        return {
          success: false,
          errorMessage: 'Invalid CVV'
        };
      }
      
      if (!name || name.length < 3) {
        return {
          success: false,
          errorMessage: 'Please enter the cardholder name'
        };
      }
    }

    // Simulate successful transaction 90% of the time
    if (Math.random() < 0.9) {
      // Generate mock transaction ID
      const transactionId = 'TRX' + Date.now().toString().slice(-8);
      
      // Store transaction in localStorage for history
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      transactions.push({
        id: transactionId,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        method: paymentDetails.method,
        status: 'completed',
        date: new Date().toISOString()
      });
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      return {
        success: true,
        transactionId
      };
    } else {
      // Simulate random payment failure
      const errorMessages = [
        'Transaction declined by bank',
        'Network error, please try again',
        'Payment service temporarily unavailable'
      ];
      const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      
      return {
        success: false,
        errorMessage: randomError
      };
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      errorMessage: 'An unexpected error occurred'
    };
  }
};

// UPI payment specific processing
export const processUpiPayment = async (
  amount: number,
  upiId: string
): Promise<boolean> => {
  try {
    const result = await processPayment({
      amount,
      currency: 'INR',
      method: 'upi',
      upiId
    });
    
    if (result.success) {
      toast({
        title: "UPI Payment Successful",
        description: `Transaction ID: ${result.transactionId}`,
      });
      return true;
    } else {
      toast({
        title: "UPI Payment Failed",
        description: result.errorMessage || "Please try again",
        variant: "destructive"
      });
      return false;
    }
  } catch (error) {
    toast({
      title: "Payment Error",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};

// Card payment specific processing
export const processCardPayment = async (
  amount: number,
  cardDetails: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  }
): Promise<boolean> => {
  try {
    const result = await processPayment({
      amount,
      currency: 'INR',
      method: 'card',
      cardDetails
    });
    
    if (result.success) {
      toast({
        title: "Card Payment Successful",
        description: `Transaction ID: ${result.transactionId}`,
      });
      return true;
    } else {
      toast({
        title: "Card Payment Failed",
        description: result.errorMessage || "Please try again",
        variant: "destructive"
      });
      return false;
    }
  } catch (error) {
    toast({
      title: "Payment Error",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};
