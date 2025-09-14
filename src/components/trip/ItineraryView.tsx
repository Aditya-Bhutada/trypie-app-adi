
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, Users, Calendar, DollarSign } from "lucide-react";
import { TripItinerary, N8nTripResponse } from "@/types/trip-types";
import TextItineraryDisplay from "./TextItineraryDisplay";
import StructuredItineraryDisplay from "./StructuredItineraryDisplay";

interface ItineraryViewProps {
  itinerary: TripItinerary | null;
  itineraryText?: string | null;
  itineraryJson?: N8nTripResponse | null;
  budget: number;
  groupSize: string;
  handleEditDetails: () => void;
  currency?: string;
  destination: string;
}

const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  itineraryText,
  itineraryJson,
  budget,
  groupSize,
  handleEditDetails,
  currency = "USD",
  destination,
}) => {
  // Priority 1: If we have structured JSON from n8n, display it using StructuredItineraryDisplay
  if (itineraryJson) {
    return (
      <div className="space-y-6">
        {/* Trip Summary Header */}
        <Card className="bg-gradient-to-r from-trypie-600 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <MapPin className="mr-3" size={28} />
              Your Trip to {destination}
            </CardTitle>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Users className="mr-2" size={16} />
                {groupSize} {parseInt(groupSize) === 1 ? 'traveler' : 'travelers'}
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2" size={16} />
                Budget: {currency} {budget.toLocaleString()}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleEditDetails} variant="outline" className="flex items-center">
            <Edit className="mr-2" size={16} />
            Edit Details
          </Button>
        </div>

        {/* Display the structured JSON itinerary */}
        <StructuredItineraryDisplay itineraryData={itineraryJson} />
      </div>
    );
  }

  // Priority 2: If we have itineraryText (plain text from webhook), display it using TextItineraryDisplay
  if (itineraryText) {
    return (
      <div className="space-y-6">
        {/* Trip Summary Header */}
        <Card className="bg-gradient-to-r from-trypie-600 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <MapPin className="mr-3" size={28} />
              Your Trip to {destination}
            </CardTitle>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Users className="mr-2" size={16} />
                {groupSize} {parseInt(groupSize) === 1 ? 'traveler' : 'travelers'}
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2" size={16} />
                Budget: {currency} {budget.toLocaleString()}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleEditDetails} variant="outline" className="flex items-center">
            <Edit className="mr-2" size={16} />
            Edit Details
          </Button>
        </div>

        {/* Display the text-based itinerary */}
        <TextItineraryDisplay itineraryText={itineraryText} />
      </div>
    );
  }

  // Priority 3: Fallback for legacy structured itinerary (if any legacy data exists)
  if (itinerary && itinerary.days && itinerary.days.length > 0) {
    return (
      <div className="space-y-6">
        {/* Trip Summary Header */}
        <Card className="bg-gradient-to-r from-trypie-600 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <MapPin className="mr-3" size={28} />
              Your Trip to {destination}
            </CardTitle>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Users className="mr-2" size={16} />
                {groupSize} {parseInt(groupSize) === 1 ? 'traveler' : 'travelers'}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2" size={16} />
                {itinerary.days.length} {itinerary.days.length === 1 ? 'day' : 'days'}
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2" size={16} />
                Budget: {currency} {budget.toLocaleString()}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleEditDetails} variant="outline" className="flex items-center">
            <Edit className="mr-2" size={16} />
            Edit Details
          </Button>
        </div>

        {/* Display basic structured itinerary */}
        <div className="space-y-4">
          {itinerary.days.map((day, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Day {day.day} - {day.date.toLocaleDateString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {day.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="border-l-2 border-trypie-500 pl-4">
                      <div className="font-medium">{activity.time} - {activity.name}</div>
                      <div className="text-gray-600">{activity.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // No itinerary available
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">No itinerary data available</p>
      <Button onClick={handleEditDetails} className="mt-4">
        Go back to trip details
      </Button>
    </div>
  );
};

export default ItineraryView;
