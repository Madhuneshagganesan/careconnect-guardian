
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ProgressStepsProps {
  currentStep: number;
  steps: string[];
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                currentStep > index + 1 
                  ? 'bg-guardian-500 text-white' 
                  : currentStep === index + 1
                    ? 'bg-guardian-100 text-guardian-700 border-2 border-guardian-500'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {currentStep > index + 1 ? (
                <CheckCircle size={20} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <p className={`text-xs sm:text-sm text-center ${
              currentStep === index + 1 ? 'text-guardian-700 font-medium' : 'text-muted-foreground'
            }`}>
              {step}
            </p>
          </div>
        ))}
      </div>
      <div className="relative h-1 bg-muted rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-guardian-500 transition-all duration-300"
          style={{ width: `${(currentStep - 1) * (100 / (steps.length - 1))}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressSteps;
