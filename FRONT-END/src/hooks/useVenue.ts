import { useEffect } from "react";
import { useSeatStore } from "../store/seatStore";
import { VenueData } from "../types";

export function useVenue() {
  const loadVenue = useSeatStore((s) => s.loadVenue);
  const loading = useSeatStore((s) => s.loading);

  useEffect(() => {
    fetch("/venue.json")
      .then((r) => r.json())
      .then((data: VenueData) => loadVenue(data));
  }, [loadVenue]);

  return { loading };
}
