
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface BudgetSliderProps {
  budget: number;
  setBudget: (value: number) => void;
  currency?: string;
}

export const BudgetSlider = ({ budget, setBudget, currency = "INR" }: BudgetSliderProps) => {
  const currencySymbol = "₹";
  return (
    <div>
      <div className="flex justify-between mb-2">
        <Label htmlFor="budget">Budget (per person)</Label>
        <span className="text-sm text-gray-600">{currencySymbol}{budget}</span>
      </div>
      <Slider
        id="budget"
        min={1000}
        max={200000}
        step={500}
        value={[budget]}
        onValueChange={(value) => setBudget(value[0])}
      />
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>Budget</span>
        <span
          style={{
            color: "#b05c01", // dark orange for contrast
            background: "#FEC6A1",
            borderRadius: 4,
            padding: "0.1em 0.5em",
            fontWeight: 500,
            letterSpacing: "0.01em",
          }}
          className="ml-auto"
        >
          Luxury
        </span>
      </div>
    </div>
  );
};
