import nodemailer from "nodemailer";

export function createMailer(config) {
  const smtp = config.smtp;
  const enabled = Boolean(smtp.host && smtp.from);
  const transport = enabled
    ? nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        requireTLS: config.production && !smtp.secure,
        auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
        connectionTimeout: 10000,
        socketTimeout: 15000,
      })
    : null;
  return {
    enabled,
    async send({ to, subject, text, replyTo }) {
      if (!transport) throw new Error("SMTP_NOT_CONFIGURED");
      await transport.sendMail({
        from: smtp.from,
        to,
        subject,
        text,
        replyTo,
        disableFileAccess: true,
        disableUrlAccess: true,
      });
    },
  };
}

export async function forwardMessage(db, mailer, message) {
  const settings = await db.siteSetting.findUnique({ where: { id: "site" } });
  if (!mailer.enabled || !settings?.officialEmail) return false;
  try {
    await mailer.send({
      to: settings.officialEmail,
      replyTo: message.email,
      subject: `[Site da Charanga] ${message.subject}`,
      text: `Nome: ${message.name}\nE-mail: ${message.email}\nTelefone: ${message.phone || "Não informado"}\n\n${message.body}\n\nMensagem ${message.id}`,
    });
    await db.message.update({
      where: { id: message.id },
      data: { deliveryStatus: "SENT" },
    });
    return true;
  } catch {
    await db.message.update({
      where: { id: message.id },
      data: { deliveryStatus: "FAILED" },
    });
    return false;
  }
}
