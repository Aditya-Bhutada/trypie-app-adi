
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, chatHistory = [] } = await req.json();
    
    console.log("Received request:", { message, chatHistoryLength: chatHistory.length });

    if (!message) {
      throw new Error("No message provided");
    }

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Format chat history for Gemini API
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.isUser ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Special handling for group trip creation intent
    let userMessage = message;
    let customPrompt = "";
    
    const groupTripIntents = [
      "create a group trip",
      "plan a group trip",
      "start a group trip",
      "make a group trip",
      "organize a group trip"
    ];
    
    const isGroupTripIntent = groupTripIntents.some(intent => 
      message.toLowerCase().includes(intent.toLowerCase())
    );

    if (isGroupTripIntent) {
      customPrompt = `The user wants to create a group trip. Respond with a VERY SHORT message asking ONLY for the destination. Don't explain anything else yet. Just ask "Where would you like to go for your group trip?" Nothing more.`;
    } else if (chatHistory.length > 0 && chatHistory[chatHistory.length - 2]?.content?.includes("Where would you like to go for your group trip?")) {
      // This is the destination response
      customPrompt = `The user has provided a destination: "${message}". Now respond with a VERY SHORT message asking ONLY about the dates: "When are you planning to travel?" Nothing more.`;
    } else if (chatHistory.length > 0 && chatHistory[chatHistory.length - 2]?.content?.includes("When are you planning to travel?")) {
      // This is the dates response
      customPrompt = `The user has provided travel dates: "${message}". Now respond with a VERY SHORT message asking ONLY about group size: "How many people will be in your group?" Nothing more.`;
    } else if (chatHistory.length > 0 && chatHistory[chatHistory.length - 2]?.content?.includes("How many people will be in your group?")) {
      // This is the group size response
      customPrompt = `The user has provided group size: "${message}". Respond with a VERY SHORT confirmation and a call to action: "Great! Click below to create your group trip:" followed by a link to /groups using the format /groups`;
    } else {
      // Default system prompt
      customPrompt = `As TrypieBuddy, a friendly travel assistant for Trypie:
      - Keep responses very brief with 1-2 short paragraphs max
      - Break long text into bullet points
      - Mention app features with the appropriate links (/plan-trip for trip planning, /groups for group travel, /explore for destination exploration, /rewards for rewards info)
      - Be enthusiastic but concise
      - Format answers with clear headings when needed
      - Suggest actionable next steps`;
    }

    // Add prompt instructions to the first message
    if (customPrompt) {
      userMessage = `${customPrompt}\n\nUser message: ${message}`;
    }

    // Create the messages array
    const messages = formattedHistory.concat([
      { role: "user", parts: [{ text: userMessage }] }
    ]);

    // Updated API endpoint for Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.4, // Lower temperature for more focused responses
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    const responseData = await response.json();
    
    console.log("Gemini API response status:", response.status);
    
    // Check for API errors
    if (!response.ok) {
      console.error("Gemini API error:", responseData);
      throw new Error(`Gemini API error: ${responseData.error?.message || "Unknown error"}`);
    }

    // Extract the generated text from the response
    const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response at this time.";

    return new Response(
      JSON.stringify({ 
        response: generatedText,
        success: true
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Error in chat-with-gemini function:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred while processing your request",
        success: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
