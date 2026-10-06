import { useState } from 'react';

interface GeolocationState {
  location: { lat: number; lng: number; address: string } | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: false,
  });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser.',
        loading: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Mock address generation for demo
          const mockAddresses = [
            "123 Main Street, Downtown",
            "456 Oak Avenue, City Center", 
            "789 Pine Road, Residential Area",
            "321 Elm Street, Business District",
            "654 Maple Drive, Suburb Area"
          ];
          
          const address = mockAddresses[Math.floor(Math.random() * mockAddresses.length)] + 
                         ` (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

          setState({
            location: { lat: latitude, lng: longitude, address },
            error: null,
            loading: false,
          });
        } catch (error) {
          setState({
            location: { lat: latitude, lng: longitude, address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` },
            error: null,
            loading: false,
          });
        }
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error: `Location access denied: ${error.message}`,
          loading: false,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return {
    ...state,
    getCurrentLocation,
  };
};