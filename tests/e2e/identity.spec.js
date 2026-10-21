import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

test("identidade oficial: original, favicon CH, marca nas páginas e painel", async ({
  page,
  request,
}, testInfo) => {
  test.setTimeout(90_000);
  const directory = path.resolve("test-results/identity");
  await fs.mkdir(directory, { recursive: true });
  const manifest = await (await request.get("/brand/manifest.json")).json();
  const original = await request.get("/brand/logo-charanga-original.jpeg");
  expect(original.ok()).toBe(true);
  expect(
    createHash("sha256")
      .update(await original.body())
      .digest("hex"),
  ).toBe(manifest.sha256);
  const favicon = await request.get("/favicon.svg");
  expect(favicon.ok()).toBe(true);
  expect(await favicon.text()).toContain("data:image/jpeg;base64,");

  async function capture(name, fullPage = false) {
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: path.join(directory, `${name}-${testInfo.project.name}.png`),
      fullPage,
    });
  }
  for (const [route, name] of [
    ["/", "home"],
    ["/historia", "historia"],
    ["/galeria", "galeria"],
    ["/eventos", "agenda"],
    ["/musicos", "musicos"],
    ["/contato", "contato"],
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".loading-state")).toHaveCount(0);
    const logo = page.locator(".header .official-logo");
    await expect(logo).toBeVisible();
    await logo.evaluate((image) => image.decode());
    const dimensions = await logo.boundingBox();
    expect(Math.abs(dimensions.width - dimensions.height)).toBeLessThan(1);
    expect(await logo.getAttribute("src")).toBe(
      "/brand/logo-charanga-original.jpeg",
    );
    await capture(name, true);
    await capture(`${name}-viewport`);
  }
  await page.goto("/");
  await expect(page.locator(".brand-composition .official-logo")).toBeVisible();
  await expect(page.locator(".photo-placeholder")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(
    "Imagem a adicionar ao acervo",
  );
  await expect(
    page
      .locator(".hero-actions")
      .getByRole("link", { name: "Conheça nossa história" }),
  ).toHaveAttribute("href", "/historia");
  await expect(
    page
      .locator(".hero-actions")
      .getByRole("link", { name: "Entre em contato" }),
  ).toHaveAttribute("href", "/contato");
  await expect(page.locator(".institutional-strip")).toContainText(
    "Irará, Bahia",
  );
  if (testInfo.project.name === "desktop") {
    await expect(page.locator(".desktop-nav")).toBeVisible();
    await expect(page.getByRole("button", { name: "Abrir menu" })).toBeHidden();
    await expect(
      page
        .locator(".desktop-nav")
        .getByRole("link", { name: "Nossos músicos" }),
    ).toBeVisible();
  }
  await expect(page.locator(".hero-description")).toContainText(
    "Preservando a história",
  );
  await capture("home-viewport");
  await page.locator(".footer").scrollIntoViewIfNeeded();
  await expect(page.locator(".footer .official-logo")).toBeVisible();
  await expect(page.locator(".header")).toHaveClass(/header-scrolled/);

  await page.goto("/admin/login");
  await expect(
    page.locator(".login-page .official-logo:visible"),
  ).toBeVisible();
  const loginScan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(loginScan.violations.map((issue) => issue.id)).toEqual([]);
  await capture("login");
  await page.getByLabel("E-mail", { exact: true }).fill("e2e@example.invalid");
  await page
    .getByLabel("Senha", { exact: true })
    .fill(process.env.E2E_PASSWORD);
  await page.getByRole("button", { name: "Entrar no painel" }).click();
  await expect(page.locator("h1")).toContainText("Olá");
  await capture("dashboard", true);
  if (testInfo.project.name === "mobile")
    await page.getByRole("button", { name: "Alternar navegação" }).click();
  await expect(page.locator(".admin-sidebar .official-logo")).toBeVisible();
  if (testInfo.project.name === "mobile")
    await page
      .locator(".admin-sidebar")
      .getByRole("link", { name: "Eventos", exact: true })
      .click();
  for (const resource of [
    "events",
    "musicians",
    "photographs",
    "videos",
    "categories",
    "contents",
    "messages",
    "socials",
    "settings",
  ]) {
    await page.goto(`/admin/${resource}`);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".loading-state")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      resource,
    ).toBe(true);
    await capture(`admin-${resource}`);
  }
  const viewport = page.viewportSize();
  await page.setViewportSize({ width: 192, height: 192 });
  await page.goto("/favicon.svg");
  await capture("favicon");
  await page.setViewportSize(viewport);
});
