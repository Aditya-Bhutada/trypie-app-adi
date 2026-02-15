import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, chatHistory = [] } = await req.json();
    
    if (!message) throw new Error("No message provided");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Format chat history for OpenAI-compatible API
    const messages: { role: string; content: string }[] = [];

    // Build system prompt based on context
    let systemPrompt = "";
    const groupTripIntents = ["create a group trip", "plan a group trip", "start a group trip", "make a group trip", "organize a group trip"];
    const isGroupTripIntent = groupTripIntents.some(intent => message.toLowerCase().includes(intent));

    if (isGroupTripIntent) {
      systemPrompt = `The user wants to create a group trip. Respond with a VERY SHORT message asking ONLY for the destination. Just ask "Where would you like to go for your group trip?" Nothing more.`;
    } else if (chatHistory.length > 0 && chatHistory[chatHistory.length - 2]?.content?.includes("Where would you like to go for your group trip?")) {
      systemPrompt = `The user has provided a destination. Now respond with a VERY SHORT message asking ONLY about the dates: "When are you planning to travel?" Nothing more.`;
    } else if (chatHistory.length > 0 && chatHistory[chatHistory.length - 2]?.content?.includes("When are you planning to travel?")) {
      systemPrompt = `The user has provided travel dates. Now respond with a VERY SHORT message asking ONLY about group size: "How many people will be in your group?" Nothing more.`;
    } else if (chatHistory.length > 0 && chatHistory[chatHistory.length - 2]?.content?.includes("How many people will be in your group?")) {
      systemPrompt = `The user has provided group size. Respond with a VERY SHORT confirmation and a call to action: "Great! Click below to create your group trip:" followed by a link to /groups`;
    } else {
      systemPrompt = `As TrypieBuddy, a friendly travel assistant for Trypie:
- Keep responses very brief with 1-2 short paragraphs max
- Break long text into bullet points
- Mention app features with the appropriate links (/plan-trip for trip planning, /groups for group travel, /explore for destination exploration, /rewards for rewards info)
- Be enthusiastic but concise
- Format answers with clear headings when needed
- Suggest actionable next steps`;
    }

    messages.push({ role: "system", content: systemPrompt });

    // Add chat history
    for (const msg of chatHistory) {
      messages.push({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content
      });
    }

    messages.push({ role: "user", content: message });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 0.4,
        max_tokens: 1024,
      })
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("AI Gateway error:", responseData);
      throw new Error(`AI Gateway error: ${responseData.error?.message || "Unknown error"}`);
    }

    const generatedText = responseData.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response at this time.";

    return new Response(
      JSON.stringify({ response: generatedText, success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in chat-with-gemini function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred", success: false }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
