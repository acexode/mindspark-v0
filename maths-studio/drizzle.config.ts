import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/server/db/schema.ts",
  out: "./lib/server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/mindspark",
  },
});
