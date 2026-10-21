import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import fs from "node:fs/promises";
import path from "node:path";

export async function startLocalDatabase({
  memory = false,
  port = 54329,
} = {}) {
  const pg = await PGlite.create(
    memory ? undefined : path.resolve(".local-db"),
  );
  await pg.exec(
    "CREATE TABLE IF NOT EXISTS _charanga_local_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())",
  );
  const directory = path.resolve("backend/prisma/migrations");
  for (const entry of (await fs.readdir(directory, { withFileTypes: true }))
    .filter((value) => value.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))) {
    const applied = await pg.query(
      "SELECT name FROM _charanga_local_migrations WHERE name = $1",
      [entry.name],
    );
    if (!applied.rows.length) {
      const sql = (
        await fs.readFile(
          path.join(directory, entry.name, "migration.sql"),
          "utf8",
        )
      ).replace(/^\uFEFF/, "");
      await pg.transaction(async (tx) => {
        await tx.exec(sql);
        await tx.query(
          "INSERT INTO _charanga_local_migrations(name) VALUES ($1)",
          [entry.name],
        );
      });
    }
  }
  const socket = new PGLiteSocketServer({ db: pg, port, host: "127.0.0.1" });
  await socket.start();
  const connection = socket.getServerConn();
  const url = new URL(`postgresql://postgres@${connection}/postgres`);
  url.searchParams.set("connection_limit", "1");
  url.searchParams.set("sslmode", "disable");
  url.searchParams.set("pool_timeout", "30");
  return {
    url: url.toString(),
    pg,
    async close() {
      await socket.stop();
      await pg.close();
    },
  };
}
