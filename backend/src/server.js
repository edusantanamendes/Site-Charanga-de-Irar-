import { createApp } from "./app.js";
import { loadConfig } from "./config/env.js";
import { createDatabase } from "./models/database.js";
import { createMailer, forwardMessage } from "./services/mail.js";

const config = loadConfig();
const db = createDatabase();
await db.$connect();
const mailer = createMailer(config);
const app = createApp({ db, config, mailer });
const server = app.listen(
  config.port,
  config.production ? "0.0.0.0" : "127.0.0.1",
  () => console.log(`Charanga API: http://localhost:${config.port}`),
);
let busy = false;
const retryTimer = setInterval(async () => {
  if (busy || !mailer.enabled) return;
  busy = true;
  try {
    const pending = await db.message.findMany({
      where: { deliveryStatus: { in: ["PENDING", "FAILED"] } },
      orderBy: { createdAt: "asc" },
      take: 10,
    });
    for (const message of pending) await forwardMessage(db, mailer, message);
    await db.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    await db.passwordReset.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  } catch {
    console.error("Mail retry task failed.");
  } finally {
    busy = false;
  }
}, 60_000);
retryTimer.unref();
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => {
    clearInterval(retryTimer);
    server.close(async () => {
      await db.$disconnect();
      process.exit(0);
    });
  });
