import "dotenv/config";
import { defineConfig } from "prisma/config";

const schemaEnv = process.env.PRISMA_SCHEMA;

let schema: string;
let datasourceUrl: string;
let migrationsPath: string;
let seedCommand: string;

switch (schemaEnv) {
  case "exam":
    schema = "./src/server/db/exam/prisma/schema.prisma";
    datasourceUrl =
      process.env.DATABASE_URL_EXAM ??
      "postgresql://user:pass@localhost:5438/exam";
    migrationsPath = "src/server/db/exam/prisma/migrations";
    seedCommand = "tsx src/server/db/exam/prisma/seed.ts";
    break;

  case "auth":
  default:
    schema = "./src/server/db/auth/prisma/schema.prisma";
    datasourceUrl =
      process.env.DATABASE_URL ??
      "postgresql://user:pass@localhost:5438/auth";
    migrationsPath = "src/server/db/auth/prisma/migrations";
    seedCommand = "tsx src/server/db/auth/prisma/seed.ts";
}

export default defineConfig({
  schema,
  datasource: { url: datasourceUrl },
  migrations: {
    path: migrationsPath,
    seed: seedCommand,
  },
});
