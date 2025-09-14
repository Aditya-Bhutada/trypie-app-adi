
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Camera, MapPin, AlertCircle } from "lucide-react";

interface TextItineraryDisplayProps {
  itineraryText: string;
  destination?: string;
}

const TextItineraryDisplay: React.FC<TextItineraryDisplayProps> = ({ 
  itineraryText, 
  destination 
}) => {
  const parseTextItinerary = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const sections: any[] = [];
    let currentDay: any = null;
    let currentTimeBlock: any = null;
    let miscSections: any[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Check for day headers (various formats)
      const dayMatch = trimmed.match(/^Day\s*(\d+)[\:\-\.]?\s*(.*?)(?:\s*[–-]\s*(\d{4}-\d{2}-\d{2}))?$/i);
      if (dayMatch) {
        // Save previous day
        if (currentDay) {
          if (currentTimeBlock) {
            currentDay.timeBlocks.push(currentTimeBlock);
          }
          sections.push(currentDay);
        }
        
        // Start new day
        currentDay = {
          type: 'day',
          dayNumber: parseInt(dayMatch[1]),
          title: dayMatch[2]?.trim() || '',
          date: dayMatch[3] || '',
          timeBlocks: []
        };
        currentTimeBlock = null;
        continue;
      }

      // Check for time blocks (Morning, Afternoon, Evening, etc.)
      const timeMatch = trimmed.match(/^(Morning|Afternoon|Evening|Night|Late Morning|Early Evening)[\:\-\.]?\s*(.*)?$/i);
      if (timeMatch && currentDay) {
        // Save previous time block
        if (currentTimeBlock) {
          currentDay.timeBlocks.push(currentTimeBlock);
        }
        
        // Start new time block
        currentTimeBlock = {
          time: timeMatch[1],
          content: timeMatch[2]?.trim() || '',
          activities: []
        };
        continue;
      }

      // Check for special sections (Photography Tips, Trip Notes, etc.)
      const specialMatch = trimmed.match(/^(Photography Tips?|Trip Notes?|Important Notes?|Travel Tips?)[\:\-\.]?\s*(.*)?$/i);
      if (specialMatch) {
        const specialSection = {
          type: 'special',
          title: specialMatch[1],
          content: [specialMatch[2]?.trim() || ''].filter(Boolean)
        };
        miscSections.push(specialSection);
        continue;
      }

      // Add content to current context
      if (trimmed.length > 0) {
        if (currentTimeBlock) {
          if (currentTimeBlock.content) {
            currentTimeBlock.content += ' ' + trimmed;
          } else {
            currentTimeBlock.content = trimmed;
          }
        } else if (currentDay && !currentTimeBlock) {
          // Content directly under day without time block
          if (!currentDay.description) {
            currentDay.description = trimmed;
          } else {
            currentDay.description += ' ' + trimmed;
          }
        } else {
          // Content outside of any day structure
          if (miscSections.length > 0 && miscSections[miscSections.length - 1].type === 'special') {
            miscSections[miscSections.length - 1].content.push(trimmed);
          } else {
            miscSections.push({
              type: 'general',
              content: [trimmed]
            });
          }
        }
      }
    }

    // Save final day
    if (currentDay) {
      if (currentTimeBlock) {
        currentDay.timeBlocks.push(currentTimeBlock);
      }
      sections.push(currentDay);
    }

    return { days: sections, miscSections };
  };

  const { days, miscSections } = parseTextItinerary(itineraryText);

  const getTimeIcon = (time: string) => {
    const timeStr = time.toLowerCase();
    if (timeStr.includes('morning')) return '🌅';
    if (timeStr.includes('afternoon')) return '☀️';
    if (timeStr.includes('evening') || timeStr.includes('night')) return '🌙';
    return '⏰';
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      {destination && (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <MapPin className="mr-3 text-trypie-600" size={28} />
            {destination} Travel Itinerary
          </h1>
          <div className="w-24 h-1 bg-trypie-500 mx-auto rounded-full"></div>
        </div>
      )}

      {/* Daily Itinerary */}
      {days.map((day, index) => (
        <Card key={index} className="overflow-hidden shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-trypie-600 to-blue-600 text-white">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Calendar className="mr-3" size={24} />
              <div>
                <div>Day {day.dayNumber}{day.title && `: ${day.title}`}</div>
                {day.date && (
                  <div className="text-sm font-normal text-white/90 mt-1">
                    {day.date}
                  </div>
                )}
              </div>
            </CardTitle>
            {day.description && (
              <p className="text-white/95 text-base leading-relaxed mt-2">
                {day.description}
              </p>
            )}
          </CardHeader>
          
          <CardContent className="p-0">
            {day.timeBlocks.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {day.timeBlocks.map((timeBlock: any, timeIndex: number) => (
                  <div key={timeIndex} className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex items-center bg-trypie-50 px-4 py-2 rounded-full">
                        <span className="text-xl mr-2">{getTimeIcon(timeBlock.time)}</span>
                        <span className="font-semibold text-trypie-700 text-lg">
                          {timeBlock.time}
                        </span>
                      </div>
                    </div>
                    
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                        {timeBlock.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6">
                <div className="text-gray-500 text-center py-4">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No detailed schedule available for this day</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Special Sections (Photography Tips, Notes, etc.) */}
      {miscSections.map((section, index) => (
        <Card key={`misc-${index}`} className="border-2 border-amber-200 bg-amber-50">
          <CardHeader className="bg-amber-100 border-b border-amber-200">
            <CardTitle className="text-xl font-bold text-amber-800 flex items-center">
              {section.type === 'special' ? (
                <>
                  <Camera className="mr-3" size={20} />
                  {section.title}
                </>
              ) : (
                <>
                  <AlertCircle className="mr-3" size={20} />
                  Additional Information
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-amber max-w-none">
              {section.content.map((content: string, contentIndex: number) => (
                <p key={contentIndex} className="text-amber-900 leading-relaxed mb-3 last:mb-0">
                  {content}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Fallback if no structured content */}
      {days.length === 0 && miscSections.length === 0 && (
        <Card className="border-2 border-gray-200">
          <CardContent className="p-8">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {itineraryText}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TextItineraryDisplay;
