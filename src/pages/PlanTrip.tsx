
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import TripPlanningContent from "@/components/trip/TripPlanningContent";
import { useTripPlanner } from "@/hooks/use-trip-planner";
import { Button } from "@/components/ui/button";
import { CalendarCheck } from "lucide-react";

const PlanTrip = () => {
  const [activeTab, setActiveTab] = useState("details");
  const {
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
    setSelectedPlaceId,
    generateItinerary,
    currency
  } = useTripPlanner();

  // Handle place selection from Google Maps
  const handlePlaceSelect = (placeId: string) => {
    setSelectedPlaceId(placeId);
    console.log("Selected place ID:", placeId);
  };

  // Auto-switch to itinerary tab when generated
  useEffect(() => {
    if ((itinerary || itineraryText || itineraryJson) && activeTab === "details" && !isGenerating) {
      setActiveTab("itinerary");
    }
  }, [itinerary, itineraryText, itineraryJson, isGenerating, activeTab]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          {/* Long Weekend Banner */}
          <div className="mb-6 bg-white p-4 border rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-lg font-semibold flex items-center text-trypie-700">
                  <CalendarCheck className="mr-2 h-5 w-5 text-trypie-600" />
                  Planning around holidays?
                </h2>
                <p className="text-gray-600">
                  Check out our 2025 Long Weekends & Holiday Calendar to plan your trips around public holidays!
                </p>
              </div>
              <Button variant="outline" asChild className="border-trypie-500 text-trypie-600">
                <Link to="/long-weekends">View Holiday Calendar</Link>
              </Button>
            </div>
          </div>
          
          <TripPlanningContent
            destination={destination}
            setDestination={setDestination}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            budget={budget}
            setBudget={setBudget}
            groupSize={groupSize}
            setGroupSize={setGroupSize}
            preferences={preferences}
            setPreferences={setPreferences}
            accommodation={accommodation}
            setAccommodation={setAccommodation}
            notes={notes}
            setNotes={setNotes}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isGenerating={isGenerating}
            itinerary={itinerary}
            itineraryText={itineraryText}
            itineraryJson={itineraryJson}
            error={error}
            errorType={errorType}
            generateItinerary={generateItinerary}
            onPlaceSelect={handlePlaceSelect}
            currency={currency}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PlanTrip;
