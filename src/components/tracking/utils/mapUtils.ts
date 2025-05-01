
// Initialize mapbox token
export const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbDZ2MDZ6dDYwNnljM2JwZXRydXlvdnBnIn0.boA9CJ9_IWvrIWlYxzDdGg';

export interface MapPosition {
  lng: number;
  lat: number;
}

export const getStoredMapboxToken = (): string => {
  return localStorage.getItem('mapbox_token') || DEFAULT_MAPBOX_TOKEN;
};

export const saveMapboxToken = (token: string): void => {
  localStorage.setItem('mapbox_token', token);
};

// Calculate map bounds to show both markers
export const calculateMapBounds = (
  position1: MapPosition,
  position2: MapPosition
): [[number, number], [number, number]] => {
  const bounds: [[number, number], [number, number]] = [
    [Math.min(position1.lng, position2.lng), Math.min(position1.lat, position2.lat)],
    [Math.max(position1.lng, position2.lng), Math.max(position1.lat, position2.lat)]
  ];
  return bounds;
};
