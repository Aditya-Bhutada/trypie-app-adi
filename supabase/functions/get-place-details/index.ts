
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const googleMapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Currency mapping for common countries
const countryCurrencies: Record<string, string> = {
  'US': 'USD',
  'GB': 'GBP',
  'EU': 'EUR',
  'JP': 'JPY',
  'AU': 'AUD',
  'CA': 'CAD',
  // Add more as needed
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, placeId } = await req.json();
    
    let currency = 'USD'; // Default currency
    let countryCode = '';
    
    if (placeId) {
      // Get place details from Google Places API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,address_components&key=${googleMapsApiKey}`
      );
      
      const placeData = await response.json();
      
      if (placeData.result) {
        // Find the country code from address components
        const countryComponent = placeData.result.address_components?.find(
          (component: any) => component.types.includes('country')
        );
        
        if (countryComponent) {
          countryCode = countryComponent.short_name;
          currency = countryCurrencies[countryCode] || 'USD';
        }
      }
    }

    return new Response(
      JSON.stringify({
        currency,
        countryCode,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in get-place-details function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
