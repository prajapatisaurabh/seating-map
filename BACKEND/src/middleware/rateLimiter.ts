import { Request, Response, NextFunction } from "express";

interface IPState {
  count: number;
  windowStart: number;
  burstCount: number;
  burstStart: number;
}

const WINDOW_MS = 60_000; // 1 minute
const MAX_PER_WINDOW = 10;
const BURST_MS = 10_000; // 10 seconds
const MAX_BURST = 5;

const ipMap = new Map<string, IPState>();

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
  const now = Date.now();

  let state = ipMap.get(ip);
  if (!state) {
    state = { count: 0, windowStart: now, burstCount: 0, burstStart: now };
    ipMap.set(ip, state);
  }

  // Reset window
  if (now - state.windowStart > WINDOW_MS) {
    state.count = 0;
    state.windowStart = now;
  }
  // Reset burst window
  if (now - state.burstStart > BURST_MS) {
    state.burstCount = 0;
    state.burstStart = now;
  }

  state.count++;
  state.burstCount++;

  if (state.count > MAX_PER_WINDOW) {
    const retryAfter = Math.ceil((state.windowStart + WINDOW_MS - now) / 1000);
    res.status(429).json({ error: "Rate limit exceeded", retryAfter });
    return;
  }

  if (state.burstCount > MAX_BURST) {
    const retryAfter = Math.ceil((state.burstStart + BURST_MS - now) / 1000);
    res.status(429).json({ error: "Rate limit exceeded (burst)", retryAfter });
    return;
  }

  next();
}
