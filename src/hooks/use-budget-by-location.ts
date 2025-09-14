
import { useState, useEffect } from "react";

const DEFAULT_BUDGETS: Record<string, number> = {
  "Delhi": 20000,
  "Mumbai": 18000,
  "Goa": 26000,
  "Bangalore": 22000,
  "Kolkata": 16000,
  "Chennai": 17000,
  "Ladakh": 40000,
  "Varanasi": 15000,
  "Rajasthan": 25000,
  "Kerala": 22000,
};

export function useBudgetByLocation(destination: string) {
  const [budget, setBudget] = useState(500);

  useEffect(() => {
    if (destination) {
      const knownLocation = Object.keys(DEFAULT_BUDGETS).find(
        location => destination.toLowerCase().includes(location.toLowerCase())
      );
      if (knownLocation) {
        setBudget(DEFAULT_BUDGETS[knownLocation]);
      }
    }
  }, [destination]);

  return [budget, setBudget] as const;
}
