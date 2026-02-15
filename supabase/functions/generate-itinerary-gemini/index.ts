import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting itinerary generation with Lovable AI");

    const { destination, duration, budget, preferences } = await req.json();
    console.log("Request data:", { destination, duration, budget, preferences });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const prompt = `You are a professional local travel expert and certified travel planner specializing in ${destination}. Create an expertly crafted, detailed travel itinerary for ${destination} spanning ${duration} days with a budget of $${budget}.

Travel Preferences: ${preferences || 'Balanced mix of culture, sightseeing, and local experiences'}

Please provide the response in this EXACT JSON format (no markdown, no code fences, just raw JSON):
{
  "title": "Expert ${duration}-Day ${destination} Itinerary",
  "days": [
    {
      "day": 1,
      "date": "Day 1",
      "title": "Day title reflecting the theme",
      "morning": "Morning recommendations with specific venues, timings, addresses, insider tips.",
      "afternoon": "Afternoon plan with precise locations, hidden gems, transportation tips, cost estimates.",
      "evening": "Evening experience with restaurant recommendations, local dining customs, authentic experiences."
    }
  ],
  "tripNotes": "Professional travel notes including seasonal considerations, local etiquette, money-saving tips, packing advice, transportation hacks, and budget breakdown."
}

For each time period provide: exact venue names, specific timing, estimated costs in local currency and USD, insider tips, transportation details, and alternative options.`;

    console.log("Calling Lovable AI Gateway...");

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: 'You are a travel planning expert. Always respond with valid JSON only, no markdown formatting.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI Gateway response received");

    const generatedText = data.choices?.[0]?.message?.content;
    if (!generatedText) {
      throw new Error('No content in AI response');
    }

    console.log("Generated text preview:", generatedText.substring(0, 200));

    let itineraryData;
    try {
      const cleanedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      itineraryData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      itineraryData = {
        title: `Trip to ${destination} - ${duration} Days`,
        days: Array.from({ length: parseInt(duration) || 3 }, (_, i) => ({
          day: i + 1,
          date: `Day ${i + 1}`,
          title: `Day ${i + 1} Activities`,
          morning: "Morning activities planned based on your preferences",
          afternoon: "Afternoon exploration and sightseeing",
          evening: "Evening dining and relaxation"
        })),
        tripNotes: generatedText
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
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
