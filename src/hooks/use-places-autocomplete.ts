
import { useState, useEffect, useRef, useCallback } from 'react';
import { GOOGLE_MAPS_CONFIG, validateGoogleMapsApiKey } from '@/config/google-maps';

// Enhanced type definitions
export interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types?: string[];
  terms?: { value: string }[];
}

interface UsePlacesAutocompleteProps {
  filterTypes?: string[];
  debounceMs?: number;
}

interface PlacesAutocompleteState {
  predictions: PlacePrediction[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

// Default empty state
const DEFAULT_STATE: PlacesAutocompleteState = {
  predictions: [],
  loading: false,
  error: null,
  initialized: false
};

export function usePlacesAutocomplete({ 
  filterTypes,
  debounceMs = GOOGLE_MAPS_CONFIG.debounceMs 
}: UsePlacesAutocompleteProps = {}) {
  const [state, setState] = useState<PlacesAutocompleteState>({ ...DEFAULT_STATE });

  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);
  const initAttempts = useRef(0);
  const maxInitAttempts = 5;

  // Track mounted state to prevent state updates after unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Initialize the autocomplete service
  useEffect(() => {
    const initService = () => {
      try {
        // Check if the Google Maps API key is available
        validateGoogleMapsApiKey();
        
        // Check if the Google Maps API is loaded
        if (!window.google?.maps?.places) {
          // Increment init attempts
          initAttempts.current += 1;
          
          if (initAttempts.current >= maxInitAttempts) {
            if (isMounted.current) {
              setState(prev => ({ 
                ...prev, 
                error: 'Failed to initialize Google Places API after multiple attempts',
                initialized: false,
                predictions: [] 
              }));
            }
            return false;
          }
          
          return false;
        }
        
        // Initialize the service
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        createNewSessionToken();
        
        if (isMounted.current) {
          setState(prev => ({ ...prev, initialized: true, error: null }));
        }
        
        console.log("Google Places Autocomplete service initialized successfully");
        return true;
      } catch (error) {
        if (isMounted.current) {
          setState(prev => ({ 
            ...prev, 
            error: error instanceof Error ? error.message : 'Failed to initialize Places service',
            initialized: false,
            predictions: [] 
          }));
        }
        console.error("Error initializing Places Autocomplete:", error);
      }
      return false;
    };

    if (!initService()) {
      const checkInterval = setInterval(() => {
        if (initService() || !isMounted.current || initAttempts.current >= maxInitAttempts) {
          clearInterval(checkInterval);
        }
      }, 300);

      return () => clearInterval(checkInterval);
    }
  }, []);

  const createNewSessionToken = useCallback(() => {
    try {
      if (window.google?.maps?.places) {
        sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
        console.log("New session token created");
      }
    } catch (error) {
      console.error('Error creating session token:', error);
    }
  }, []);

  const fetchPredictions = useCallback((input: string) => {
    // Early return if not initialized or input is empty
    if (!state.initialized || !autocompleteService.current || !input?.trim()) {
      if (isMounted.current) {
        setState(prev => ({ ...prev, predictions: [], loading: false }));
      }
      return;
    }

    if (isMounted.current) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }

    console.log('Fetching predictions for input:', input);

    const options: google.maps.places.AutocompletionRequest = {
      input: input.trim(),
      sessionToken: sessionToken.current,
      ...(filterTypes?.length ? { types: filterTypes } : {})
    };

    try {
      autocompleteService.current.getPlacePredictions(
        options,
        (results: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
          if (!isMounted.current) return;

          console.log('Places API response status:', status);
          
          // Guard against undefinedness of results
          const safeResults = Array.isArray(results) ? results : [];
          console.log(`Received ${safeResults.length} predictions`);
          
          if (status === google.maps.places.PlacesServiceStatus.OK && Array.isArray(results)) {
            setState(prev => ({
              ...prev,
              predictions: safeResults,
              loading: false,
              error: null
            }));
          } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setState(prev => ({
              ...prev,
              predictions: [],
              loading: false,
              error: null
            }));
          } else {
            console.error('Places API error:', status);
            setState(prev => ({
              ...prev,
              predictions: [],
              loading: false,
              error: `Places API error: ${status}`
            }));
          }
        }
      );
    } catch (error) {
      console.error('Exception in fetchPredictions:', error);
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          predictions: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch predictions'
        }));
      }
    }
  }, [filterTypes, state.initialized]);

  const debouncedFetch = useCallback((input: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchPredictions(input);
    }, debounceMs);
  }, [fetchPredictions, debounceMs]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Ensure we always return an array for predictions, even if state gets corrupted somehow
  return {
    predictions: Array.isArray(state.predictions) ? state.predictions : [],
    loading: state.loading,
    error: state.error,
    debouncedFetch,
    createNewSessionToken,
  };
}
