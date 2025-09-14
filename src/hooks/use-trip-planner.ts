
// Decomposed hook: delegates logic to smaller dedicated hooks/modules.

import { useState } from "react";
import { useBudgetByLocation } from "./use-budget-by-location";
import { useCurrencyByPlace } from "./use-currency-by-place";
import { useTripItineraryGeneration } from "./use-trip-itinerary-generation";

export const useTripPlanner = () => {
  // Top-level state for all trip fields
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [groupSize, setGroupSize] = useState("1");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [accommodation, setAccommodation] = useState("hotel");
  const [notes, setNotes] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  // Budget by location
  const [budget, setBudget] = useBudgetByLocation(destination);

  // Currency detection logic
  const { currency, setCurrency, fetchCurrency } = useCurrencyByPlace();

  // Itinerary generation and error state
  const {
    isGenerating,
    itinerary,
    itineraryText,
    itineraryJson,
    error,
    errorType,
    generateItinerary: baseGenerateItinerary,
    setError
  } = useTripItineraryGeneration();

  // Wrapper for generateItinerary: fetch currency if needed, then generate
  const generateItinerary = async () => {
    // Determine currency before generating itinerary
    const currencyCode = await fetchCurrency(destination, selectedPlaceId);

    await baseGenerateItinerary({
      destination,
      startDate,
      endDate,
      budget,
      groupSize,
      preferences,
      accommodation,
      notes,
      selectedPlaceId,
      currency: currencyCode
    });
  };

  return {
    destination,
    setDestination,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    budget,
    setBudget,
    groupSize,
    setGroupSize,
    preferences,
    setPreferences,
    accommodation,
    setAccommodation,
    notes,
    setNotes,
    isGenerating,
    itinerary,
    itineraryText,
    itineraryJson,
    error,
    errorType,
    selectedPlaceId,
    setSelectedPlaceId,
    generateItinerary,
    currency,
    setError,
  };
};
