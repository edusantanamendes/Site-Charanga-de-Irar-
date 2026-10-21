import "dotenv/config";
import path from "node:path";

export function loadConfig(env = process.env) {
  const production = env.NODE_ENV === "production";
  if (
    production &&
    (!env.DATABASE_URL ||
      (env.SESSION_SECRET || "").length < 32 ||
      !env.SITE_URL?.startsWith("https://"))
  ) {
    throw new Error(
      "Production requires DATABASE_URL, SESSION_SECRET (32+ characters) and HTTPS SITE_URL.",
    );
  }
  const siteUrl = (env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  return {
    production,
    siteUrl,
    port: Number(env.PORT || 3001),
    trustProxy: Number(env.TRUST_PROXY || 0),
    sessionSecret: env.SESSION_SECRET || null,
    uploadDir: path.resolve(env.UPLOAD_DIR || "uploads"),
    origins: production
      ? [new URL(siteUrl).origin]
      : [
          new URL(siteUrl).origin,
          "http://localhost:3000",
          "http://127.0.0.1:3000",
        ],
    smtp: {
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT || 587),
      secure: env.SMTP_SECURE === "true",
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
      from: env.MAIL_FROM,
    },
  };
}
