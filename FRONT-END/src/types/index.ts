export type SeatStatus = "AVALIABLE" | "UNAVALIABLE" | "SELECTED";

export interface Seat {
  id: string;
  section: string;
  row: string;
  col: number;
  price: number;
  status: SeatStatus;
  x: number;
  y: number;
}

export interface VenueSection {
  id: string;
  name: string;
  seats: Seat[];
}

export interface VenueData {
  sections: VenueSection[];
  viewBox: string;
}
