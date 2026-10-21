import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

test(
  "Prisma migrate deploy aplica migrações em banco vazio e pode ser repetido",
  { timeout: 60_000 },
  async () => {
    const pg = await PGlite.create();
    const socket = new PGLiteSocketServer({
      db: pg,
      port: 0,
      host: "127.0.0.1",
    });
    await socket.start();
    const url = `postgresql://postgres@${socket.getServerConn()}/postgres?sslmode=disable&connection_limit=1`;
    async function deploy() {
      return new Promise((resolve, reject) => {
        const child = spawn(
          process.execPath,
          [
            "node_modules/prisma/build/index.js",
            "migrate",
            "deploy",
            "--schema",
            "backend/prisma/schema.prisma",
          ],
          {
            env: {
              ...process.env,
              DATABASE_URL: url,
              PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK: "1",
            },
            windowsHide: true,
          },
        );
        let output = "";
        child.stdout.on("data", (chunk) => {
          output += chunk;
        });
        child.stderr.on("data", (chunk) => {
          output += chunk;
        });
        child.on("error", reject);
        child.on("exit", (code) =>
          code === 0 ? resolve(output) : reject(new Error(output)),
        );
      });
    }
    try {
      assert.match(
        await deploy(),
        /successfully applied|No pending migrations/,
      );
      assert.match(await deploy(), /No pending migrations/);
      const result = await pg.query(
        "SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL ORDER BY migration_name",
      );
      assert.equal(result.rows.length, 2);
      const columns = await pg.query(
        "SELECT column_name FROM information_schema.columns WHERE table_name = 'SiteSetting'",
      );
      assert.ok(
        columns.rows.some((item) => item.column_name === "heroImageAlt"),
      );
    } finally {
      await socket.stop();
      await pg.close();
    }
  },
);
