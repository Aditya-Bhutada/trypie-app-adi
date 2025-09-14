import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface DateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
}

export const DateRangePicker = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: DateRangePickerProps) => {
  // Get today's date at midnight for date comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // When opening End Date calendar, jump to startDate month if present
  const endDateMonth = startDate ? new Date(startDate) : today;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
              disabled={(date) => {
                // Convert both to timestamps for comparison to fix type error
                const dateTime = new Date(date).getTime();
                const todayTime = today.getTime();
                return dateTime < todayTime;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div>
        <Label>End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
              // Make sure the calendar opens on an appropriate month
              month={endDate || (startDate ? new Date(startDate) : undefined)}
              disabled={(date) => {
                // Convert to timestamps for comparison
                const dateTime = new Date(date).getTime();
                const todayTime = today.getTime();
                const startDateTime = startDate ? startDate.getTime() : null;
                
                // If there's a start date, end date must be after start date
                // Otherwise, end date must be today or after
                return startDateTime 
                  ? dateTime < startDateTime || dateTime < todayTime
                  : dateTime < todayTime;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
