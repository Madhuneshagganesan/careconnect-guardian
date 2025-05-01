import React, { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapPosition } from './utils/mapUtils';

interface MapRouteManagerProps {
  map: mapboxgl.Map | null;
  caregiverPosition: MapPosition;
  destinationPosition: MapPosition;
}

const MapRouteManager: React.FC<MapRouteManagerProps> = ({
  map,
  caregiverPosition,
  destinationPosition
}) => {
  // This is just a utility component that doesn't render anything visible
  // It handles the route line between caregiver and destination

  const routeAdded = useRef(false);

  React.useEffect(() => {
    if (!map) return;

    // Add or update the route line
    const addRouteLine = () => {
      if (!map) return;
      
      // Remove existing route if it exists
      if (routeAdded.current) {
        try {
          map.removeLayer('route');
          map.removeSource('route');
          routeAdded.current = false;
        } catch (err) {
          console.error("Error removing existing route:", err);
        }
      }
      
      try {
        // Add the updated route
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [caregiverPosition.lng, caregiverPosition.lat],
                [destinationPosition.lng, destinationPosition.lat]
              ]
            }
          }
        });
        
        // Add the route line layer
        map.addLayer({
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
        
        routeAdded.current = true;
      } catch (err) {
        console.error("Error adding route:", err);
      }
    };

    // If the map is loaded, add the route
    if (map.isStyleLoaded()) {
      addRouteLine();
    } else {
      // Otherwise wait for the style to load
      map.on('style.load', addRouteLine);
    }

    return () => {
      // Clean up
      if (map && routeAdded.current) {
        try {
          map.off('style.load', addRouteLine);
          if (map.getLayer('route')) map.removeLayer('route');
          if (map.getSource('route')) map.removeSource('route');
        } catch (err) {
          console.error("Error during route cleanup:", err);
        }
      }
    };
  }, [map, caregiverPosition, destinationPosition]);

  return null; // This component doesn't render anything visible
};

export default MapRouteManager;
