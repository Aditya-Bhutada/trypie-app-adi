
export interface TripItinerary {
  destination: string;
  dates: {
    start: Date;
    end: Date;
  };
  days: TripDay[];
  summary?: string;  // Optional summary of the trip
  highlights?: string[];  // Optional array of trip highlights
}

export interface TripDay {
  day: number;
  date: Date;
  activities: TripActivity[];
  dailyBudget?: number;  // Optional estimated daily budget
  weather?: {  // Optional weather information
    condition: string;
    temperature: number;
    icon?: string;
  };
}

export interface TripActivity {
  time: string;
  name: string;
  description: string;
  type: string;
  location?: string;  // Optional location details
  cost?: number;  // Optional cost estimate
  bookingUrl?: string;  // Optional booking link
  imageUrl?: string;  // Optional activity image
}

export interface TripDetails {
  destination: string;
  startDate?: Date;
  endDate?: Date;
  budget: number;
  groupSize: string;
  preferences: string[];
  accommodation: string;
  notes: string;
}

// Simple TripData type for new Gemini API
export interface TripData {
  destination: string;
  duration: number;
  budget: number;
  preferences: string;
}

// New types for n8n JSON response
export interface N8nTripResponse {
  title: string;
  days: N8nTripDay[];
  tripNotes?: string;
}

export interface N8nTripDay {
  day: string;
  date: string;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
}
