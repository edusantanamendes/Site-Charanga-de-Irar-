import { startLocalDatabase } from "../../scripts/local-db.mjs";
import { createDatabase } from "../../backend/src/models/database.js";
import { seed } from "../../backend/prisma/seed.js";
import { createApp } from "../../backend/src/app.js";
import { loadConfig } from "../../backend/src/config/env.js";
import { randomToken } from "../../backend/src/utils/security.js";
import bcrypt from "bcryptjs";
if (!process.env.E2E_PASSWORD)
  throw new Error("Run through the Playwright test runner.");
const local = await startLocalDatabase({ memory: true, port: 0 });
const db = createDatabase(local.url);
await seed(db);
await db.administrator.create({
  data: {
    name: "Administrador de testes",
    email: "e2e@example.invalid",
    passwordHash: await bcrypt.hash(process.env.E2E_PASSWORD, 12),
  },
});
const config = loadConfig({
  SITE_URL: "http://127.0.0.1:3100",
  SESSION_SECRET: randomToken(),
  UPLOAD_DIR: "test-results/e2e-uploads",
});
const app = createApp({
  db,
  config,
  mailer: {
    enabled: false,
    send: async () => {
      throw new Error("SMTP disabled in E2E");
    },
  },
});
const server = app.listen(3100, "127.0.0.1");
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, async () => {
    server.closeAllConnections();
    server.close();
    await db.$disconnect();
    await local.close();
    process.exit(0);
  });
