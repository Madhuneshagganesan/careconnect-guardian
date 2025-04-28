
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2 } from 'lucide-react';

// Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbDZ2MDZ6dDYwNnljM2JwZXRydXlvdnBnIn0.boA9CJ9_IWvrIWlYxzDdGg';

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
  
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Set mapbox token
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [caregiverPosition.lng, caregiverPosition.lat],
      zoom: 13,
    });
    
    // Add navigation controls (zoom in/out, rotate)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // When map loads, add markers and route
    map.current.on('load', () => {
      if (!map.current) return;
      
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
    });
    
    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
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
