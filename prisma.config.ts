import { config } from "dotenv";

import { defineConfig } from "prisma/config";

// .env.local diprioritaskan; .env tetap dibaca sebagai cadangan.
config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
