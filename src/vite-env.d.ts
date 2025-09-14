
/// <reference types="vite/client" />

declare module '*.glb' {
  const src: string;
  export default src;
}

// Google Maps API types
interface Window {
  google: typeof google;
}

declare namespace google {
  namespace maps {
    namespace places {
      class AutocompleteService {
        getPlacePredictions(
          request: AutocompletionRequest,
          callback: (predictions: AutocompletePrediction[] | null, status: PlacesServiceStatus) => void
        ): void;
      }

      class AutocompleteSessionToken {}

      interface AutocompletePrediction {
        place_id: string;
        description: string;
        structured_formatting: {
          main_text: string;
          secondary_text: string;
        };
        types?: string[];
        terms?: { value: string }[];
      }

      interface AutocompletionRequest {
        input: string;
        sessionToken?: AutocompleteSessionToken;
        types?: string[];
      }

      enum PlacesServiceStatus {
        OK = 'OK',
        ZERO_RESULTS = 'ZERO_RESULTS',
        OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
        REQUEST_DENIED = 'REQUEST_DENIED',
        INVALID_REQUEST = 'INVALID_REQUEST',
        UNKNOWN_ERROR = 'UNKNOWN_ERROR'
      }
    }
  }
}
