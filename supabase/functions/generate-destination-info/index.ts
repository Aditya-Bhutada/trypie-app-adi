import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const googleMapsApiKey = 'AIzaSyAWotZP39tG3GrmpLsu9OX2xdcJ_pYZ1QA';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination } = await req.json();
    
    if (!destination) {
      return new Response(
        JSON.stringify({ error: "Missing destination parameter" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log(`Generating information about ${destination}`);
    
    // Get Google Places images
    let placeImages: string[] = [];
    if (googleMapsApiKey) {
      try {
        const encodedDestination = encodeURIComponent(destination);
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodedDestination}&inputtype=textquery&fields=formatted_address,geometry,name,place_id,photos&key=${googleMapsApiKey}`
        );
        const placeData = await response.json();
        
        if (placeData.candidates?.[0]?.place_id) {
          const detailsResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeData.candidates[0].place_id}&fields=photos&key=${googleMapsApiKey}`
          );
          const detailsData = await detailsResponse.json();
          
          if (detailsData.result?.photos) {
            placeImages = detailsData.result.photos
              .slice(0, 3)
              .map((photo: any) => 
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${googleMapsApiKey}`
              );
          }
        }
      } catch (error) {
        console.error("Error fetching Google Places data:", error);
      }
    }

    const prompt = `Provide detailed information about ${destination} as a travel destination.
Format your output as JSON with these keys:
{
  "name": "Full name of the destination",
  "description": "Detailed description paragraph",
  "highlights": [{"name": "Name", "description": "Brief description"}],
  "bestTimeToVisit": "Season recommendations",
  "localCuisine": [{"dish": "Dish name", "description": "Brief description"}],
  "travelTips": ["Tip 1", "Tip 2"],
  "images": []
}
Include 5-8 highlights, 3-5 dishes, and 4-6 tips. Return ONLY valid JSON, no markdown.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 4096,
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`AI Gateway error: ${data.error?.message || "Unknown error"}`);
    }

    let generatedText = data.choices?.[0]?.message?.content || '';
    
    // Clean JSON from markdown fences
    generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let destinationData;
    try {
      destinationData = JSON.parse(generatedText);
      if (placeImages.length > 0) {
        destinationData.images = placeImages;
      } else if (!destinationData.images?.length) {
        destinationData.images = [
          `https://source.unsplash.com/featured/?${encodeURIComponent(destination)},landmark`,
          `https://source.unsplash.com/featured/?${encodeURIComponent(destination)},travel`,
        ];
      }
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      destinationData = {
        name: destination,
        description: `Discover the wonders of ${destination}.`,
        highlights: [{ name: "Local attractions", description: "Experience the best sights." }],
        bestTimeToVisit: "Year-round.",
        localCuisine: [{ dish: "Local specialties", description: "Try the signature dishes." }],
        travelTips: ["Research local customs before visiting"],
        images: placeImages.length > 0 ? placeImages : [
          `https://source.unsplash.com/featured/?${encodeURIComponent(destination)},landmark`,
        ]
      };
    }

    return new Response(JSON.stringify(destinationData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in generate-destination-info:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
