import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import {
  randomToken,
  digest,
  safeEqual,
} from "../backend/src/utils/security.js";
import { startLocalDatabase } from "../scripts/local-db.mjs";
import { createDatabase } from "../backend/src/models/database.js";
import { seed } from "../backend/prisma/seed.js";
import { createApp } from "../backend/src/app.js";
import { loadConfig } from "../backend/src/config/env.js";
import { createMailer } from "../backend/src/services/mail.js";
import request from "supertest";
import bcrypt from "bcryptjs";
import sharp from "sharp";

let local, db, app, config, agent, csrf, admin, sessionCookie, imageUrl;
const received = [];
const password = randomToken().slice(0, 24);
const origin = "http://localhost:3000";
const mailer = {
  enabled: true,
  send: async (message) => {
    received.push(message);
  },
};
function adminRequest(method, url, body) {
  const query = agent[method](`/api/admin${url}`)
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf);
  return body ? query.send(body) : query;
}
before(
  async () => {
    local = await startLocalDatabase({ memory: true, port: 0 });
    db = createDatabase(local.url);
    await seed(db);
    config = loadConfig({
      SITE_URL: origin,
      SESSION_SECRET: randomToken(),
      UPLOAD_DIR: path.resolve("test-results/integration-uploads"),
    });
    admin = await db.administrator.create({
      data: {
        name: "Administrador de teste",
        email: "admin@example.invalid",
        passwordHash: await bcrypt.hash(password, 12),
      },
    });
    app = createApp({ db, config, mailer });
    agent = request.agent(app);
  },
  { timeout: 60_000 },
);
after(async () => {
  await db?.$disconnect();
  await local?.close();
});

