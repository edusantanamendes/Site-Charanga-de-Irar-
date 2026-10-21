import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { apiRoutes } from "./routes/api.js";
import { errorHandler, limiter, originGuard } from "./middlewares/security.js";
import { escapeXml } from "./utils/security.js";

const frontendDist = fileURLToPath(
  new URL("../../frontend/dist/", import.meta.url),
);
const pages = {
  "/": [
    "Charanga de Irará | Tradição, música e cultura",
    "Tradição, música e cultura que atravessam gerações. Conheça a Charanga de Irará, Bahia.",
  ],
  "/historia": [
    "Nossa história | Charanga de Irará",
    "A tradição musical da Charanga de Irará, sua ligação com a Filarmônica 25 de Dezembro e a cultura de Irará.",
  ],
  "/galeria": [
    "Galeria | Charanga de Irará",
    "Fotografias e vídeos das alvoradas, cortejos e apresentações da Charanga de Irará.",
  ],
  "/eventos": [
    "Agenda | Charanga de Irará",
    "Acompanhe a agenda de apresentações e os eventos realizados pela Charanga de Irará.",
  ],
  "/musicos": [
    "Nossos músicos | Charanga de Irará",
    "Conheça os músicos que mantêm viva a tradição da Charanga de Irará.",
  ],
  "/contato": [
    "Contato | Charanga de Irará",
    "Entre em contato para apresentações, parcerias, eventos e imprensa.",
  ],
  "/privacidade": [
    "Privacidade | Charanga de Irará",
    "Saiba como são utilizados os dados enviados à Charanga de Irará.",
  ],
};

export function createApp({ db, config, mailer, serveFrontend = true }) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", config.trustProxy);
  app.use(
    helmet({
      contentSecurityPolicy: config.production
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              fontSrc: ["'self'"],
              imgSrc: ["'self'", "data:", "blob:"],
              connectSrc: ["'self'"],
              frameSrc: [
                "https://www.youtube-nocookie.com",
                "https://player.vimeo.com",
              ],
              objectSrc: ["'none'"],
              baseUri: ["'self'"],
              formAction: ["'self'"],
              frameAncestors: ["'none'"],
            },
          }
        : false,
      crossOriginEmbedderPolicy: false,
      strictTransportSecurity: config.production ? undefined : false,
    }),
  );
  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) =>
        callback(null, !origin || config.origins.includes(origin)),
    }),
  );
  app.use(
    "/api",
    limiter(500),
    originGuard(config),
    express.json({ limit: "100kb" }),
    cookieParser(),
    (req, res, next) => {
      res.set("Cache-Control", "no-store");
      next();
    },
    apiRoutes(db, config, mailer),
  );
  app.use("/api", (req, res) =>
    res.status(404).json({ error: "Rota não encontrada." }),
  );
  app.use(
    "/uploads",
    (req, res, next) => {
      if (!/^\/[a-f0-9-]+\.webp$/.test(req.path)) return res.status(404).end();
      res.set("X-Content-Type-Options", "nosniff");
      next();
    },
    express.static(config.uploadDir, {
      maxAge: "1y",
      immutable: true,
      dotfiles: "deny",
    }),
  );
  app.get("/robots.txt", (req, res) =>
    res
      .type("text")
      .send(
        `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nSitemap: ${config.siteUrl}/sitemap.xml\n`,
      ),
  );
  app.get("/sitemap.xml", async (req, res) => {
    const events = await db.event.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    const urls = Object.keys(pages)
      .map(
        (route) => `<url><loc>${escapeXml(config.siteUrl + route)}</loc></url>`,
      )
      .concat(
        events.map(
          (event) =>
            `<url><loc>${escapeXml(`${config.siteUrl}/eventos/${event.slug}`)}</loc><lastmod>${event.updatedAt.toISOString()}</lastmod></url>`,
        ),
      );
    res
      .type("application/xml")
      .send(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`,
      );
  });
  if (serveFrontend) {
    app.use(
      express.static(frontendDist, {
        index: false,
        maxAge: config.production ? "1h" : 0,
      }),
    );
    app.get("/{*path}", async (req, res) => {
      let meta = pages[req.path];
      let status = 200;
      let event;
      if (req.path.startsWith("/eventos/")) {
        event = await db.event.findFirst({
          where: { slug: req.path.slice(9), published: true },
        });
        if (event)
          meta = [
            `${event.title} | Charanga de Irará`,
            event.description.slice(0, 160),
          ];
      }
      if (req.path.startsWith("/admin")) {
        meta = [
          "Administração | Charanga de Irará",
          "Acesso restrito à administração.",
        ];
        res.set("X-Robots-Tag", "noindex, nofollow");
      }
      if (!meta) {
        status = 404;
        meta = [
          "Página não encontrada | Charanga de Irará",
          "A página que você procura não foi encontrada.",
        ];
        res.set("X-Robots-Tag", "noindex");
      }
      let html;
      try {
        html = await fs.readFile(path.join(frontendDist, "index.html"), "utf8");
      } catch {
        return res
          .status(503)
          .type("text")
          .send(
            "Interface ainda não compilada. Execute npm run build ou npm run dev.",
          );
      }
      html = html
        .replace(
          /<title>[^<]*<\/title>/,
          () => `<title>${escapeXml(meta[0])}</title>`,
        )
        .replace(
          /(<meta name="description" content=")[^"]*/,
          (match, prefix) => `${prefix}${escapeXml(meta[1])}`,
        );
      const canonical = config.siteUrl + req.path;
      const structured = event
        ? {
            "@context": "https://schema.org",
            "@type": "MusicEvent",
            name: event.title,
            startDate: event.startsAt.toISOString(),
            ...(event.endsAt ? { endDate: event.endsAt.toISOString() } : {}),
            description: event.description,
            location: { "@type": "Place", name: event.location },
            eventStatus: `https://schema.org/${event.status === "CANCELLED" ? "EventCancelled" : event.status === "POSTPONED" ? "EventPostponed" : "EventScheduled"}`,
            url: canonical,
            organizer: {
              "@type": "MusicGroup",
              name: "Charanga de Irará",
              url: config.siteUrl,
            },
          }
        : {
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            name: "Charanga de Irará",
            url: config.siteUrl,
            description: pages["/"][1],
            location: { "@type": "Place", name: "Irará, Bahia, Brasil" },
          };
      html = html.replace(
        "</head>",
        () =>
          `<link rel="canonical" href="${escapeXml(canonical)}"/><meta property="og:title" content="${escapeXml(meta[0])}"/><meta property="og:description" content="${escapeXml(meta[1])}"/><meta property="og:url" content="${escapeXml(canonical)}"/><meta property="og:type" content="website"/><meta property="og:locale" content="pt_BR"/><script type="application/ld+json">${JSON.stringify(structured).replace(/</g, "\\u003c")}</script></head>`,
      );
      res.status(status).type("html").send(html);
    });
  }
  app.use(errorHandler);
  return app;
}
