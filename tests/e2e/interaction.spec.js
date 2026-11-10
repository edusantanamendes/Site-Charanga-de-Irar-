import { test, expect } from "@playwright/test";
import path from "node:path";

async function login(page) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail", { exact: true }).fill("e2e@example.invalid");
  await page
    .getByLabel("Senha", { exact: true })
    .fill(process.env.E2E_PASSWORD);
  await page.getByRole("button", { name: "Entrar no painel" }).click();
  await expect(page.locator("h1")).toContainText("Olá");
}

test("navegação administrativa móvel mantém o foco e fecha com Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await login(page);
  const toggle = page.getByRole("button", { name: "Alternar navegação" });
  const sidebar = page.locator("#admin-navigation");
  await expect(sidebar).toHaveAttribute("inert", "");
  await expect(sidebar).toBeHidden();
  await toggle.click();
  await expect(
    page.getByRole("dialog", { name: "Navegação administrativa" }),
  ).toBeVisible();
  const close = page.getByRole("button", { name: "Fechar navegação" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(sidebar.getByRole("link", { name: "Ver o site" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(sidebar).toBeHidden();
  await expect(page.locator(".admin-main")).not.toHaveAttribute("inert", "");
  await toggle.click();
  await sidebar.getByRole("link", { name: "Eventos", exact: true }).click();
  await expect(page).toHaveURL("/admin/events");
  await expect(sidebar).toBeHidden();
});

test("editor aguarda upload antes de permitir salvamento, inclusive por Enter", async ({
  page,
}) => {
  await login(page);
  await page.goto("/admin/photographs");
  await page.getByRole("button", { name: "Adicionar fotografia" }).click();
  await page
    .getByLabel("Título *", { exact: true })
    .fill("Verificação de envio pendente");
  let release;
  const held = new Promise((resolve) => {
    release = resolve;
  });
  await page.route("**/api/admin/upload", async (route) => {
    await held;
    await route.fulfill({
      json: { url: "/brand/logo-charanga-original.jpeg" },
    });
  });
  let saves = 0;
  await page.route("**/api/admin/photographs", async (route) => {
    if (route.request().method() === "POST") saves++;
    await route.continue();
  });
  try {
    await page
      .locator("input[type=file]")
      .setInputFiles(
        path.resolve("frontend/public/brand/logo-charanga-original.jpeg"),
      );
    await expect(
      page.getByRole("button", { name: "Aguarde o envio da imagem…" }),
    ).toBeDisabled();
    await page.getByLabel("Título *", { exact: true }).press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    expect(saves).toBe(0);
  } finally {
    release();
  }
  await expect(
    page.getByRole("button", { name: "Salvar alterações" }),
  ).toBeEnabled();
  await expect(page.locator(".image-upload img")).toBeVisible();
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
});

test("erros do contato identificam o campo e permitem voltar para corrigi-lo", async ({
  page,
}) => {
  await page.route("**/api/public/contact", (route) =>
    route.fulfill({
      status: 422,
      json: {
        error: "Revise os campos indicados.",
        fields: [{ field: "body", message: "Revise a mensagem enviada." }],
      },
    }),
  );
  await page.goto("/contato");
  await page.getByLabel("Nome completo").fill("Visitante de teste");
  await page
    .getByLabel("E-mail", { exact: false })
    .fill("teste@example.invalid");
  await page.getByLabel("Assunto").selectOption("Parcerias");
  const message = page.getByLabel("Mensagem *", { exact: true });
  await message.fill(
    "Mensagem exclusiva de uma verificação automatizada da interface.",
  );
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(message).toHaveAttribute("aria-invalid", "true");
  await expect(message).toHaveAccessibleDescription(
    "Revise a mensagem enviada.",
  );
  await page
    .getByRole("alert")
    .getByRole("link", { name: "Revise a mensagem enviada." })
    .click();
  await expect(message).toBeFocused();
});
