
import { Loader2, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TripDetailsForm from "./TripDetailsForm";
import ItineraryView from "./ItineraryView";
import { TripItinerary, N8nTripResponse } from "@/types/trip-types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TripPlanningContentProps {
  destination: string;
  setDestination: (value: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  budget: number;
  setBudget: (value: number) => void;
  groupSize: string;
  setGroupSize: (value: string) => void;
  preferences: string[];
  setPreferences: (value: string[]) => void;
  accommodation: string;
  setAccommodation: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  isGenerating: boolean;
  itinerary: TripItinerary | null;
  itineraryText?: string | null;
  itineraryJson?: N8nTripResponse | null;
  error: string | null;
  errorType?: string | null;
  generateItinerary: () => void;
  onPlaceSelect: (placeId: string) => void;
  currency?: string;
}

const TripPlanningContent = ({
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
  activeTab,
  setActiveTab,
  isGenerating,
  itinerary,
  itineraryText,
  itineraryJson,
  error,
  errorType,
  generateItinerary,
  onPlaceSelect,
  currency
}: TripPlanningContentProps) => {
  // Check if form is complete to enable the button
  const isFormComplete = Boolean(destination && startDate && endDate);
  
  // Helper function to determine if error is service-related
  const isServiceError = errorType === 'service' || errorType === 'api' || error?.includes('service');
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <MapPin className="mr-2 text-trypie-500" size={24} />
          Plan Your Perfect Trip
        </h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Trip Details</TabsTrigger>
            <TabsTrigger value="itinerary" disabled={!itinerary && !itineraryText && !itineraryJson && !isGenerating}>Generated Itinerary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error}
                  {isServiceError && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 mb-2">
                        {errorType === 'service' ? 
                          'Our itinerary service is returning HTML instead of JSON data. This typically means there\'s an authentication issue or the service is experiencing disruptions.' :
                          'Our itinerary service might be experiencing technical difficulties. Please try again later or try with a different destination.'
                        }
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => generateItinerary()}
                        className="mt-1"
                      >
                        Try again
                      </Button>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            <TripDetailsForm
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
              generateItinerary={generateItinerary}
              isGenerating={isGenerating}
              onPlaceSelect={onPlaceSelect}
              currency={currency}
              isFormComplete={isFormComplete}
            />
          </TabsContent>
          
          <TabsContent value="itinerary" className="mt-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-trypie-500 animate-spin mb-4" />
                <h3 className="text-lg font-medium mb-2">Creating your perfect itinerary...</h3>
                <p className="text-gray-500 text-center max-w-md">
                  We're generating a personalized travel plan for your trip to {destination}.
                  This may take a minute.
                </p>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Failed to generate itinerary</AlertTitle>
                <AlertDescription>
                  {error}
                  <div className="mt-2">
                    <button 
                      className="text-red-600 underline"
                      onClick={() => setActiveTab("details")}
                    >
                      Go back and try again
                    </button>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <ItineraryView
                itinerary={itinerary}
                itineraryText={itineraryText}
                itineraryJson={itineraryJson}
                budget={budget}
                groupSize={groupSize}
                handleEditDetails={() => setActiveTab("details")}
                currency={currency}
                destination={destination}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TripPlanningContent;
