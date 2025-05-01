
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

// Simulate API call delay with realistic timing variations
const simulateApiCall = async (time: number = 1500): Promise<void> => {
  // Add some randomness to make it feel more realistic
  const variance = Math.floor(Math.random() * 500); // +/- 500ms
  const actualTime = Math.max(500, time + variance);
  return new Promise((resolve) => setTimeout(resolve, actualTime));
};

// Generate transaction ID with proper format
const generateTransactionId = (): string => {
  const prefix = 'TXN';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}`;
};

// Simulate payment gateway validation
const validatePaymentDetails = (paymentDetails: PaymentDetails): { 
  valid: boolean; 
  message?: string
} => {
  if (paymentDetails.method === 'upi') {
    if (!paymentDetails.upiId) {
      return { valid: false, message: 'UPI ID is required' };
    }

    // UPI ID validation (simple pattern check)
    const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    if (!upiPattern.test(paymentDetails.upiId)) {
      return { valid: false, message: 'Invalid UPI ID format' };
    }
  } else if (paymentDetails.method === 'card') {
    if (!paymentDetails.cardDetails) {
      return { valid: false, message: 'Card details are required' };
    }
    
    const { number, expiry, cvv, name } = paymentDetails.cardDetails;
    
    if (!number || number.replace(/\s+/g, '').length < 15) {
      return { valid: false, message: 'Invalid card number' };
    }
    
    if (!expiry || !expiry.includes('/')) {
      return { valid: false, message: 'Invalid expiry date' };
    }
    
    if (!cvv || cvv.length < 3) {
      return { valid: false, message: 'Invalid CVV' };
    }
    
    if (!name || name.length < 3) {
      return { valid: false, message: 'Please enter the cardholder name' };
    }
  }

  return { valid: true };
};

// Process payment with more realistic flow and error handling
export const processPayment = async (paymentDetails: PaymentDetails): Promise<{
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
}> => {
  try {
    // Step 1: Validate the payment details first
    console.log('[Payment Service] Processing payment with method:', paymentDetails.method);
    const validation = validatePaymentDetails(paymentDetails);
    if (!validation.valid) {
      console.log('[Payment Service] Validation failed:', validation.message);
      return {
        success: false,
        errorMessage: validation.message
      };
    }

    // Step 2: Initialize payment processing (simulate API call)
    console.log('[Payment Service] Payment details validated, initializing transaction');
    await simulateApiCall(1000);
    
    // Step 3: Process payment with the gateway (simulated)
    console.log('[Payment Service] Processing payment with gateway');
    await simulateApiCall(1500);

    // Step 4: Simulate success/failure with realistic probabilities
    const successProbability = 0.95; // 95% success rate is more realistic
    if (Math.random() < successProbability) {
      // Generate a transaction ID
      const transactionId = generateTransactionId();
      console.log('[Payment Service] Payment successful, transaction ID:', transactionId);
      
      // Store transaction in localStorage for history
      const now = new Date();
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      transactions.push({
        id: transactionId,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        method: paymentDetails.method,
        status: 'completed',
        date: now.toISOString(),
        gateway_response: {
          approval_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
          processor_response: 'Approved',
          auth_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
          timestamp: now.toISOString()
        }
      });
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      // Create a notification about successful payment
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.push({
        id: Date.now().toString(),
        title: "Payment Successful",
        message: `Your payment of ${paymentDetails.currency} ${paymentDetails.amount.toFixed(2)} was processed successfully.`,
        type: 'success',
        time: new Date().toISOString(),
        read: false
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));
      
      return {
        success: true,
        transactionId
      };
    } else {
      // Simulate random payment failure with realistic error messages
      console.log('[Payment Service] Payment failed');
      const errorMessages = [
        'Transaction declined by issuing bank',
        'Insufficient funds',
        'Payment gateway timeout',
        'Authentication failed',
        'Card verification failed'
      ];
      const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      
      // Log the failed attempt
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      transactions.push({
        id: `failed_${Date.now()}`,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        method: paymentDetails.method,
        status: 'failed',
        date: new Date().toISOString(),
        error: randomError
      });
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      return {
        success: false,
        errorMessage: randomError
      };
    }
  } catch (error) {
    console.error('[Payment Service] Unexpected error:', error);
    return {
      success: false,
      errorMessage: 'An unexpected error occurred during payment processing'
    };
  }
};

// UPI payment specific processing with enhanced feedback
export const processUpiPayment = async (
  amount: number,
  upiId: string
): Promise<boolean> => {
  try {
    console.log('[UPI Payment] Processing UPI payment for amount:', amount);
    
    // Show processing toast
    toast({
      title: "Processing UPI Payment",
      description: "Please wait while we verify your payment...",
    });
    
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
      
      // Simulate bank notification
      setTimeout(() => {
        toast({
          title: "Bank Notification",
          description: `Your bank has confirmed the payment of ₹${amount.toFixed(2)}`,
        });
      }, 2000);
      
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
    console.error('[UPI Payment] Error:', error);
    toast({
      title: "Payment Error",
      description: "An unexpected error occurred during UPI payment",
      variant: "destructive"
    });
    return false;
  }
};

// Card payment specific processing with enhanced feedback
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
    console.log('[Card Payment] Processing card payment for amount:', amount);
    
    // Show processing toast
    toast({
      title: "Processing Card Payment",
      description: "Please don't close this window while we process your payment...",
    });
    
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
      
      // Simulate email notification
      setTimeout(() => {
        toast({
          title: "Payment Confirmation",
          description: `A receipt has been sent to your email address`,
        });
      }, 2000);
      
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
    console.error('[Card Payment] Error:', error);
    toast({
      title: "Payment Error",
      description: "An unexpected error occurred during card payment",
      variant: "destructive"
    });
    return false;
  }
};
