import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCurrencyByPlace() {
  const [currency, setCurrency] = useState<string>("INR");

  /**
   * Fetches the currency for a given destination/placeId.
   * Returns the resolved currency code (default is 'INR' if not found).
   */
  const fetchCurrency = async (
    destination: string,
    placeId: string | null
  ) => {
    let currencyCode = "INR";
    if (!destination && !placeId) return currencyCode;

    try {
      const { data: placeData, error: placeError } = await supabase.functions.invoke('get-place-details', {
        body: JSON.stringify({ destination, placeId })
      });
      if (!placeError && placeData?.currency) {
        currencyCode = placeData.currency;
        setCurrency(currencyCode);
      }
    } catch {
      // Fail silently and keep default currency
    }
    return currencyCode;
  };

  return { currency, setCurrency, fetchCurrency };
}
