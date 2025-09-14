
import { Command, CommandEmpty, CommandGroup, CommandInput } from "@/components/ui/command";
import { Loader2 } from "lucide-react";
import { LocationPredictionItem } from "./location-prediction-item";
import { PlacePrediction } from "@/hooks/use-places-autocomplete";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect } from "react";

interface LocationSearchCommandProps {
  query: string;
  onQueryChange: (value: string) => void;
  loading: boolean;
  error: string | null;
  predictions: PlacePrediction[];
  selectedValue: string;
  onSelectPrediction: (prediction: PlacePrediction) => void;
  open: boolean;
}

export function LocationSearchCommand({
  query,
  onQueryChange,
  loading,
  error,
  predictions = [],
  selectedValue,
  onSelectPrediction,
  open
}: LocationSearchCommandProps) {
  // If not open, don't render the component to avoid unnecessary calculations
  if (!open) return null;
  
  // Ensure predictions is always an array
  const safePredictions = Array.isArray(predictions) ? predictions : [];
  
  const showEmptyState = !loading && !error && safePredictions.length === 0 && query;
  const showInitialState = !loading && !error && query.length === 0;
  const showPredictions = !loading && !error && safePredictions.length > 0;

  // Use a basic renderFallback as a last resort if the Command component fails
  const renderFallback = () => (
    <div className="border border-input rounded-md p-3">
      <input 
        type="text"
        placeholder="Search locations..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full h-9 px-3 outline-none"
      />
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      {loading && <p className="text-gray-500 mt-2 text-sm">Loading...</p>}
      {safePredictions.length > 0 && (
        <ul className="mt-2">
          {safePredictions.map((prediction) => (
            <li 
              key={prediction.place_id}
              onClick={() => onSelectPrediction(prediction)}
              className="cursor-pointer p-2 hover:bg-gray-100 rounded"
            >
              {prediction.structured_formatting?.main_text || prediction.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  try {
    return (
      <Command shouldFilter={false} className="w-full">
        <CommandInput
          placeholder="Search locations..."
          value={query}
          onValueChange={onQueryChange}
          className="h-9"
        />
        
        {error && (
          <CommandGroup>
            <Alert variant="destructive" className="m-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CommandGroup>
        )}
        
        {loading && (
          <CommandGroup>
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2">Searching locations...</span>
            </div>
          </CommandGroup>
        )}
        
        {showEmptyState && (
          <CommandGroup>
            <CommandEmpty className="py-3 text-center text-sm">
              No locations found.
            </CommandEmpty>
          </CommandGroup>
        )}
        
        {showInitialState && (
          <CommandGroup>
            <CommandEmpty className="py-3 text-center text-sm">
              Type to search locations...
            </CommandEmpty>
          </CommandGroup>
        )}
        
        {showPredictions && (
          <CommandGroup>
            {safePredictions.map((prediction) => (
              <LocationPredictionItem
                key={prediction.place_id}
                prediction={prediction}
                selectedValue={selectedValue}
                onSelect={onSelectPrediction}
              />
            ))}
          </CommandGroup>
        )}
      </Command>
    );
  } catch (err) {
    console.error("Command component rendering error:", err);
    return renderFallback();
  }
}
