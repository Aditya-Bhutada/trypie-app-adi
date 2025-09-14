
import * as React from "react";
import { format, isSameDay, parse } from "date-fns";
import { Calendar as CalendarIcon, Save, SaveOff } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

const LS_KEY = "trypie_saved_calendar_days";

// Helper to parse display-only date strings ("January 1", "February 26", etc) into actual Date objects for 2025
function parseToDate(dateStr: string): Date {
  return parse(dateStr + " 2025", "MMMM d yyyy", new Date(2025, 0, 1));
}

// Load and save preferences to local storage
function loadSavedDates(): Date[] {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return [];
  try {
    const arr: string[] = JSON.parse(raw);
    return arr.map(str => new Date(str));
  } catch {
    return [];
  }
}
function saveDates(dates: Date[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(dates.map(d => d.toISOString())));
}

export default function SavedCalendar({
  highlightDates = [],
}: {
  // highlightDates: Dates that should be highlighted as holidays/long weekends/suggested by month
  highlightDates?: Date[];
}) {
  const [saved, setSaved] = React.useState<Date[]>([]);

  // Sync with local storage
  React.useEffect(() => {
    setSaved(loadSavedDates());
  }, []);
  React.useEffect(() => {
    saveDates(saved);
  }, [saved]);

  // Add/remove saved days
  function handleDayClick(day: Date) {
    const isSaved = saved.some(d => isSameDay(d, day));
    if (isSaved) {
      setSaved(prev => prev.filter(d => !isSameDay(d, day)));
      toast("Removed from preferences", { description: format(day, "PPP"), icon: <SaveOff className="text-red-500" /> });
    } else {
      setSaved(prev => [...prev, day]);
      toast("Saved preference", { description: format(day, "PPP"), icon: <Save className="text-green-600" /> });
    }
  }

  // Function to check if a day is a saved/preference day or a highlighted day
  function isDaySaved(day: Date) {
    return saved.some(d => isSameDay(d, day));
  }
  function isDayHighlighted(day: Date) {
    return highlightDates.some(d => isSameDay(d, day));
  }

  // Range: Only show the year 2025
  const fromDate = new Date(2025, 0, 1);
  const toDate = new Date(2025, 11, 31);

  // Setup modifiers for different date types
  const modifiers = {
    saved: saved,
    highlighted: highlightDates,
  };

  // Define styles for the modifiers
  const modifiersStyles = {
    saved: { 
      backgroundColor: "rgb(220 252 231)", // bg-green-100
      borderColor: "rgb(34 197 94)", // border-green-500
      borderWidth: "2px",
      color: "rgb(21 128 61)", // text-green-700
      fontWeight: 600
    },
    highlighted: { 
      backgroundColor: "rgb(254 249 195)", // bg-yellow-100
      borderColor: "rgb(250 204 21)", // border-yellow-400 
      borderWidth: "2px",
      color: "rgb(161 98 7)", // text-yellow-700
      fontWeight: 600
    },
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 sticky top-6">
      <div className="flex items-center gap-2 mb-2">
        <CalendarIcon className="text-trypie-600" size={20} />
        <span className="font-semibold text-trypie-700">2025 Calendar</span>
      </div>
      <Calendar
        fromDate={fromDate}
        toDate={toDate}
        mode="multiple"
        selected={saved}
        onSelect={setSaved}
        onDayClick={handleDayClick}
        className="p-2 pointer-events-auto"
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
      />
      <p className="mt-3 text-xs text-gray-600">
        Click any date to save/remove as a travel preference.<br />
        <span className="inline-flex items-center"><span className="w-3 h-3 rounded bg-green-200 border border-green-500 mr-1"></span>Saved</span>
        {"  "}
        <span className="inline-flex items-center ml-3"><span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-400 mr-1"></span>Holiday/Leave</span>
      </p>
    </div>
  );
}
