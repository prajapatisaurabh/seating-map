import express from "express";
import cors from "cors";
import { usersRouter } from "./routes/./users";
import { cacheRouter } from "./routes/cacheRoutes";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);
app.use("/", cacheRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
