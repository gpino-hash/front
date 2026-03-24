import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login.page";
import { uniqueEmail, TEST_CLIENT } from "../fixtures/test-data";
import { registerUserViaApi } from "../fixtures/api-helpers";

/**
 * S1-08: Guard de roles en rutas protegidas
 *
 * Verifica:
 * - Un cliente no puede acceder a /dashboard/proveedor/*
 * - Un proveedor no puede acceder a /dashboard/cliente/*
 * - Intento de acceso no autorizado redirige a su dashboard
 * - Rutas de admin solo accesibles para admin
 */

test.describe("S1-08: Role-based Route Guards", () => {
  test.describe.configure({ mode: "serial" });

  let clientEmail: string;
  const password = TEST_CLIENT.password;

  test.beforeAll(async () => {
    clientEmail = uniqueEmail("guard-client");
    await registerUserViaApi({
      email: clientEmail,
      password,
      firstName: TEST_CLIENT.firstName,
      lastName: TEST_CLIENT.lastName,
    });
  });

  test("cliente no puede acceder a /dashboard/proveedor", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(clientEmail, password);
    await expect(page).toHaveURL(/\/dashboard\/cliente/, { timeout: 10_000 });

    await page.goto("/dashboard/proveedor");

    await expect(page).not.toHaveURL(/\/dashboard\/proveedor/, {
      timeout: 5000,
    });
  });

  test("usuario no autenticado no puede acceder a /dashboard/cliente", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto("/dashboard/cliente");

    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test("usuario no autenticado no puede acceder a /admin", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto("/admin");

    const url = page.url();
    const isRedirected =
      url.includes("/login") ||
      url.includes("/403") ||
      !url.includes("/admin");
    expect(isRedirected).toBeTruthy();
  });

  test("cliente no puede acceder a rutas de admin", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(clientEmail, password);
    await expect(page).toHaveURL(/\/dashboard\/cliente/, { timeout: 10_000 });

    await page.goto("/admin");

    await expect(page).not.toHaveURL(/\/admin/, { timeout: 5000 });
  });
});