import express from "express";
import cors from "cors";
import type { Application } from "express";
import { usersRouter } from "../routes/users";
import { cacheRouter } from "../routes/cacheRoutes";

export function createServerApplication(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/users", usersRouter);
  app.use("/", cacheRouter);

  return app;
}
