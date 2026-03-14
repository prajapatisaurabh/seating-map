import React, { useCallback, useMemo, useRef } from "react";
import { useSeatStore } from "../store/seatStore";
import Section from "./Section";
import { Seat } from "../types";

export default function SeatMap() {
  const seats = useSeatStore((s) => s.seats);
  const selectSeat = useSeatStore((s) => s.selectSeat);
  const deselectSeat = useSeatStore((s) => s.deselectSeat);
  const setFocused = useSeatStore((s) => s.setFocused);
  const svgRef = useRef<SVGSVGElement>(null);

  const sections = useMemo(() => {
    const map = new Map<string, Seat[]>();
    seats.forEach((seat) => {
      const list = map.get(seat.section) ?? [];
      list.push(seat);
      map.set(seat.section, list);
    });
    return map;
  }, [seats]);

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const g = (e.target as SVGElement).closest(
        "[data-seat-id]",
      ) as SVGElement | null;
      if (!g) return;
      const id = g.dataset.seatId!;
      const seat = seats.get(id);
      if (!seat) return;
      setFocused(seat);
      if (seat.status === "SELECTED") {
        deselectSeat(id);
      } else if (seat.status === "AVALIABLE") {
        selectSeat(id);
      }
    },
    [seats, selectSeat, deselectSeat, setFocused],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<SVGSVGElement>) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const g = (e.target as SVGElement).closest(
        "[data-seat-id]",
      ) as SVGElement | null;
      if (!g) return;
      e.preventDefault();
      const id = g.dataset.seatId!;
      const seat = seats.get(id);
      if (!seat) return;
      setFocused(seat);
      if (seat.status === "SELECTED") {
        deselectSeat(id);
      } else if (seat.status === "AVALIABLE") {
        selectSeat(id);
      }
    },
    [seats, selectSeat, deselectSeat, setFocused],
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1200 900"
      role="application"
      aria-label="Event seating map"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        width: "100%",
        height: "auto",
        background: "#111827",
        borderRadius: 8,
      }}
    >
      {/* Stage */}
      <rect x={400} y={20} width={400} height={60} rx={8} fill="#374151" />
      <text
        x={600}
        y={57}
        textAnchor="middle"
        fill="#9ca3af"
        fontSize={18}
        fontWeight="bold"
      >
        STAGE
      </text>

      {[...sections.entries()].map(([name, seatList]) => (
        <Section key={name} name={name} seats={seatList} />
      ))}
    </svg>
  );
}
