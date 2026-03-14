import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().optional(),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseresult = envSchema.safeParse(env);
  if (!safeParseresult.success) {
    throw new Error(safeParseresult.error.message);
  }
  return safeParseresult.data;
}

export const env = createEnv(process.env);
