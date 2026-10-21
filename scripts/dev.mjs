import "dotenv/config";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { startLocalDatabase } from "./local-db.mjs";
import { createDatabase } from "../backend/src/models/database.js";
import { seed } from "../backend/prisma/seed.js";
import { loadConfig } from "../backend/src/config/env.js";
import { createMailer } from "../backend/src/services/mail.js";
import { createApp } from "../backend/src/app.js";

process.env.NODE_ENV = "development";
let local;
if (!process.env.DATABASE_URL) {
  console.log(
    "Iniciando PostgreSQL local persistente (desenvolvimento, somente loopback)…",
  );
  local = await startLocalDatabase();
  process.env.DATABASE_URL = local.url;
}
process.env.SESSION_SECRET ||= randomBytes(32).toString("hex");
const db = createDatabase();
await seed(db);
const config = loadConfig();
const app = createApp({
  db,
  config,
  mailer: createMailer(config),
  serveFrontend: false,
});
const api = app.listen(config.port, "127.0.0.1", () =>
  console.log(`API: http://localhost:${config.port}`),
);
const vite = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "--config",
    "frontend/vite.config.js",
    "--host",
    "127.0.0.1",
    "--port",
    "3000",
    "--strictPort",
  ],
  { stdio: "inherit", windowsHide: true },
);
let stopping = false;
async function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  vite.kill();
  api.closeAllConnections();
  await new Promise((resolve) => api.close(resolve));
  await db.$disconnect();
  await local?.close();
  process.exit(code);
}
vite.on("exit", (code) => {
  if (!stopping) void stop(code || 0);
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => void stop());
