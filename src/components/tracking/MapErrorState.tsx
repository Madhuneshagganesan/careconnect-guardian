
import React from 'react';
import { Button } from '@/components/ui/shadcn-button';
import { saveMapboxToken } from './utils/mapUtils';
import { toast } from '@/components/ui/use-toast';

interface MapErrorStateProps {
  mapError: string;
  mapboxToken: string;
  onTokenUpdate: () => void;
}

const MapErrorState: React.FC<MapErrorStateProps> = ({ 
  mapError, 
  mapboxToken, 
  onTokenUpdate 
}) => {
  const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbDZ2MDZ6dDYwNnljM2JwZXRydXlvdnBnIn0.boA9CJ9_IWvrIWlYxzDdGg';
  
  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const tokenInput = e.currentTarget.elements.namedItem('mapboxToken') as HTMLInputElement;
    const newToken = tokenInput.value.trim();
    
    if (newToken) {
      saveMapboxToken(newToken);
      toast({
        title: "Mapbox token updated",
        description: "Your map will now reload with the new token",
      });
      onTokenUpdate();
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
      <div className="flex flex-col items-center p-4 max-w-md">
        <p className="text-red-500 font-medium text-center">{mapError}</p>
        <p className="text-sm text-muted-foreground mt-2 text-center mb-4">
          Please enter your Mapbox public token below
        </p>
        <form onSubmit={handleTokenSubmit} className="w-full space-y-2">
          <input
            type="text"
            name="mapboxToken"
            placeholder="Enter Mapbox token"
            className="w-full p-2 border rounded text-sm"
            defaultValue={mapboxToken !== DEFAULT_MAPBOX_TOKEN ? mapboxToken : ''}
          />
          <div className="text-xs text-muted-foreground text-center mb-2">
            Get your token at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a> (Account → Access tokens)
          </div>
          <Button type="submit" className="w-full">Apply Token</Button>
        </form>
      </div>
    </div>
  );
};

export default MapErrorState;
