import http from "node:http";
import { createServerApplication } from "./app";
import { env } from "./env";

async function main() {
  try {
    const server = http.createServer(createServerApplication());
    const PORT: number = env.PORT ? +env.PORT : 3000;

    server.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    throw error;
  }
}

main();
