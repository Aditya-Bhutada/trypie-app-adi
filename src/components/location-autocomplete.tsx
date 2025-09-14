
import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePlacesAutocomplete, PlacePrediction } from "@/hooks/use-places-autocomplete";
import { LocationSearchCommand } from "./location-search-command";
import { useGoogleMapsScript } from "@/hooks/use-google-maps-script";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onPlaceSelect?: (placeId: string) => void;
  filterTypes?: string[];
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder = "Search for a location...",
  className,
  disabled = false,
  onPlaceSelect,
  filterTypes
}: LocationAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);
  
  const { isLoaded, error: scriptError } = useGoogleMapsScript();
  const { 
    predictions, 
    loading, 
    error: predictionsError, 
    debouncedFetch,
    createNewSessionToken 
  } = usePlacesAutocomplete({ filterTypes });

  // Reset query when popover opens/closes
  useEffect(() => {
    if (open) {
      setQuery(value || "");
    }
  }, [open, value]);

  const handleSearch = useCallback((inputValue: string) => {
    setQuery(inputValue);
    if (inputValue && inputValue.trim().length >= 2) {
      debouncedFetch(inputValue);
    }
  }, [debouncedFetch]);

  const handleSelect = useCallback((prediction: PlacePrediction) => {
    if (prediction?.description) {
      onChange(prediction.description);
      createNewSessionToken();
      
      if (onPlaceSelect && prediction.place_id) {
        onPlaceSelect(prediction.place_id);
      }
    }
    setOpen(false);
  }, [onChange, onPlaceSelect, createNewSessionToken]);

  const error = scriptError || predictionsError;
  
  // Always ensure predictions is an array (defensive step)
  const safePredictions = Array.isArray(predictions) ? predictions : [];

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled || !isLoaded}
          onClick={() => setOpen(true)}
        >
          <span className="truncate">{value || placeholder}</span>
          {disabled || !isLoaded ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 opacity-50 animate-spin" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      {open && (
        <PopoverContent 
          className="w-[300px] p-0" 
          align="start" 
          ref={popoverRef}
          onOpenAutoFocus={e => {
            e.preventDefault(); // Prevent auto focus which can cause issues with cmdk
          }}
          sideOffset={5}
        >
          <LocationSearchCommand
            query={query}
            onQueryChange={handleSearch}
            loading={loading}
            error={error}
            predictions={safePredictions}
            selectedValue={value}
            onSelectPrediction={handleSelect}
            open={open}
          />
        </PopoverContent>
      )}
    </Popover>
  );
}
