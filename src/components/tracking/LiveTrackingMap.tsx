
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from '@/components/ui/use-toast';
import { getStoredMapboxToken, MapPosition, calculateMapBounds } from './utils/mapUtils';
import MapLoadingState from './MapLoadingState';
import MapErrorState from './MapErrorState';
import MapTrackingControls from './MapTrackingControls';
import MapRouteManager from './MapRouteManager';

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
  const [mapboxToken, setMapboxToken] = useState<string>(getStoredMapboxToken);
  
  // Add simulated movement state
  const [simulationActive, setSimulationActive] = useState(false);
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);
  
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
      
      // When map loads, add markers
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

          // Show a success toast when map is loaded
          toast({
            title: "Map loaded successfully",
            description: "You can now track your caregiver in real-time",
          });
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
  
  // Start simulation function
  const startSimulation = () => {
    if (!map.current || !caregiverMarker.current) return;
    
    setSimulationActive(true);
    toast({
      title: "Live tracking activated",
      description: "Your caregiver is now moving toward you",
    });
    
    // Calculate direction from caregiver to destination
    const dx = destination.lng - caregiverPosition.lng;
    const dy = destination.lat - caregiverPosition.lat;
    
    // Number of steps to reach destination (simulate ~3 minutes of movement)
    const totalSteps = 30;
    const stepX = dx / totalSteps;
    const stepY = dy / totalSteps;
    
    let currentStep = 0;
    let currentPosition = { ...caregiverPosition };
    
    // Update caregiver position every 6 seconds
    simulationInterval.current = setInterval(() => {
      if (currentStep >= totalSteps) {
        stopSimulation();
        toast({
          title: "Caregiver has arrived!",
          description: "Your caregiver has reached your location",
        });
        return;
      }
      
      // Update position
      currentPosition = {
        lng: currentPosition.lng + stepX,
        lat: currentPosition.lat + stepY
      };
      
      // Update marker position
      caregiverMarker.current?.setLngLat([currentPosition.lng, currentPosition.lat]);
      
      currentStep++;
      
      // Every 3rd step, show an update notification
      if (currentStep % 3 === 0) {
        const stepsRemaining = totalSteps - currentStep;
        const minutesRemaining = Math.round(stepsRemaining * 0.1 * 10) / 10;
        
        toast({
          title: "Caregiver update",
          description: `Caregiver is ${minutesRemaining.toFixed(1)} minutes away from your location`,
        });
      }
    }, 6000); // Update every 6 seconds
  };
  
  const stopSimulation = () => {
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
      simulationInterval.current = null;
    }
    setSimulationActive(false);
  };
  
  // Handle token update
  const handleTokenUpdate = () => {
    setMapboxToken(getStoredMapboxToken());
  };
  
  // Initialize map on mount and when token changes
  useEffect(() => {
    initializeMap();
    
    // Clean up on unmount
    return () => {
      stopSimulation();
      
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
  
  return (
    <div className="relative w-full h-96 sm:h-[450px] rounded-lg overflow-hidden border border-border">
      {loading && <MapLoadingState />}
      
      {!loading && !mapError && (
        <MapTrackingControls 
          simulationActive={simulationActive}
          onStartSimulation={startSimulation}
        />
      )}
      
      {mapError && (
        <MapErrorState 
          mapError={mapError} 
          mapboxToken={mapboxToken}
          onTokenUpdate={handleTokenUpdate}
        />
      )}
      
      {map.current && (
        <MapRouteManager 
          map={map.current}
          caregiverPosition={caregiverPosition}
          destinationPosition={destination}
        />
      )}
      
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default LiveTrackingMap;
