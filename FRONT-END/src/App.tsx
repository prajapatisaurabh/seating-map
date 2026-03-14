import SeatMap from "./components/SeatMap";
import SeatDetail from "./components/seatdetail";
import SelectionSummary from "./components/SelectionSummary";
import { useVenue } from "./hooks/useVenue";

export default function App() {
  const { loading } = useVenue();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#f9fafb",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <header
        style={{ padding: "16px 24px", borderBottom: "1px solid #1e293b" }}
      >
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
          Event Seat Map
        </h1>
      </header>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 0,
          height: "calc(100vh - 57px)",
        }}
      >
        <main style={{ padding: 24, overflow: "auto" }}>
          {loading ? (
            <div
              style={{ color: "#9ca3af", textAlign: "center", marginTop: 100 }}
            >
              Loading venue...
            </div>
          ) : (
            <SeatMap />
          )}
          <div
            style={{ marginTop: 16, display: "flex", gap: 16, fontSize: 13 }}
          >
            {[
              { color: "#4ade80", label: "Available" },
              { color: "#6b7280", label: "Unavailable" },
              { color: "#3b82f6", label: "Selected" },
            ].map(({ color, label }) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: color,
                  }}
                />
                <span style={{ color: "#9ca3af" }}>{label}</span>
              </div>
            ))}
          </div>
        </main>
        <aside
          style={{
            borderLeft: "1px solid #1e293b",
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          <SeatDetail />
          <div style={{ borderTop: "1px solid #1e293b" }} />
          <SelectionSummary />
        </aside>
      </div>
    </div>
  );
}
