
import React, { useState } from 'react';
import { processUpiPayment } from '@/services/paymentService';
import { Button } from '@/components/ui/shadcn-button';
import { Smartphone, Loader2, QrCode } from 'lucide-react';

interface UpiPaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const UpiPaymentForm: React.FC<UpiPaymentFormProps> = ({ amount, onSuccess, onCancel }) => {
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);

  const validateUpiId = (id: string) => {
    // Basic UPI ID validation (username@provider)
    const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiPattern.test(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate UPI ID
    if (!upiId) {
      setError('Please enter your UPI ID');
      return;
    }
    
    if (!validateUpiId(upiId)) {
      setError('Invalid UPI ID format (e.g. name@bank)');
      return;
    }
    
    setError(null);
    setIsProcessing(true);
    
    try {
      const success = await processUpiPayment(amount, upiId);
      
      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error('UPI payment error:', error);
      setError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg border border-border shadow-sm">
      <h3 className="text-lg font-medium mb-4">UPI Payment</h3>
      
      <div className="flex justify-between mb-6">
        <button
          type="button"
          onClick={() => setShowQr(false)}
          className={`flex-1 py-2 px-4 text-center text-sm font-medium ${
            !showQr ? 'bg-guardian-50 text-guardian-800 border-b-2 border-guardian-500' : 'text-muted-foreground'
          }`}
        >
          <Smartphone className="inline-block mr-1" size={16} /> UPI ID
        </button>
        <button
          type="button"
          onClick={() => setShowQr(true)}
          className={`flex-1 py-2 px-4 text-center text-sm font-medium ${
            showQr ? 'bg-guardian-50 text-guardian-800 border-b-2 border-guardian-500' : 'text-muted-foreground'
          }`}
        >
          <QrCode className="inline-block mr-1" size={16} /> QR Code
        </button>
      </div>
      
      {showQr ? (
        <div className="text-center">
          <div className="w-64 h-64 mx-auto bg-white border border-border rounded-lg p-4 flex items-center justify-center">
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <QrCode size={120} className="text-guardian-500" />
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Scan this QR code with any UPI app to pay ₹{amount.toFixed(2)}
          </p>
          <div className="mt-6">
            <div className="grid grid-cols-4 gap-2">
              {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                <div key={app} className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-guardian-50 flex items-center justify-center">
                    <span className="text-xs font-medium text-guardian-800">{app.slice(0,1)}</span>
                  </div>
                  <p className="mt-1 text-xs">{app}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <Button
              type="button"
              className="w-full"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="upiId" className="block text-sm font-medium text-muted-foreground">
                Your UPI ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="upiId"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    setError(null);
                  }}
                  placeholder="yourname@bank"
                  className={`pl-10 w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-guardian-500 ${
                    error ? 'border-red-500' : 'border-border'
                  }`}
                  disabled={isProcessing}
                />
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              
              <p className="text-xs text-muted-foreground mt-1">
                Enter your UPI ID (e.g. name@okaxis, phone@ybl)
              </p>
            </div>
            
            <div className="bg-guardian-50 p-3 rounded-md text-center">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-medium">₹{amount.toFixed(2)}</p>
            </div>
            
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
      )}
    </div>
  );
};

export default UpiPaymentForm;
