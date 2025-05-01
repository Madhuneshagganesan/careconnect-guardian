
import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface BookingStepNavigationProps {
  currentStep: number;
  totalSteps: number;
  handleBack: () => void;
  handleNext: () => void;
  isNextDisabled?: boolean;
  showConfirmButton?: boolean;
  handleConfirm?: () => void;
  isSubmitting?: boolean;
}

const BookingStepNavigation: React.FC<BookingStepNavigationProps> = ({
  currentStep,
  totalSteps,
  handleBack,
  handleNext,
  isNextDisabled = false,
  showConfirmButton = false,
  handleConfirm,
  isSubmitting = false
}) => {
  return (
    <div className="mt-8 flex justify-between">
      {currentStep > 1 ? (
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="flex items-center"
          disabled={isSubmitting}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
      ) : (
        <div></div>
      )}
      
      {showConfirmButton ? (
        <Button 
          variant="primary" 
          onClick={handleConfirm}
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className="flex items-center"
        >
          {!isSubmitting && <CheckCircle size={16} className="mr-2" />}
          Confirm Payment
        </Button>
      ) : currentStep < totalSteps && (
        <Button 
          variant="primary" 
          onClick={handleNext}
          disabled={isNextDisabled || isSubmitting}
          className="flex items-center"
        >
          Next
          <ArrowRight size={16} className="ml-2" />
        </Button>
      )}
    </div>
  );
};

export default BookingStepNavigation;
