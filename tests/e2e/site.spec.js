import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

async function capture(page, testInfo, name) {
  const directory = path.resolve("test-results/populated");
  await fs.mkdir(directory, { recursive: true });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: path.join(directory, `${name}-${testInfo.project.name}.png`),
    fullPage: true,
  });
}

test("galeria recebe upload, filtra, amplia e permite navegação por teclado", async ({
  page,
}, testInfo) => {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail", { exact: true }).fill("e2e@example.invalid");
  await page
    .getByLabel("Senha", { exact: true })
    .fill(process.env.E2E_PASSWORD);
  await page.getByRole("button", { name: "Entrar no painel" }).click();
  await expect(page.locator("h1")).toContainText("Olá");
  await page.goto("/admin/photographs");
  await page.getByRole("button", { name: "Adicionar fotografia" }).click();
  const title = `Foto E2E ${testInfo.project.name}`;
  await page.getByLabel("Título *", { exact: true }).fill(title);
  const buffer = await sharp({
    create: { width: 600, height: 800, channels: 3, background: "#102a43" },
  })
    .png()
    .toBuffer();
  await page
    .locator("input[type=file]")
    .setInputFiles({ name: "test.png", mimeType: "image/png", buffer });
  await expect(page.locator(".image-upload img")).toBeVisible();
  await page
    .getByLabel("Descrição da imagem para acessibilidade")
    .fill(
      "Imagem azul gerada pelo teste automatizado; não é fotografia oficial.",
    );
  await page
    .getByRole("combobox", { name: "Categoria", exact: true })
    .selectOption({ label: "Alvoradas" });
  await page.getByRole("checkbox", { name: "Publicar no site" }).check();
  await capture(page, testInfo, "photo-editor");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.locator(".form-alert.success")).toContainText(
    "Registro salvo",
  );
  const session = await (await page.request.get("/api/auth/session")).json();
  const photos = await (
    await page.request.get("/api/admin/photographs?limit=100")
  ).json();
  const original = photos.items.find((item) => item.title === title);
  const second = await page.request.post("/api/admin/photographs", {
    headers: {
      Origin: "http://127.0.0.1:3100",
      "X-CSRF-Token": session.csrfToken,
    },
    data: { ...original, title: title + " segunda", order: 1 },
  });
  expect(second.ok()).toBe(true);
  const secondPhoto = await second.json();
  await page.goto("/galeria");
  await page
    .getByRole("combobox", { name: "Categoria", exact: true })
    .selectOption({ label: "Alvoradas" });
  await capture(page, testInfo, "gallery");
  await page.locator(".media-card").filter({ hasText: title }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".lightbox-caption")).toContainText(title);
  await capture(page, testInfo, "lightbox");
  const before = await page.locator(".lightbox-caption").innerText();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".lightbox-caption")).not.toHaveText(before);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("combobox", { name: "Categoria", exact: true })
    .selectOption({ label: "Eventos" });
  await expect(page.locator(".media-card")).toHaveCount(0);
  await expect(page.locator(".empty-state")).toContainText(
    "Nenhum registro nesta seleção",
  );
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(
    page.getByRole("combobox", { name: "Categoria", exact: true }),
  ).toHaveValue("all");
  await expect(page.locator(".media-card")).toHaveCount(2);
  await expect(
    page.getByRole("button", { name: /^Fotografias/ }).locator(".filter-count"),
  ).toHaveText("2");
  const headers = {
    Origin: "http://127.0.0.1:3100",
    "X-CSRF-Token": session.csrfToken,
  };
  const settings = await (await page.request.get("/api/admin/settings")).json();
  expect(
    (
      await page.request.put("/api/admin/settings", {
        headers,
        data: {
          ...settings,
          heroImageUrl: original.url,
          heroImageAlt: "Imagem azul exclusiva do teste de destaque.",
        },
      })
    ).ok(),
  ).toBe(true);
  await page.goto("/");
  await expect(page.locator(".hero-photo img")).toHaveAttribute(
    "alt",
    "Imagem azul exclusiva do teste de destaque.",
  );
  await expect(
    page.locator(".tradition-lead .archive-figure img"),
  ).toHaveAttribute("src", original.url);
  await expect(page.locator(".home-gallery .media-card")).toHaveCount(2);
  const programmeBounds = await page.locator(".home-programme").boundingBox();
  const galleryBounds = await page.locator(".home-gallery").boundingBox();
  expect(galleryBounds.width).toBeCloseTo(programmeBounds.width, 0);
  await capture(page, testInfo, "home");
  await page.locator(".home-gallery .media-card").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".lightbox-caption")).toContainText(title);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const musicianIds = [];
  try {
    for (const [suffix, imageUrl] of [
      ["com retrato", original.url],
      ["sem retrato", null],
    ]) {
      const response = await page.request.post("/api/admin/musicians", {
        headers,
        data: {
          name: `Integrante E2E ${testInfo.project.name} ${suffix}`,
          instrument: "Saxofone",
          bio: "Perfil criado exclusivamente no banco isolado de testes da interface.",
          imageUrl,
          published: true,
        },
      });
      expect(response.ok()).toBe(true);
      musicianIds.push((await response.json()).id);
    }
    await page.goto("/musicos");
    const withPortrait = page.locator(".musician-card").filter({
      hasText: `Integrante E2E ${testInfo.project.name} com retrato`,
    });
    const withoutPortrait = page.locator(".musician-card").filter({
      hasText: `Integrante E2E ${testInfo.project.name} sem retrato`,
    });
    await expect(withPortrait.locator("img")).toHaveAttribute(
      "src",
      original.url,
    );
    await expect(withoutPortrait.locator(".musician-monogram")).toHaveText(
      "IE",
    );
    await expect(page.locator("main")).not.toContainText(
      "Fotografia a adicionar",
    );
    await capture(page, testInfo, "musicians");
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(scan.violations.map((issue) => issue.id)).toEqual([]);
  } finally {
    for (const id of musicianIds) {
      expect(
        (
          await page.request.delete(`/api/admin/musicians/${id}`, { headers })
        ).ok(),
      ).toBe(true);
    }
  }
  expect(
    (
      await page.request.put("/api/admin/settings", { headers, data: settings })
    ).ok(),
  ).toBe(true);
  for (const id of [original.id, secondPhoto.id])
    expect(
      (
        await page.request.delete(`/api/admin/photographs/${id}`, { headers })
      ).ok(),
    ).toBe(true);
});

