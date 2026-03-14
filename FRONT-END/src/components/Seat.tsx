import React from "react";
import { Seat as SeatType } from "../types";

interface Props {
  seat: SeatType;
}

const COLORS: Record<string, string> = {
  available: "#4ade80",
  unavailable: "#6b7280",
  selected: "#3b82f6",
};

const Seat = React.memo(function Seat({ seat }: Props) {
  const color = COLORS[seat.status];
  const label = `Seat ${seat.section}-${seat.row}-${String(seat.col).padStart(2, "0")}, ${seat.status}, $${seat.price}`;

  return (
    <g
      role="button"
      aria-label={label}
      tabIndex={seat.status !== "unavailable" ? 0 : -1}
      data-seat-id={seat.id}
      style={{
        cursor: seat.status !== "unavailable" ? "pointer" : "default",
        outline: "none",
      }}
    >
      <circle
        cx={seat.x}
        cy={seat.y}
        r={5}
        fill={color}
        stroke={seat.status === "selected" ? "#1d4ed8" : "transparent"}
        strokeWidth={1.5}
      />
    </g>
  );
});

export default Seat;
