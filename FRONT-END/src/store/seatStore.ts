import { create } from "zustand";

import { Seat, VenueData } from "../types";

const MAX_SELECTION = 8;
const STORAGE_KEY = "selectedSeats";

function loadSelected(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {
    // ignore
  }
  return new Set();
}

function saveSelected(selected: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...selected]));
}

interface SeatStore {
  seats: Map<string, Seat>;
  selected: Set<string>;
  focusedSeat: Seat | null;
  loading: boolean;
  loadVenue: (data: VenueData) => void;
  selectSeat: (id: string) => void;
  deselectSeat: (id: string) => void;
  setFocused: (seat: Seat | null) => void;
}

export const useSeatStore = create<SeatStore>((set, get) => ({
  seats: new Map(),
  selected: loadSelected(),
  focusedSeat: null,
  loading: true,

  loadVenue: (data: VenueData) => {
    const seats = new Map<string, Seat>();
    const selected = get().selected;
    data.sections.forEach((section) => {
      section.seats.forEach((seat) => {
        const status = selected.has(seat.id) ? "selected" : seat.status;
        seats.set(seat.id, { ...seat, status });
      });
    });
    set({ seats, loading: false });
  },

  selectSeat: (id: string) => {
    const { seats, selected } = get();
    const seat = seats.get(id);
    if (!seat || seat.status === "unavailable") return;
    if (selected.has(id)) return;
    if (selected.size >= MAX_SELECTION) return;

    const newSelected = new Set(selected);
    newSelected.add(id);
    const newSeats = new Map(seats);
    newSeats.set(id, { ...seat, status: "selected" });
    saveSelected(newSelected);
    set({
      seats: newSeats,
      selected: newSelected,
      focusedSeat: { ...seat, status: "selected" },
    });
  },

  deselectSeat: (id: string) => {
    const { seats, selected } = get();
    const seat = seats.get(id);
    if (!seat) return;

    const newSelected = new Set(selected);
    newSelected.delete(id);
    const newSeats = new Map(seats);
    newSeats.set(id, { ...seat, status: "available" });
    saveSelected(newSelected);
    set({
      seats: newSeats,
      selected: newSelected,
      focusedSeat: { ...seat, status: "available" },
    });
  },

  setFocused: (seat: Seat | null) => set({ focusedSeat: seat }),
}));
