
import { Check, MapPin } from "lucide-react";
import { CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { PlacePrediction } from "@/hooks/use-places-autocomplete";

interface LocationPredictionItemProps {
  prediction: PlacePrediction;
  selectedValue: string;
  onSelect: (prediction: PlacePrediction) => void;
}

export function LocationPredictionItem({ 
  prediction, 
  selectedValue, 
  onSelect 
}: LocationPredictionItemProps) {
  return (
    <CommandItem
      key={prediction.place_id}
      value={prediction.place_id}
      onSelect={() => onSelect(prediction)}
    >
      <div className="flex items-start space-x-2 w-full">
        <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gray-400" />
        <div className="flex flex-col overflow-hidden">
          <span className="truncate font-medium">
            {prediction.structured_formatting.main_text}
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {prediction.structured_formatting.secondary_text}
          </span>
        </div>
        <Check
          className={cn(
            "ml-auto h-4 w-4 shrink-0",
            selectedValue === prediction.description ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    </CommandItem>
  );
}
