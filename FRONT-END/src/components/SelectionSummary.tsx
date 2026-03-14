import { useSeatStore } from "../store/seatStore";

export default function SelectionSummary() {
  const seats = useSeatStore((s) => s.seats);
  const selected = useSeatStore((s) => s.selected);
  const deselectSeat = useSeatStore((s) => s.deselectSeat);

  const selectedSeats = [...selected]
    .map((id) => seats.get(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof seats.get>>[];
  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: "0 0 12px", color: "#f9fafb" }}>
        Selected Seats ({selected.size}/8)
      </h3>
      {selectedSeats.length === 0 ? (
        <p style={{ color: "#9ca3af", fontSize: 14 }}>No seats selected.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px" }}>
            {selectedSeats.map((seat) => (
              <li
                key={seat.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "4px 0",
                  color: "#f9fafb",
                  fontSize: 13,
                }}
              >
                <span>
                  {seat.section}-{seat.row}-{String(seat.col).padStart(2, "0")}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>${seat.price}</span>
                  <button
                    onClick={() => deselectSeat(seat.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: 16,
                      lineHeight: 1,
                      padding: "0 2px",
                    }}
                    aria-label={`Remove ${seat.id}`}
                  >
                    ×
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <div
            style={{
              borderTop: "1px solid #374151",
              paddingTop: 8,
              display: "flex",
              justifyContent: "space-between",
              color: "#f9fafb",
              fontWeight: 700,
            }}
          >
            <span>Total</span>
            <span>${total}</span>
          </div>
        </>
      )}
      {selected.size >= 8 && (
        <p style={{ color: "#f59e0b", fontSize: 12, marginTop: 8 }}>
          Maximum 8 seats selected.
        </p>
      )}
    </div>
  );
}