test("não há rolagem horizontal em celular estreito, tablet e notebook", async ({
  page,
}) => {
  for (const width of [320, 768, 1024, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/historia",
      "/contato",
      "/galeria",
      "/eventos",
      "/musicos",
      "/admin/login",
    ]) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${route} at ${width}px`,
      ).toBe(true);
    }
  }
});

test("o redesign respeita títulos e textos personalizados no painel", async ({
  page,
}, testInfo) => {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail", { exact: true }).fill("e2e@example.invalid");
  await page
    .getByLabel("Senha", { exact: true })
    .fill(process.env.E2E_PASSWORD);
  await page.getByRole("button", { name: "Entrar no painel" }).click();
  await expect(page.locator("h1")).toContainText("Olá");
  const session = await (await page.request.get("/api/auth/session")).json();
  const data = await (
    await page.request.get("/api/admin/contents?limit=100")
  ).json();
  const original = data.items.find((item) => item.key === "page-gallery");
  expect(original).toBeTruthy();
  const headers = {
    Origin: "http://127.0.0.1:3100",
    "X-CSRF-Token": session.csrfToken,
  };
  const title = "Acervo de fotografias e vídeos da Charanga";
  const body =
    "Texto institucional personalizado exclusivamente no banco isolado de testes.";
  try {
    expect(
      (
        await page.request.put(`/api/admin/contents/${original.id}`, {
          headers,
          data: { ...original, title, body },
        })
      ).ok(),
    ).toBe(true);
    if (testInfo.project.name === "mobile")
      await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("/galeria");
    await expect(page.locator("h1")).toHaveText(title);
    await expect(page.locator(".page-intro")).toHaveText(body);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  } finally {
    expect(
      (
        await page.request.put(`/api/admin/contents/${original.id}`, {
          headers,
          data: original,
        })
      ).ok(),
    ).toBe(true);
  }
  await page.goto("/galeria");
  await expect(page.locator("h1")).toHaveText("Galeria");
});

test("páginas públicas, navegação, responsividade e acessibilidade", async ({
  page,
}, testInfo) => {
  const errors = [];
  const accessibilityIssues = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const pages = [
    ["/", "Charanga"],
    ["/historia", "Nossa história"],
    ["/galeria", "Galeria"],
    ["/eventos", "Agenda"],
    ["/musicos", "Nossos músicos"],
    ["/contato", "Fale com a Charanga"],
    ["/privacidade", "Política de privacidade"],
  ];
  for (const [url, heading] of pages) {
    await page.goto(url);
    await expect(page.locator("h1")).toContainText(heading);
    await expect(page.locator(".loading-state")).toHaveCount(0);
    await expect(page.locator(".error-state")).toHaveCount(0);
    if (url === "/historia") {
      const chapter = page
        .getByRole("navigation", { name: "Nesta história" })
        .getByRole("link")
        .last();
      const href = await chapter.getAttribute("href");
      await chapter.click();
      await expect(page.locator(href).getByRole("heading")).toBeVisible();
      const headingBounds = await page
        .locator(href)
        .getByRole("heading")
        .boundingBox();
      const headerBounds = await page.locator(".header").boundingBox();
      expect(headingBounds.y).toBeGreaterThanOrEqual(
        headerBounds.y + headerBounds.height,
      );
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    accessibilityIssues.push(
      ...scan.violations.map((item) => ({
        url,
        id: item.id,
        impact: item.impact,
        nodes: item.nodes.map((node) => node.target),
      })),
    );
  }
  expect(accessibilityIssues).toEqual([]);
  await page.goto("/");
  await page.locator(".hero-art").waitFor();
  const screenshotDir = path.resolve("test-results/previews");
  await fs.mkdir(screenshotDir, { recursive: true });
  await page.screenshot({
    path: path.join(screenshotDir, `home-${testInfo.project.name}.png`),
    fullPage: true,
  });
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
    await expect(page.locator("#menu-mobile")).toBeVisible();
    await page
      .locator("#menu-mobile")
      .getByRole("link", { name: "Nossa história" })
      .focus();
    await page.keyboard.press("Escape");
    await expect(page.locator("#menu-mobile")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Abrir menu", exact: true }),
    ).toBeFocused();
    await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
    await page
      .locator("#menu-mobile")
      .getByRole("link", { name: "Nossa história" })
      .click();
    await expect(page).toHaveURL("/historia");
    await expect(page.locator("#menu-mobile")).toHaveCount(0);
  } else {
    await page
      .locator(".desktop-nav")
      .getByRole("link", { name: "Nossa história" })
      .click();
    await expect(page).toHaveURL("/historia");
  }
  await page.goto("/pagina-ausente");
  await expect(page.locator("h1")).toContainText("Página não encontrada");
  expect(errors).toEqual([]);
});

test("contato envia à API e a mensagem aparece no painel", async ({
  page,
}, testInfo) => {
  await page.goto("/contato");
  await page
    .getByLabel("Nome completo")
    .fill(`Visitante ${testInfo.project.name}`);
  await page
    .getByLabel("E-mail", { exact: false })
    .fill("visitante@example.invalid");
  await page.getByLabel("Assunto").selectOption("Parcerias");
  await page
    .getByLabel("Mensagem *", { exact: true })
    .fill(
      "Mensagem criada exclusivamente pelo teste automatizado da interface.",
    );
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Sua mensagem foi recebida",
  );
  await page.goto("/admin/login");
  await page.getByLabel("E-mail", { exact: true }).fill("e2e@example.invalid");
  await page
    .getByLabel("Senha", { exact: true })
    .fill(process.env.E2E_PASSWORD);
  await page.getByRole("button", { name: "Entrar no painel" }).click();
  await expect(page.locator("h1")).toContainText("Olá");
  await page.goto("/admin/messages");
  await expect(
    page
      .locator(".resource-name")
      .filter({ hasText: `Visitante ${testInfo.project.name}` }),
  ).toBeVisible();
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    scan.violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => node.target),
    })),
  ).toEqual([]);
  await page.getByRole("button", { name: "Sair da administração" }).click();
  await expect(page).toHaveURL("/admin/login");
});

test("admin cria, publica, edita e exclui um evento com confirmação", async ({
  page,
}, testInfo) => {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail", { exact: true }).fill("e2e@example.invalid");
  await page
    .getByLabel("Senha", { exact: true })
    .fill(process.env.E2E_PASSWORD);
  await page.getByRole("button", { name: "Entrar no painel" }).click();
  await expect(page.locator("h1")).toContainText("Olá");
  await page.goto("/admin/events");
  await page.getByRole("button", { name: "Adicionar evento" }).click();
  await page
    .getByLabel("Título *", { exact: true })
    .fill(`Evento E2E ${testInfo.project.name}`);
  await page
    .getByLabel("Endereço da página")
    .fill(`evento-e2e-${testInfo.project.name}`);
  await page.getByLabel("Início").fill("2099-01-01T06:00");
  await page
    .getByLabel("Local *", { exact: true })
    .fill("Ambiente isolado de testes");
  await page
    .getByLabel("Descrição *", { exact: true })
    .fill(
      "Este evento existe apenas para validar o fluxo de cadastro em um banco de testes isolado.",
    );
  await page.getByRole("checkbox", { name: "Publicar no site" }).check();
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.locator(".form-alert.success")).toContainText(
    "Registro salvo",
  );
  await page.goto("/eventos");
  const agendaRow = page
    .locator(".event-card")
    .filter({ hasText: `Evento E2E ${testInfo.project.name}` });
  await expect(agendaRow.locator("time")).toContainText("01");
  await expect(agendaRow.locator(".event-place")).toContainText("06:00");
  await capture(page, testInfo, "agenda");
  await agendaRow.click();
  await expect(page).toHaveURL(`/eventos/evento-e2e-${testInfo.project.name}`);
  await page.goto(`/eventos/evento-e2e-${testInfo.project.name}`);
  await expect(page.locator("h1")).toContainText(
    `Evento E2E ${testInfo.project.name}`,
  );
  await expect(page.locator(".event-facts")).toContainText("06:00");
  await page.goto("/admin/events");
  await page
    .getByRole("button", {
      name: `Editar Evento E2E ${testInfo.project.name}`,
      exact: true,
    })
    .click();
  await page
    .getByLabel("Título *", { exact: true })
    .fill(`Evento editado ${testInfo.project.name}`);
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.locator(".form-alert.success")).toContainText(
    "Registro salvo",
  );
  await page
    .getByRole("button", {
      name: `Excluir Evento editado ${testInfo.project.name}`,
      exact: true,
    })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Excluir este registro?",
  );
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(
    page
      .locator(".resource-name")
      .filter({ hasText: `Evento editado ${testInfo.project.name}` }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: `Excluir Evento editado ${testInfo.project.name}`,
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Sim, excluir" }).click();
  await expect(page.locator(".form-alert.success")).toContainText(
    "Registro excluído",
  );
  await expect(
    page
      .locator(".resource-name")
      .filter({ hasText: `Evento editado ${testInfo.project.name}` }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
