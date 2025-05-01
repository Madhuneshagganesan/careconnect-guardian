
import React from 'react';
import { CheckCircle, Info } from 'lucide-react';

interface Caregiver {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  imageUrl: string;
}

interface CaregiverSelectionProps {
  caregivers: Caregiver[];
  selectedCaregiverId: number | null;
  setSelectedCaregiverId: (id: number) => void;
}

const CaregiverSelection: React.FC<CaregiverSelectionProps> = ({
  caregivers,
  selectedCaregiverId,
  setSelectedCaregiverId
}) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Choose a Caregiver</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {caregivers.map((caregiver) => (
          <div
            key={caregiver.id}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              selectedCaregiverId === caregiver.id
                ? 'border-guardian-500 bg-guardian-50'
                : 'border-border hover:border-guardian-200 hover:bg-guardian-50/50'
            }`}
            onClick={() => setSelectedCaregiverId(caregiver.id)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-guardian-100 rounded-full flex items-center justify-center">
                <span className="text-guardian-400">Photo</span>
              </div>
              <div>
                <h3 className="font-medium">{caregiver.name}</h3>
                <p className="text-sm text-muted-foreground">{caregiver.specialty}</p>
              </div>
              {selectedCaregiverId === caregiver.id && (
                <CheckCircle size={18} className="text-guardian-500 ml-auto" />
              )}
            </div>
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium text-sm">{caregiver.rating}</span>
                <span className="text-xs text-muted-foreground ml-1">({caregiver.reviews} reviews)</span>
              </div>
            </div>
            <div className="text-sm text-guardian-600 font-medium">
              View full profile
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center p-3 bg-guardian-50 rounded-lg mb-4">
        <Info size={18} className="text-guardian-500 mr-3" />
        <p className="text-sm">
          Not sure which caregiver to choose? Select "Assign Best Match" and we'll find the best available caregiver for your needs.
        </p>
      </div>
      
      <div 
        className={`border rounded-xl p-4 cursor-pointer transition-all ${
          selectedCaregiverId === 0
            ? 'border-guardian-500 bg-guardian-50'
            : 'border-border hover:border-guardian-200 hover:bg-guardian-50/50'
        }`}
        onClick={() => setSelectedCaregiverId(0)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-guardian-500/10 rounded-full flex items-center justify-center text-guardian-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Assign Best Match</h3>
              <p className="text-sm text-muted-foreground">Let us find the best caregiver for you</p>
            </div>
          </div>
          {selectedCaregiverId === 0 && (
            <CheckCircle size={18} className="text-guardian-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CaregiverSelection;
