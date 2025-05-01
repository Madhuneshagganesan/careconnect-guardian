
import React from 'react';
import { Button } from '@/components/ui/shadcn-button';
import { Loader2, MapPin } from 'lucide-react';

interface MapTrackingControlsProps {
  simulationActive: boolean;
  onStartSimulation: () => void;
}

const MapTrackingControls: React.FC<MapTrackingControlsProps> = ({
  simulationActive,
  onStartSimulation
}) => {
  if (simulationActive) {
    return (
      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center">
        <div className="bg-guardian-50 border border-guardian-200 rounded-full px-4 py-2 text-sm font-medium text-guardian-800 flex items-center gap-2 shadow-lg animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin" />
          Live tracking active
        </div>
      </div>
    );
  }
  
  return (
    <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center">
      <Button 
        onClick={onStartSimulation} 
        className="bg-guardian-600 hover:bg-guardian-700 text-white flex items-center gap-2 shadow-lg"
      >
        <MapPin size={16} />
        Start Live Tracking
      </Button>
    </div>
  );
};

export default MapTrackingControls;