test("migrações e seed são idempotentes; não criam dados oficiais fictícios", async () => {
  await seed(db);
  assert.equal(await db.event.count(), 0);
  assert.equal(await db.musician.count(), 0);
  assert.equal(await db.photograph.count(), 0);
  assert.equal(await db.category.count(), 5);
  const response = await request(app).get("/api/public/site").expect(200);
  assert.equal(response.body.settings.locationLabel, "Irará, Bahia");
  assert.match(
    response.body.contents.find((item) => item.year === 1954).body,
    /não a data de fundação da Charanga/,
  );
  assert.equal(response.body.settings.officialEmail, "");
});
test("admin exige autenticação; origem externa não pode fazer login", async () => {
  await request(app).get("/api/admin/events").expect(401);
  await request(app)
    .post("/api/auth/login")
    .set("Origin", "https://outside.invalid")
    .send({ email: admin.email, password })
    .expect(403);
  await request(app)
    .post("/api/auth/login")
    .send({ email: admin.email, password })
    .expect(403);
  await request(app)
    .post("/api/auth/login")
    .set("Origin", origin)
    .send({ email: admin.email, password: "incorrect" })
    .expect(401);
  assert.equal(
    (await db.administrator.findUnique({ where: { id: admin.id } }))
      .failedLogins,
    1,
  );
});
test("login cria cookie HttpOnly, sessão com hash e token CSRF", async () => {
  const response = await agent
    .post("/api/auth/login")
    .set("Origin", origin)
    .send({ email: admin.email, password })
    .expect(200);
  csrf = response.body.csrfToken;
  sessionCookie = response.headers["set-cookie"][0].split(";")[0];
  assert.match(response.headers["set-cookie"][0], /HttpOnly/);
  assert.match(response.headers["set-cookie"][0], /SameSite=Strict/);
  assert.equal("passwordHash" in response.body.user, false);
  const session = await db.session.findFirst();
  assert.notEqual(session.tokenHash, sessionCookie.split("=")[1]);
  const checked = await agent.get("/api/auth/session").expect(200);
  assert.equal(checked.body.csrfToken, csrf);
});
test("mutações autenticadas exigem CSRF, inclusive tokens com Unicode inválido", async () => {
  await agent
    .post("/api/admin/categories")
    .set("Origin", origin)
    .send({ name: "Bloqueado" })
    .expect(403);
  await agent
    .post("/api/admin/categories")
    .set("Origin", origin)
    .set("X-CSRF-Token", "á".repeat(64))
    .send({ name: "Bloqueado" })
    .expect(403);
  assert.equal(safeEqual("á".repeat(64), "a".repeat(64)), false);
});
test("upload valida conteúdo real e gera WebP otimizado", async () => {
  await adminRequest("post", "/upload")
    .attach("image", Buffer.from("<svg><script>alert(1)</script></svg>"), {
      filename: "fake.jpg",
      contentType: "image/jpeg",
    })
    .expect(422);
  const png = await sharp({
    create: { width: 40, height: 30, channels: 3, background: "#102a43" },
  })
    .png()
    .toBuffer();
  const response = await adminRequest("post", "/upload")
    .attach("image", png, "official-test.png")
    .expect(201);
  imageUrl = response.body.url;
  assert.match(imageUrl, /^\/uploads\/[\w-]+\.webp$/);
  const delivered = await request(app).get(imageUrl).expect(200);
  assert.match(delivered.headers["content-type"], /image\/webp/);
  const metadata = await sharp(delivered.body).metadata();
  assert.equal(metadata.format, "webp");
  assert.equal(metadata.exif, undefined);
  await request(app).get("/uploads/test.svg").expect(404);
});
test("eventos: CRUD, rascunhos privados, validação, slug único e página individual", async () => {
  const data = {
    title: "Evento de teste automatizado",
    slug: "evento-teste",
    startsAt: "2099-01-01T06:00:00-03:00",
    location: "Local de teste",
    description:
      "Conteúdo exclusivo do banco de testes, não representa evento oficial.",
    status: "CONFIRMED",
    imageUrl,
    published: false,
  };
  const response = await adminRequest("post", "/events", data).expect(201);
  const id = response.body.id;
  assert.equal((await request(app).get("/api/public/events")).body.length, 0);
  await request(app).get("/api/public/events/evento-teste").expect(404);
  await adminRequest("post", "/events", data).expect(409);
  await adminRequest("put", `/events/${id}`, {
    ...data,
    endsAt: "2000-01-01T06:00:00-03:00",
  }).expect(422);
  await adminRequest("put", `/events/${id}`, {
    ...data,
    published: true,
  }).expect(200);
  assert.equal((await request(app).get("/api/public/events")).body.length, 1);
  await request(app).get("/api/public/events/evento-teste").expect(200);
  await adminRequest("get", `/events/${id}`).expect(200);
  await adminRequest("get", "/events?page=1&limit=1")
    .expect(200)
    .then((r) => assert.equal(r.body.total, 1));
  await adminRequest("delete", `/events/${id}`).expect(204);
  await request(app).get("/api/public/events/evento-teste").expect(404);
});
test("CRUD integrado de músicos, categorias, fotos, vídeos, conteúdo e redes sociais", async () => {
  const category = (
    await adminRequest("post", "/categories", {
      name: "Categoria de teste",
    }).expect(201)
  ).body;
  const cases = [
    [
      "musicians",
      {
        name: "Perfil apenas de teste",
        instrument: "Instrumento de teste",
        bio: "Dados isolados do banco de testes.",
        imageUrl,
        order: 2,
        published: false,
      },
      "/api/public/musicians",
    ],
    [
      "photographs",
      {
        title: "Imagem de teste",
        alt: "Um quadrado azul criado por um teste automatizado.",
        url: imageUrl,
        categoryId: category.id,
        published: false,
      },
      "/api/public/gallery",
    ],
    [
      "videos",
      {
        title: "Vídeo de teste",
        url: "https://www.youtube.com/watch?v=abcdefghijk",
        description: "Cadastro apenas para testar a API.",
        categoryId: category.id,
        published: false,
      },
      "/api/public/gallery",
    ],
    [
      "contents",
      {
        key: "conteudo-teste",
        title: "Texto de teste",
        body: "Texto exclusivo para testar o gerenciamento.",
        section: "historia",
        order: 99,
        published: false,
      },
      "/api/public/site",
    ],
    [
      "socials",
      {
        label: "Canal de teste",
        url: "https://example.invalid/",
        order: 1,
        published: false,
      },
      "/api/public/site",
    ],
  ];
  for (const [resource, data, publicUrl] of cases) {
    const created = (
      await adminRequest("post", `/${resource}`, data).expect(201)
    ).body;
    await adminRequest("get", `/${resource}/${created.id}`).expect(200);
    let result = (await request(app).get(publicUrl).expect(200)).body;
    const getList = () =>
      Array.isArray(result)
        ? result
        : resource === "photographs"
          ? result.photographs
          : resource === "videos"
            ? result.videos
            : resource === "contents"
              ? result.contents
              : result.socials;
    assert.equal(
      getList().some((item) => item.id === created.id),
      false,
    );
    await adminRequest("put", `/${resource}/${created.id}`, {
      ...data,
      published: true,
    }).expect(200);
    result = (await request(app).get(publicUrl).expect(200)).body;
    assert.equal(
      getList().some((item) => item.id === created.id),
      true,
    );
    await adminRequest("delete", `/${resource}/${created.id}`).expect(204);
  }
  await adminRequest("put", `/categories/${category.id}`, {
    name: "Categoria atualizada",
  }).expect(200);
  await adminRequest("delete", `/categories/${category.id}`).expect(204);
  await adminRequest("post", "/videos", {
    title: "Inválido",
    url: "javascript:alert(1)",
    description: "URL inválida",
    published: true,
  }).expect(422);
  await adminRequest("post", "/socials", {
    label: "Inválido",
    url: "javascript:alert(1)",
    published: true,
  }).expect(422);
});
test("excluir categoria preserva fotografias sem categoria", async () => {
  const category = (
    await adminRequest("post", "/categories", { name: "Temporária" })
  ).body;
  const photo = (
    await adminRequest("post", "/photographs", {
      title: "Teste de relação",
      alt: "Imagem azul criada por teste.",
      url: imageUrl,
      categoryId: category.id,
      published: true,
    })
  ).body;
  await adminRequest("delete", `/categories/${category.id}`).expect(204);
  assert.equal(
    (await db.photograph.findUnique({ where: { id: photo.id } })).categoryId,
    null,
  );
  await adminRequest("delete", `/photographs/${photo.id}`).expect(204);
});
test("configurações e contato persistem e encaminham e-mail sem expor dados privados", async () => {
  await adminRequest("put", "/settings", {
    name: "Charanga de Irará",
    tagline: "Tradição, música e cultura.",
    locationLabel: "Irará, Bahia",
    officialEmail: "charanga@example.invalid",
    whatsapp: "",
  }).expect(200);
  const data = {
    name: "Visitante de teste",
    email: "visitante@example.invalid",
    phone: "(75) 00000-0000",
    subject: "Outros assuntos",
    body: "Mensagem criada pelo teste de integração da aplicação.",
    consent: true,
    website: "",
  };
  await request(app)
    .post("/api/public/contact")
    .set("Origin", origin)
    .send({ ...data, consent: false })
    .expect(422);
  await request(app)
    .post("/api/public/contact")
    .set("Origin", origin)
    .send(data)
    .expect(201);
  const message = await db.message.findFirst();
  assert.equal(message.deliveryStatus, "SENT");
  assert.equal(message.status, "NEW");
  assert.equal(received.at(-1).to, "charanga@example.invalid");
  assert.equal(received.at(-1).replyTo, data.email);
  await request(app).get(`/api/admin/messages/${message.id}`).expect(401);
  await adminRequest("put", `/messages/${message.id}`, {
    ...data,
    status: "READ",
  }).expect(200);
  await adminRequest("delete", `/messages/${message.id}`).expect(204);
  await request(app)
    .post("/api/public/contact")
    .set("Origin", origin)
    .send({ ...data, website: "spam.invalid" })
    .expect(201);
  assert.equal(await db.message.count(), 0);
});
test("falha no SMTP preserva a mensagem e permite reenviar pelo painel", async () => {
  const failing = createApp({
    db,
    config,
    mailer: {
      enabled: true,
      send: async () => {
        throw new Error("offline");
      },
    },
  });
  const data = {
    name: "Teste de falha",
    email: "teste@example.invalid",
    subject: "Parcerias",
    body: "A mensagem precisa ser preservada mesmo se o e-mail falhar.",
    consent: true,
  };
  await request(failing)
    .post("/api/public/contact")
    .set("Origin", origin)
    .send(data)
    .expect(201);
  const message = await db.message.findFirst();
  assert.equal(message.deliveryStatus, "FAILED");
  await adminRequest("post", `/messages/${message.id}/retry`).expect(200);
  assert.equal(
    (await db.message.findUnique({ where: { id: message.id } })).deliveryStatus,
    "SENT",
  );
});
test("contato limita tentativas e valida dados no servidor", async () => {
  const isolated = createApp({ db, config, mailer });
  for (let index = 0; index < 5; index++)
    await request(isolated)
      .post("/api/public/contact")
      .set("Origin", origin)
      .send({})
      .expect(422);
  await request(isolated)
    .post("/api/public/contact")
    .set("Origin", origin)
    .send({})
    .expect(429);
});
test("sem SMTP, contatos continuam salvos como pendentes", async () => {
  const disabled = createMailer(loadConfig({ SITE_URL: origin }));
  assert.equal(disabled.enabled, false);
  const isolated = createApp({ db, config, mailer: disabled });
  await request(isolated)
    .post("/api/public/contact")
    .set("Origin", origin)
    .send({
      name: "Teste sem SMTP",
      email: "teste@example.invalid",
      subject: "Imprensa",
      body: "Este contato deve permanecer salvo para leitura na administração.",
      consent: true,
    })
    .expect(201);
  const message = await db.message.findFirst({
    where: { name: "Teste sem SMTP" },
  });
  assert.equal(message.deliveryStatus, "PENDING");
});
test("SEO no servidor, 404 real, sitemap e headers de segurança", async () => {
  const response = await request(app).get("/historia").expect(200);
  assert.match(response.text, /Nossa história \| Charanga de Irará/);
  assert.match(response.text, /rel="canonical"/);
  assert.match(response.text, /application\/ld\+json/);
  assert.equal(response.headers["x-content-type-options"], "nosniff");
  await request(app).get("/nao-existe").expect(404);
  await request(app)
    .get("/admin")
    .expect(200)
    .then((r) => assert.match(r.headers["x-robots-tag"], /noindex/));
  await request(app)
    .get("/sitemap.xml")
    .expect(200)
    .then((r) => assert.match(r.text, /\/historia/));
  await request(app)
    .get("/robots.txt")
    .expect(200)
    .then((r) => assert.match(r.text, /Disallow: \/admin/));
  assert.throws(
    () => loadConfig({ NODE_ENV: "production" }),
    /Production requires/,
  );
});
test("logout invalida a sessão e bloqueio por tentativas é persistido no banco", async () => {
  await agent
    .post("/api/auth/logout")
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf)
    .expect(200);
  await request(app)
    .get("/api/admin/events")
    .set("Cookie", sessionCookie)
    .expect(401);
  for (let index = 0; index < 10; index++)
    await request(app)
      .post("/api/auth/login")
      .set("Origin", origin)
      .send({ email: admin.email, password: "wrong" })
      .expect(401);
  const account = await db.administrator.findUnique({
    where: { id: admin.id },
  });
  assert.ok(account.lockedUntil > new Date());
  await request(app)
    .post("/api/auth/login")
    .set("Origin", origin)
    .send({ email: admin.email, password })
    .expect(401);
});
test("recuperação genérica, token com hash, expiração e uso único invalidam sessões", async () => {
  await db.administrator.update({
    where: { id: admin.id },
    data: { failedLogins: 0, lockedUntil: null },
  });
  const first = await request(app)
    .post("/api/auth/recover")
    .set("Origin", origin)
    .send({ email: "unknown@example.invalid" })
    .expect(200);
  const second = await request(app)
    .post("/api/auth/recover")
    .set("Origin", origin)
    .send({ email: admin.email })
    .expect(200);
  assert.equal(first.body.message, second.body.message);
  const token = received.at(-1).text.match(/token=([a-f0-9]{64})/)[1];
  const reset = await db.passwordReset.findFirst();
  assert.equal(reset.tokenHash, digest(token, config.sessionSecret));
  const nextPassword = randomToken().slice(0, 24);
  await request(app)
    .post("/api/auth/reset")
    .set("Origin", origin)
    .send({ token, password: "short" })
    .expect(422);
  await request(app)
    .post("/api/auth/reset")
    .set("Origin", origin)
    .send({ token, password: nextPassword })
    .expect(200);
  await request(app)
    .post("/api/auth/reset")
    .set("Origin", origin)
    .send({ token, password: nextPassword })
    .expect(400);
  await request(app)
    .post("/api/auth/login")
    .set("Origin", origin)
    .send({ email: admin.email, password: nextPassword })
    .expect(200);
  const expired = randomToken();
  await db.passwordReset.create({
    data: {
      tokenHash: digest(expired, config.sessionSecret),
      adminId: admin.id,
      expiresAt: new Date(0),
    },
  });
  await request(app)
    .post("/api/auth/reset")
    .set("Origin", origin)
    .send({ token: expired, password: nextPassword })
    .expect(400);
});
