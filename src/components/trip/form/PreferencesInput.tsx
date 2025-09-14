
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

interface PreferencesInputProps {
  preferences: string[];
  setPreferences: (preferences: string[]) => void;
}

export const PreferencesInput = ({ preferences, setPreferences }: PreferencesInputProps) => {
  const [customPreference, setCustomPreference] = useState("");

  const preferenceOptions = [
    "Adventure", "Cultural", "Relaxation", "Foodie", "Nature", 
    "Shopping", "History", "Photography", "Budget-friendly", "Luxury"
  ];

  const addCustomPreference = () => {
    if (customPreference && !preferences.includes(customPreference)) {
      setPreferences([...preferences, customPreference]);
      setCustomPreference("");
    }
  };

  const removePreference = (pref: string) => {
    setPreferences(preferences.filter(p => p !== pref));
  };

  return (
    <div>
      <Label>Trip Preferences</Label>
      <div className="flex flex-wrap gap-2 mt-2 mb-4">
        {preferences.map((pref) => (
          <Badge key={pref} variant="secondary" className="px-3 py-1">
            {pref}
            <button 
              onClick={() => removePreference(pref)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
      
      <div className="flex space-x-2">
        <div className="flex-1">
          <Select
            onValueChange={(value) => {
              if (!preferences.includes(value)) {
                setPreferences([...preferences, value]);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Add preference" />
            </SelectTrigger>
            <SelectContent>
              {preferenceOptions.filter(opt => !preferences.includes(opt)).map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex space-x-2">
          <Input
            placeholder="Custom preference"
            value={customPreference}
            onChange={(e) => setCustomPreference(e.target.value)}
          />
          <Button
            type="button"
            size="icon"
            onClick={addCustomPreference}
            disabled={!customPreference || preferences.includes(customPreference)}
          >
            <PlusCircle size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
