import { PrismaClient } from "@prisma/client";

export function createDatabase(url = process.env.DATABASE_URL) {
  if (!url)
    throw new Error(
      "DATABASE_URL não configurada. Use npm run dev para o banco local ou configure PostgreSQL.",
    );
  return new PrismaClient({ datasourceUrl: url, log: ["error"] });
}
