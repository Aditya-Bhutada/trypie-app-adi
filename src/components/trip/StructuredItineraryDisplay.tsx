
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Utensils, Camera, ShoppingBag } from "lucide-react";
import { N8nTripResponse } from "@/types/trip-types";

interface StructuredItineraryDisplayProps {
  itineraryData: N8nTripResponse;
}

const StructuredItineraryDisplay: React.FC<StructuredItineraryDisplayProps> = ({ 
  itineraryData 
}) => {
  const parseActivities = (text: string) => {
    if (!text || text.trim().length === 0) return [];
    
    // Split by common delimiters and clean up
    const activities = text
      .split(/[.!]\s+(?=[A-Z])|(?:\n|^)[-•*]\s*/)
      .map(activity => activity.trim())
      .filter(activity => activity.length > 10)
      .map(activity => {
        // Remove trailing punctuation and clean up
        return activity.replace(/[.!]+$/, '').trim();
      });

    return activities.length > 0 ? activities : [text.trim()];
  };

  const getActivityIcon = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('breakfast') || lowerText.includes('lunch') || lowerText.includes('dinner') || lowerText.includes('food') || lowerText.includes('restaurant') || lowerText.includes('cafe')) {
      return <Utensils className="w-4 h-4 text-orange-500" />;
    }
    if (lowerText.includes('shopping') || lowerText.includes('market') || lowerText.includes('bazaar')) {
      return <ShoppingBag className="w-4 h-4 text-purple-500" />;
    }
    if (lowerText.includes('photo') || lowerText.includes('view') || lowerText.includes('scenic')) {
      return <Camera className="w-4 h-4 text-blue-500" />;
    }
    return <MapPin className="w-4 h-4 text-gray-500" />;
  };

  const highlightImportantText = (text: string) => {
    // Highlight restaurant names, places, and important locations
    return text.replace(
      /([A-Z][a-zA-Z\s&'-]+(?:Restaurant|Cafe|Palace|Temple|Fort|Museum|Market|Hotel|Beach|Park|Garden|Cathedral|Church|Mosque))/g,
      '<strong class="font-semibold text-gray-900">$1</strong>'
    ).replace(
      /\b([A-Z][a-zA-Z\s]+(?:Road|Street|Avenue|Plaza|Square|Mall|Center))/g,
      '<strong class="font-medium text-gray-800">$1</strong>'
    );
  };

  const ActivityList = ({ activities, timeIcon }: { activities: string[], timeIcon: React.ReactNode }) => (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0 mt-0.5">
            {getActivityIcon(activity)}
          </div>
          <div className="flex-1">
            <p 
              className="text-gray-700 leading-relaxed text-sm"
              dangerouslySetInnerHTML={{ 
                __html: highlightImportantText(activity) 
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Trip Title Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {itineraryData.title}
        </h1>
        <div className="w-24 h-1 bg-trypie-500 mx-auto rounded-full"></div>
      </div>

      {/* Daily Itinerary */}
      {itineraryData.days.map((day, index) => {
        const morningActivities = parseActivities(day.morning);
        const afternoonActivities = parseActivities(day.afternoon);
        const eveningActivities = parseActivities(day.evening);

        return (
          <Card key={index} className="overflow-hidden shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-trypie-600 to-blue-600 text-white">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Calendar className="mr-3" size={24} />
                <div>
                  <div>{day.day}: {day.title}</div>
                  <div className="text-sm font-normal text-white/90 mt-1">
                    {day.date}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {/* Morning */}
                {morningActivities.length > 0 && (
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full">
                        <span className="text-xl mr-2">🌅</span>
                        <span className="font-semibold text-yellow-700 text-lg">
                          Morning
                        </span>
                      </div>
                    </div>
                    <ActivityList activities={morningActivities} timeIcon="🌅" />
                  </div>
                )}

                {/* Afternoon */}
                {afternoonActivities.length > 0 && (
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex items-center bg-orange-50 px-4 py-2 rounded-full">
                        <span className="text-xl mr-2">☀️</span>
                        <span className="font-semibold text-orange-700 text-lg">
                          Afternoon
                        </span>
                      </div>
                    </div>
                    <ActivityList activities={afternoonActivities} timeIcon="☀️" />
                  </div>
                )}

                {/* Evening */}
                {eveningActivities.length > 0 && (
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
                        <span className="text-xl mr-2">🌙</span>
                        <span className="font-semibold text-blue-700 text-lg">
                          Evening
                        </span>
                      </div>
                    </div>
                    <ActivityList activities={eveningActivities} timeIcon="🌙" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Trip Notes */}
      {itineraryData.tripNotes && (
        <Card className="border-2 border-trypie-200 bg-trypie-50">
          <CardHeader className="bg-trypie-100 border-b border-trypie-200">
            <CardTitle className="text-xl font-bold text-trypie-800 flex items-center">
              <Clock className="mr-3" size={20} />
              Trip Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-trypie max-w-none">
              <p className="text-trypie-900 leading-relaxed whitespace-pre-wrap">
                {itineraryData.tripNotes}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StructuredItineraryDisplay;
