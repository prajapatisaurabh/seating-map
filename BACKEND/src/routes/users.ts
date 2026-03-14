import { Router, Request, Response } from "express";
import { LRUCache } from "../cache/LRUCache";
import { RequestQueue } from "../queue/RequestQueue";
import { fetchUserFromDB, mockUsers, User, getNextId } from "../data/mockUsers";
import { rateLimiter } from "../middleware/rateLimiter";

const router = Router();
export const cache = new LRUCache<number, User>(100);
const queue = new RequestQueue();

const responseTimes: number[] = [];

router.get("/:id", rateLimiter, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const start = Date.now();

  const cached = cache.get(id);
  if (cached) {
    responseTimes.push(Date.now() - start);
    res.json(cached);
    return;
  }

  try {
    const user = await queue.enqueue(`user:${id}`, () => fetchUserFromDB(id));
    responseTimes.push(Date.now() - start);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    cache.set(id, user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", rateLimiter, (req: Request, res: Response) => {
  const { name, email } = req.body as { name?: string; email?: string };
  if (!name || !email) {
    res.status(400).json({ error: "name and email are required" });
    return;
  }
  const id = getNextId();
  const user: User = { id, name, email };
  mockUsers.set(id, user);
  cache.set(id, user);
  res.status(201).json(user);
});

export { router as usersRouter, responseTimes };
