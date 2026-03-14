import { Router, Request, Response } from "express";
import { cache, responseTimes } from "./users";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  return res.status(200).json({
    message: "Server is up and Running ",
  });
});

router.get("/cache-status", (_req: Request, res: Response) => {
  const avg =
    responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;
  res.json({
    hits: cache.hits,
    misses: cache.misses,
    size: cache.size,
    avgResponseTimeMs: Math.round(avg),
  });
});

router.delete("/cache", (_req: Request, res: Response) => {
  cache.clear();
  res.json({ message: "Cache cleared" });
});

export { router as cacheRouter };
