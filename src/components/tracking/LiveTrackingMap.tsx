
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2 } from 'lucide-react';

// Temporary public token - in a real app, this would be stored in environment variables
// or fetched from a server-side API
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJja2h6MmdmODkweDJsMnJxcGV3ZHVnZGZlIn0.NE9aSc5G4PiDjCEX3z-JJg';

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
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const initializeMap = () => {
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [caregiverPosition.lng, caregiverPosition.lat],
        zoom: 13,
        pitch: 45,
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      map.current.on('load', () => {
        if (!map.current) return;
        
        // Add destination marker (static)
        new mapboxgl.Marker({ color: '#5C69D1' })
          .setLngLat([destination.lng, destination.lat])
          .addTo(map.current)
          .setPopup(new mapboxgl.Popup().setHTML('<p class="font-medium">Your Location</p>'));
        
        // Add caregiver marker (will be animated)
        caregiverMarker.current = new mapboxgl.Marker({ color: '#FF775A' })
          .setLngLat([caregiverPosition.lng, caregiverPosition.lat])
          .addTo(map.current)
          .setPopup(new mapboxgl.Popup().setHTML('<p class="font-medium">Your Caregiver</p>'));
        
        // Add route line between points
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
            'line-opacity': 0.7
          }
        });
        
        setLoading(false);
      });
    };
    
    initializeMap();
    
    // Simulate caregiver movement for demo
    let intervalId: NodeJS.Timeout;
    
    const startCaregiverMovement = () => {
      if (!map.current || !caregiverMarker.current) return;
      
      // Simple linear interpolation between caregiver and destination
      const steps = 100;
      let currentStep = 0;
      
      const deltaLng = (destination.lng - caregiverPosition.lng) / steps;
      const deltaLat = (destination.lat - caregiverPosition.lat) / steps;
      
      intervalId = setInterval(() => {
        if (currentStep < steps) {
          currentStep++;
          
          const newLng = caregiverPosition.lng + deltaLng * currentStep;
          const newLat = caregiverPosition.lat + deltaLat * currentStep;
          
          if (caregiverMarker.current) {
            caregiverMarker.current.setLngLat([newLng, newLat]);
          }
          
          // Update the route as the caregiver moves
          if (map.current && map.current.getSource('route')) {
            (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [newLng, newLat],
                  [destination.lng, destination.lat]
                ]
              }
            });
          }
        } else {
          clearInterval(intervalId);
        }
      }, 300);
    };
    
    // Start the movement animation after a short delay
    const animationTimer = setTimeout(() => {
      startCaregiverMovement();
    }, 2000);
    
    return () => {
      clearTimeout(animationTimer);
      clearInterval(intervalId);
      map.current?.remove();
    };
  }, [caregiverPosition, destination]);
  
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
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default LiveTrackingMap;
