export const GOOGLE_MAPS_CONFIG = {
  apiKey: "AIzaSyBOB0gTJOG4aMcfYW_AzzhHvx5w_6hzWH4", // Public API key, okay to be in frontend
  libraries: ["places"],
  debounceMs: 300
};

/**
 * Validates if the Google Maps API key is available
 */
export function validateGoogleMapsApiKey() {
  const apiKey = GOOGLE_MAPS_CONFIG.apiKey;
  
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    throw new Error('Google Maps API key is missing or invalid');
  }
  
  // Also check if window.google exists when running in browser
  if (typeof window !== 'undefined' && (!window.google || !window.google.maps)) {
    console.warn('Google Maps API not loaded yet. This might be expected during initialization.');
  }
  
  return apiKey;
}
