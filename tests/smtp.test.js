import { test } from "node:test";
import assert from "node:assert/strict";
import { SMTPServer } from "smtp-server";
import { createMailer } from "../backend/src/services/mail.js";
import { loadConfig } from "../backend/src/config/env.js";

test("Nodemailer entrega mensagem em servidor SMTP local, com Reply-To", async () => {
  let delivered;
  const server = new SMTPServer({
    secure: false,
    authOptional: true,
    disabledCommands: ["AUTH", "STARTTLS"],
    onData(stream, session, callback) {
      let content = "";
      stream.on("data", (chunk) => {
        content += chunk.toString();
      });
      stream.on("end", () => {
        delivered = { envelope: session.envelope, content };
        callback();
      });
    },
  });
  await new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  try {
    const config = loadConfig({
      SMTP_HOST: "127.0.0.1",
      SMTP_PORT: String(server.server.address().port),
      MAIL_FROM: "site@example.invalid",
    });
    const mailer = createMailer(config);
    await mailer.send({
      to: "oficial@example.invalid",
      replyTo: "visitante@example.invalid",
      subject: "Teste local de encaminhamento",
      text: "Mensagem exclusiva do teste SMTP, sem envio externo.",
    });
    assert.equal(delivered.envelope.mailFrom.address, "site@example.invalid");
    assert.equal(
      delivered.envelope.rcptTo[0].address,
      "oficial@example.invalid",
    );
    assert.match(delivered.content, /Reply-To: visitante@example.invalid/);
    assert.match(delivered.content, /Mensagem exclusiva/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
