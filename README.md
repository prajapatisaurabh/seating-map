# Seat Map

An interactive event seat-map application with a Vite + React + TypeScript frontend and an Express + TypeScript backend.

---

## Repository Structure

```
seat-map/
├── frontend/          # Vite + React + TypeScript
│   ├── public/
│   │   └── venue.json        # Generated venue data (~2880 seats)
│   ├── scripts/
│   │   └── generateVenue.cjs # Script to regenerate venue.json
│   └── src/
│       ├── components/       # React components (SeatMap, Seat, Section, SeatDetail, SelectionSummary)
│       ├── hooks/            # useVenue hook
│       ├── store/            # Zustand store (seatStore)
│       └── types/            # Shared TypeScript types
├── backend/           # Express + TypeScript
│   └── src/
│       ├── cache/            # LRU cache implementation with TTL
│       ├── data/             # Mock user data
│       ├── middleware/       # Rate limiter
│       ├── queue/            # Request coalescing queue
│       └── routes/           # Express route handlers
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend will be available at `http://localhost:5173`.

To regenerate `venue.json`:

```bash
node frontend/scripts/generateVenue.cjs
```

### Backend

```bash
cd backend
pnpm install
pnpm dev
```

The backend will be available at `http://localhost:3001`.

---

## API Endpoints

| Method | Path            | Description                                      |
| ------ | --------------- | ------------------------------------------------ |
| GET    | `/users/:id`    | Fetch a user by ID (cache + queue + rate limit)  |
| POST   | `/users`        | Create a new user (`{ name, email }` in body)    |
| GET    | `/cache-status` | View cache hits, misses, size, avg response time |
| DELETE | `/cache`        | Clear the entire user cache                      |

### Rate Limiting

Each IP is limited to:

- **10 requests per minute** (sliding window)
- **5 requests per 10 seconds** (burst window)

Exceeding either limit returns `HTTP 429` with a `retryAfter` field (seconds).

---

## Frontend Features

- **Interactive SVG seat map** — 2880 seats across 4 sections rendered in a 1200x900 viewBox
- **Click or keyboard (Enter/Space) to select/deselect seats** — full keyboard accessibility with `role="button"` and `tabIndex`
- **Maximum 8 seats** can be selected at once
- **LocalStorage persistence** — selections survive page refresh
- **Seat detail panel** — shows section, row, seat number, price, and status for the last focused seat
- **Selection summary sidebar** — lists all selected seats, individual prices, total, and a remove button per seat
- **Color legend** — green (available), grey (unavailable), blue (selected)
- **Loading state** while venue JSON is fetched

---

## Architecture Decisions

### Frontend

- **Zustand** for global state management — lightweight, no boilerplate, works well with Maps and Sets without deep immutability overhead.
- **SVG event delegation** — a single `onClick` / `onKeyDown` on the `<svg>` element dispatches to seats via `closest('[data-seat-id]')`, avoiding thousands of individual event listeners.
- **`React.memo`** on `Seat` and `Section` components — prevents re-rendering unaffected seats when only one seat changes status.
- **`useMemo`** in `SeatMap` to recompute the section grouping only when the seats Map reference changes.
- **Venue data as static JSON** (`public/venue.json`) — no server round-trip needed on every load; the backend is purposely decoupled from seat state.

### Backend

- **Custom LRU Cache with TTL** — O(1) get/set/delete using a doubly-linked list + HashMap. Entries expire after 60 s; a background interval evicts stale entries every 10 s.
- **Request coalescing queue** — if multiple concurrent requests arrive for the same user ID before the DB resolves, they share a single in-flight `Promise`, eliminating redundant DB calls (thundering herd protection).
- **In-memory rate limiter** — dual-window strategy (per-minute + burst) implemented without external dependencies. Tracks state per IP address.
- **`ts-node-dev`** for development — fast TypeScript transpilation with automatic restart on file changes.
