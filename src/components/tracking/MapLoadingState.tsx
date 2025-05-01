
import React from 'react';
import { Loader2 } from 'lucide-react';

const MapLoadingState: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-guardian-500 mb-2" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  );
};

export default MapLoadingState;
