import { useSeatStore } from "../store/seatStore";

export default function SeatDetail() {
  const seat = useSeatStore((s) => s.focusedSeat);

  if (!seat) {
    return (
      <div style={{ padding: 16, color: "#9ca3af", fontSize: 14 }}>
        Click a seat to see details.
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: "0 0 12px", color: "#f9fafb" }}>Seat Details</h3>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
      >
        <tbody>
          {[
            ["Section", seat.section],
            ["Row", seat.row],
            ["Seat", String(seat.col).padStart(2, "0")],
            ["Price", `$${seat.price}`],
            ["Status", seat.status],
          ].map(([label, value]) => (
            <tr key={label}>
              <td
                style={{ color: "#9ca3af", padding: "4px 0", paddingRight: 16 }}
              >
                {label}
              </td>
              <td style={{ color: "#f9fafb", fontWeight: 600 }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
