
import React from "react";
import { format } from "date-fns";
import { TripDay } from "@/types/trip-types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  MapPin, 
  Utensils,
  Camera,
  ShoppingBag,
  Mountain,
  Waves,
  Sparkles
} from "lucide-react";

interface ItineraryDisplayCardProps {
  day: TripDay;
  currency?: string;
}

const ItineraryDisplayCard: React.FC<ItineraryDisplayCardProps> = ({ 
  day, 
  currency = "USD" 
}) => {
  const dayDate = day.date instanceof Date && !isNaN(day.date.getTime())
    ? format(day.date, "EEEE, MMMM d")
    : "Date not specified";
    
  const activities = day.activities && Array.isArray(day.activities) ? day.activities : [];
  
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'food': return <Utensils className="w-4 h-4" />;
      case 'cultural': case 'sightseeing': return <Camera className="w-4 h-4" />;
      case 'shopping': return <ShoppingBag className="w-4 h-4" />;
      case 'nature': return <Waves className="w-4 h-4" />;
      case 'adventure': return <Mountain className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };
  
  const getActivityTypeColor = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'food': 'bg-orange-100 text-orange-700 border-orange-200',
      'sightseeing': 'bg-blue-100 text-blue-700 border-blue-200',
      'cultural': 'bg-purple-100 text-purple-700 border-purple-200',
      'adventure': 'bg-green-100 text-green-700 border-green-200',
      'nature': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'shopping': 'bg-pink-100 text-pink-700 border-pink-200',
      'relaxation': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };
    
    return typeMap[type.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const currencySymbol = currency === "EUR" ? "€" : 
                         currency === "GBP" ? "£" : 
                         currency === "JPY" ? "¥" : "$";

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="bg-gradient-to-r from-trypie-50 to-blue-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-trypie-600 text-white text-sm font-bold px-3 py-1.5 rounded-full">
              Day {day.day}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{dayDate}</h3>
              {day.weather && (
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <span className="mr-2">{day.weather.condition}</span>
                  <span className="font-medium">{day.weather.temperature}°</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
            </div>
            {day.dailyBudget && (
              <div className="text-sm font-medium text-trypie-600">
                {currencySymbol}{day.dailyBudget}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {activities.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {activities.map((activity, index) => (
              <div key={index} className="p-5 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-start space-x-4">
                  {/* Time */}
                  <div className="flex-shrink-0 w-16">
                    <div className="flex items-center text-sm font-medium text-gray-600">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.time || "TBD"}
                    </div>
                  </div>
                  
                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-lg leading-tight">
                        {activity.name || "Activity"}
                      </h4>
                      {activity.cost && (
                        <span className="flex-shrink-0 ml-2 text-sm font-medium text-trypie-600 bg-trypie-50 px-2 py-1 rounded">
                          {currencySymbol}{activity.cost}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {activity.description || "No description available"}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className={`text-xs ${getActivityTypeColor(activity.type)} border`}>
                        {getActivityIcon(activity.type)}
                        <span className="ml-1">{activity.type || "Other"}</span>
                      </Badge>
                      
                      {activity.location && (
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{activity.location}</span>
                        </div>
                      )}
                      
                      {activity.bookingUrl && (
                        <a 
                          href={activity.bookingUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-trypie-600 hover:text-trypie-700 hover:underline font-medium"
                        >
                          Book now →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No activities planned for this day</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ItineraryDisplayCard;
