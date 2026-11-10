import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

// Read-only visual evidence against the running local application.
const directory = path.resolve(process.argv[2] || ".impeccable/review");
const origin = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
const routes = [
  ["/", "home"],
  ["/historia", "historia"],
  ["/galeria", "galeria"],
  ["/eventos", "agenda"],
  ["/musicos", "musicos"],
  ["/contato", "contato"],
  ["/privacidade", "privacidade"],
  ["/pagina-ausente", "404"],
  ["/admin/login", "login"],
  ["/admin/recuperar", "recuperar"],
];
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  locale: "pt-BR",
  reducedMotion: "reduce",
});
const report = { origin, captures: [], errors: [], overflow: [] };
page.on("pageerror", (error) => report.errors.push(error.message));
async function openRoute(route) {
  const site = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/public/site") && response.status() === 200,
  );
  await page.goto(origin + route);
  await site;
  await page.locator("h1").waitFor();
  await page.waitForFunction(() => !document.querySelector(".loading-state"));
  if (
    ["/historia", "/galeria", "/eventos", "/musicos", "/contato"].includes(
      route,
    )
  ) {
    await page.locator(".page-intro").waitFor();
  }
  if (route === "/")
    await page
      .locator(".history-text p")
      .first()
      .filter({ hasText: /\S/ })
      .waitFor();
}
try {
  for (const [device, width, height] of [
    ["desktop", 1440, 1000],
    ["mobile", 375, 900],
  ]) {
    await page.setViewportSize({ width, height });
    for (const [route, name] of routes) {
      await openRoute(route);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map((img) => {
            img.loading = "eager";
            return img.decode().catch(() => {});
          }),
        );
        window.scrollTo(0, 0);
      });
      const target = path.join(directory, `${name}-${device}.png`);
      await page.screenshot({
        path: target,
        fullPage: true,
        animations: "disabled",
      });
      report.captures.push({ route, width, path: target });
      if (
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )
      )
        report.overflow.push({ route, width });
      if (route === "/") {
        await page.screenshot({
          path: path.join(directory, `${device}.png`),
          animations: "disabled",
        });
      }
    }
  }
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [route] of routes) {
      await openRoute(route);
      if (
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )
      )
        report.overflow.push({ route, width });
    }
  }
  await fs.writeFile(
    path.join(directory, "capture-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(
    JSON.stringify({
      captures: report.captures.length,
      errors: report.errors,
      overflow: report.overflow,
    }),
  );
  if (report.errors.length || report.overflow.length) process.exitCode = 1;
} finally {
  await browser.close();
}
