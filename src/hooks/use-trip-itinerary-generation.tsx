import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TripItinerary, N8nTripResponse, TripDay, TripActivity } from "@/types/trip-types";

type ItineraryInput = {
  destination: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  budget: number;
  groupSize: string;
  preferences: string[];
  accommodation: string;
  notes: string;
  selectedPlaceId: string | null;
  currency: string;
};

type UseItineraryGenReturn = {
  isGenerating: boolean;
  itinerary: TripItinerary | null;
  itineraryText: string | null;
  itineraryJson: N8nTripResponse | null;
  error: string | null;
  errorType: string | null;
  generateItinerary: (input: ItineraryInput) => Promise<void>;
  setError: (val: string | null) => void;
};

// Interface to match Gemini response format
interface GeminiResponse {
  title: string;
  days: Array<{
    day: number;
    date: string;
    title: string;
    morning: string;
    afternoon: string;
    evening: string;
  }>;
  tripNotes?: string;
}

const parseActivityText = (text: string, timePrefix: string): TripActivity[] => {
  if (!text) return [];
  
  // Split by common delimiters and filter out empty entries
  const activities = text
    .split(/(?:\d+\.\s*|\n-\s*|\n\*\s*|•\s*)/)
    .filter(activity => activity.trim().length > 0)
    .map(activity => activity.trim());
  
  // Convert to TripActivity format
  return activities.map((activity, index) => ({
    time: `${timePrefix}:${(index * 30).toString().padStart(2, '0')}`,
    name: activity.substring(0, 50),
    description: activity,
    type: 'Sightseeing',
    location: ''
  }));
};

const convertGeminiResponseToTripItinerary = (geminiResponse: GeminiResponse, startDate: Date): TripItinerary => {
  const days: TripDay[] = geminiResponse.days.map((day, index) => {
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + index);
    
    const activities: TripActivity[] = [
      ...parseActivityText(day.morning, '09'),
      ...parseActivityText(day.afternoon, '13'),
      ...parseActivityText(day.evening, '18')
    ];

    return {
      day: day.day,
      date: dayDate,
      activities
    };
  });

  return {
    destination: geminiResponse.title.split(' - ')[0] || 'Destination',
    dates: {
      start: startDate,
      end: new Date(startDate.getTime() + (geminiResponse.days.length - 1) * 24 * 60 * 60 * 1000)
    },
    days,
    summary: geminiResponse.tripNotes,
    highlights: []
  };
};

export function useTripItineraryGeneration(): UseItineraryGenReturn {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [itineraryText, setItineraryText] = useState<string | null>(null);
  const [itineraryJson, setItineraryJson] = useState<N8nTripResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  const generateItinerary = async ({
    destination,
    startDate,
    endDate,
    budget,
    groupSize,
    preferences,
    accommodation,
    notes,
    selectedPlaceId,
    currency,
  }: ItineraryInput) => {
    if (!destination || !startDate || !endDate) {
      toast({
        title: "Missing information",
        description: "Please fill in destination and dates to generate an itinerary.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    setErrorType(null);
    
    // Clear all previous state
    setItinerary(null);
    setItineraryText(null);
    setItineraryJson(null);

    try {
      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      console.log("Generating itinerary with Gemini for:", { destination, duration, budget });
      
      // Call Gemini edge function
      const { data, error: functionError } = await supabase.functions.invoke('generate-itinerary-gemini', {
        body: {
          destination,
          duration,
          budget,
          preferences: preferences.join(', '),
        },
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to generate itinerary');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      console.log("Received Gemini response:", data);
      
      // Convert Gemini response to our internal format
      const convertedItinerary = convertGeminiResponseToTripItinerary(data, startDate);
      console.log("Converted itinerary:", convertedItinerary);
      
      setItinerary(convertedItinerary);
      setItineraryJson(data); // Store raw response as well
      
      toast({
        title: "Itinerary generated!",
        description: `Your personalized trip to ${destination} is ready to view.`,
      });
      
    } catch (error) {
      console.error("Error generating itinerary:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate itinerary";
      setError(errorMessage);
      setErrorType('generation');
      
      toast({
        title: "Error generating itinerary",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    itinerary,
    itineraryText,
    itineraryJson,
    error,
    errorType,
    generateItinerary,
    setError,
  };
}