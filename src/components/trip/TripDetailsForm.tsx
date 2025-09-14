
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocationAutocomplete } from "@/components/location-autocomplete";
import { DateRangePicker } from "./form/DateRangePicker";
import { BudgetSlider } from "./form/BudgetSlider";
import { PreferencesInput } from "./form/PreferencesInput";

interface TripDetailsFormProps {
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
  generateItinerary: () => void;
  isGenerating: boolean;
  onPlaceSelect?: (placeId: string) => void;
  currency?: string;
  isFormComplete?: boolean; // Added missing prop
}

const TripDetailsForm = ({
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
  generateItinerary,
  isGenerating,
  onPlaceSelect,
  currency,
  isFormComplete
}: TripDetailsFormProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="destination">Destination</Label>
        <LocationAutocomplete
          value={destination}
          onChange={setDestination}
          placeholder="Where do you want to go?"
          className="mt-1"
          filterTypes={['(cities)']}
          onPlaceSelect={onPlaceSelect}
        />
      </div>
      
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      
      <BudgetSlider budget={budget} setBudget={setBudget} currency={currency} />
      
      <div>
        <Label htmlFor="group-size">Group Size</Label>
        <Select value={groupSize} onValueChange={setGroupSize}>
          <SelectTrigger id="group-size">
            <SelectValue placeholder="Select group size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Solo Traveler</SelectItem>
            <SelectItem value="2">Couple</SelectItem>
            <SelectItem value="3-5">Small Group (3-5)</SelectItem>
            <SelectItem value="6-10">Medium Group (6-10)</SelectItem>
            <SelectItem value="10+">Large Group (10+)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <PreferencesInput preferences={preferences} setPreferences={setPreferences} />
      
      <div>
        <Label htmlFor="accommodation">Accommodation Preference</Label>
        <Select value={accommodation} onValueChange={setAccommodation}>
          <SelectTrigger id="accommodation">
            <SelectValue placeholder="Select accommodation type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hotel">Hotel</SelectItem>
            <SelectItem value="hostel">Hostel</SelectItem>
            <SelectItem value="apartment">Vacation Rental/Apartment</SelectItem>
            <SelectItem value="resort">Resort</SelectItem>
            <SelectItem value="camping">Camping</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any special requests or information about your trip..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      <Button 
        onClick={generateItinerary} 
        className="w-full" 
        disabled={isGenerating || !destination || !startDate || !endDate}
      >
        {isGenerating ? "Generating your perfect trip..." : "Generate Itinerary"}
      </Button>
    </div>
  );
};

export default TripDetailsForm;
