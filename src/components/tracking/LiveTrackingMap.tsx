
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';

// Initialize mapbox token as null
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbDZ2MDZ6dDYwNnljM2JwZXRydXlvdnBnIn0.boA9CJ9_IWvrIWlYxzDdGg';

interface MapPosition {
  lng: number;
  lat: number;
}

interface LiveTrackingMapProps {
  caregiverPosition?: MapPosition;
  destination?: MapPosition;
}

const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({ 
  caregiverPosition = { lng: -73.985428, lat: 40.748817 },
  destination = { lng: -73.9712, lat: 40.7624 }
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const caregiverMarker = useRef<mapboxgl.Marker | null>(null);
  const destinationMarker = useRef<mapboxgl.Marker | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    // Try to get token from localStorage first
    return localStorage.getItem('mapbox_token') || DEFAULT_MAPBOX_TOKEN;
  });
  
  const initializeMap = () => {
    if (!mapContainer.current) return;
    
    // Clean up existing map if any - but safely
    if (map.current) {
      // Remove markers first to avoid issues
      if (caregiverMarker.current) {
        caregiverMarker.current.remove();
        caregiverMarker.current = null;
      }
      
      if (destinationMarker.current) {
        destinationMarker.current.remove();
        destinationMarker.current = null;
      }
      
      // Then remove the map
      try {
        map.current.remove();
      } catch (e) {
        console.error("Error removing map:", e);
        // Continue with initialization even if removal failed
      }
      map.current = null;
    }
    
    setLoading(true);
    setMapError(null);
    
    try {
      // Set mapbox token
      mapboxgl.accessToken = mapboxToken;
      
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [caregiverPosition.lng, caregiverPosition.lat],
        zoom: 13,
      });
      
      // Add navigation controls (zoom in/out, rotate)
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // When map loads, add markers and route
      map.current.on('load', () => {
        if (!map.current) return;
        
        try {
          // Add destination marker
          destinationMarker.current = new mapboxgl.Marker({ color: '#5C69D1' })
            .setLngLat([destination.lng, destination.lat])
            .addTo(map.current)
            .setPopup(new mapboxgl.Popup().setHTML('<p class="font-medium">Your Location</p>'));
          
          // Add caregiver marker
          caregiverMarker.current = new mapboxgl.Marker({ color: '#FF775A' })
            .setLngLat([caregiverPosition.lng, caregiverPosition.lat])
            .addTo(map.current)
            .setPopup(new mapboxgl.Popup().setHTML('<p class="font-medium">Your Caregiver</p>'));
          
          // Add a line between caregiver and destination
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [caregiverPosition.lng, caregiverPosition.lat],
                  [destination.lng, destination.lat]
                ]
              }
            }
          });
          
          // Add the route line layer
          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#5C69D1',
              'line-width': 4,
              'line-opacity': 0.7,
              'line-dasharray': [1, 1]
            }
          });
          
          // Fit bounds to show both markers
          const bounds = new mapboxgl.LngLatBounds()
            .extend([caregiverPosition.lng, caregiverPosition.lat])
            .extend([destination.lng, destination.lat]);
          
          map.current.fitBounds(bounds, {
            padding: 100,
            maxZoom: 15
          });
          
          // Hide loading indicator
          setLoading(false);
        } catch (err) {
          console.error('Error setting up markers and route:', err);
          setMapError('Failed to set up map markers');
          setLoading(false);
        }
      });
      
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Failed to load map. Please enter a valid Mapbox token below.');
        setLoading(false);
      });
    } catch (err) {
      console.error('Error initializing map:', err);
      setMapError('Failed to initialize map. Please enter a valid Mapbox token below.');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    initializeMap();
    
    // Clean up on unmount
    return () => {
      // Safely remove markers first
      if (caregiverMarker.current) {
        caregiverMarker.current.remove();
      }
      
      if (destinationMarker.current) {
        destinationMarker.current.remove();
      }
      
      // Then safely remove the map
      if (map.current) {
        try {
          map.current.remove();
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
      }
    };
  }, [caregiverPosition, destination, mapboxToken]);
  
  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const tokenInput = e.currentTarget.elements.namedItem('mapboxToken') as HTMLInputElement;
    const newToken = tokenInput.value.trim();
    
    if (newToken) {
      // Save to localStorage
      localStorage.setItem('mapbox_token', newToken);
      setMapboxToken(newToken);
    }
  };
  
  return (
    <div className="relative w-full h-96 sm:h-[450px] rounded-lg overflow-hidden border border-border">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-guardian-500 mb-2" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      {mapError && (
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
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default LiveTrackingMap;
