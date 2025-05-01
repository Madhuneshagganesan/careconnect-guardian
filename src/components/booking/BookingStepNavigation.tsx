
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

interface BookingStepNavigationProps {
  currentStep: number;
  totalSteps: number;
  handleBack: () => void;
  handleNext: () => void;
  isNextDisabled?: boolean;
}

const BookingStepNavigation: React.FC<BookingStepNavigationProps> = ({
  currentStep,
  totalSteps,
  handleBack,
  handleNext,
  isNextDisabled = false
}) => {
  return (
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
      
      {currentStep < totalSteps && (
        <Button 
          variant="primary" 
          onClick={handleNext}
          disabled={isNextDisabled}
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
