import React from "react";
import { Seat as SeatType } from "../types";
import SeatComponent from "./Seat";

interface Props {
  name: string;
  seats: SeatType[];
}

const Section = React.memo(function Section({ name, seats }: Props) {
  return (
    <g aria-label={`Section ${name}`}>
      {seats.map((seat) => (
        <SeatComponent key={seat.id} seat={seat} />
      ))}
    </g>
  );
});

export default Section;
