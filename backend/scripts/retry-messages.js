import { createDatabase } from "../src/models/database.js";
import { loadConfig } from "../src/config/env.js";
import { createMailer, forwardMessage } from "../src/services/mail.js";
const db = createDatabase();
try {
  const mailer = createMailer(loadConfig());
  const messages = await db.message.findMany({
    where: { deliveryStatus: { not: "SENT" } },
    take: 100,
  });
  let sent = 0;
  for (const message of messages)
    if (await forwardMessage(db, mailer, message)) sent++;
  console.log(`${sent} de ${messages.length} mensagens encaminhadas.`);
} finally {
  await db.$disconnect();
}
