
import { useState, useEffect } from 'react';
import { GOOGLE_MAPS_CONFIG } from '@/config/google-maps';

export const useGoogleMapsScript = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    const handleLoad = () => setIsLoaded(true);
    const handleError = () => setError('Failed to load Google Maps script');

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
      document.head.removeChild(script);
    };
  }, []);

  return { isLoaded, error };
};
