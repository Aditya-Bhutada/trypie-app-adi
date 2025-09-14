import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting itinerary generation with Gemini");
    
    const { destination, duration, budget, preferences } = await req.json();
    console.log("Request data:", { destination, duration, budget, preferences });

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Create a comprehensive expert-level prompt for Gemini
    const prompt = `You are a professional local travel expert and certified travel planner specializing in ${destination}. Create an expertly crafted, detailed travel itinerary for ${destination} spanning ${duration} days with a budget of $${budget}.

Travel Preferences: ${preferences || 'Balanced mix of culture, sightseeing, and local experiences'}

As a local expert, provide insider knowledge and professional recommendations that only someone with deep local expertise would know.

Please provide the response in this EXACT JSON format:
{
  "title": "Expert ${duration}-Day ${destination} Itinerary",
  "days": [
    {
      "day": 1,
      "date": "Day 1",
      "title": "Professional day title reflecting the day's theme",
      "morning": "Expert morning recommendations with specific venues, exact timings (e.g., 9:00 AM), addresses, insider tips, and local secrets. Include why this timing is optimal and what locals do.",
      "afternoon": "Professional afternoon plan with precise locations, peak vs off-peak timing advice, hidden gems only locals know, transportation tips between venues, and cost estimates.",
      "evening": "Curated evening experience with specific restaurant recommendations, local dining customs, best times to arrive, how to get the best tables, and authentic local experiences."
    }
  ],
  "tripNotes": "Professional travel advisor notes including: seasonal considerations, local etiquette and customs, money-saving insider tips, what to pack specifically for this destination, local transportation hacks, emergency contacts, weather patterns, cultural sensitivities, and budget breakdown with local cost insights."
}

Expert Requirements - Write as if you're a seasoned local guide who:
✓ Lives in ${destination} and knows every hidden gem and local secret
✓ Understands optimal timing for attractions to avoid crowds
✓ Knows the best local restaurants, not just tourist spots
✓ Can provide specific addresses, opening hours, and exact costs
✓ Understands local transportation systems and the most efficient routes
✓ Knows cultural customs, tipping practices, and local etiquette
✓ Can recommend authentic local experiences over tourist traps
✓ Provides practical insider tips that save time and money
✓ Understands seasonal variations and weather considerations
✓ Knows the best photo spots and when lighting is optimal
✓ Can suggest local alternatives if main attractions are crowded

For each time period, provide:
- Exact venue names with addresses and neighborhoods
- Specific timing recommendations with reasoning
- Estimated costs in local currency and USD
- Insider tips only locals would know
- Transportation details between locations
- Alternative options for different weather/crowds
- Local dining recommendations with signature dishes
- Cultural context and historical significance
- Photography tips and best viewpoints
- Safety considerations and local customs

Make every recommendation sound knowledgeable, confident, and based on years of local expertise.`;

    console.log("Calling Gemini API...");
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Gemini response received");
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini response structure:', data);
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log("Generated text:", generatedText.substring(0, 200) + "...");

    // Try to extract JSON from the response
    let itineraryData;
    try {
      // Remove any markdown formatting
      const cleanedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      itineraryData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // If parsing fails, create a basic structure
      itineraryData = {
        title: `Trip to ${destination} - ${duration} Days`,
        days: Array.from({ length: parseInt(duration) || 3 }, (_, i) => ({
          day: i + 1,
          date: `Day ${i + 1}`,
          title: `Day ${i + 1} Activities`,
          morning: "Morning activities will be planned based on your preferences",
          afternoon: "Afternoon exploration and sightseeing",
          evening: "Evening dining and relaxation"
        })),
        tripNotes: generatedText // Include the full text as notes if JSON parsing fails
      };
    }

    console.log("Itinerary generated successfully");
    return new Response(JSON.stringify(itineraryData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-itinerary-gemini function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate itinerary',
      details: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});