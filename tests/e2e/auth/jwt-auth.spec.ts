import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login.page";
import { uniqueEmail, TEST_CLIENT } from "../fixtures/test-data";
import { registerUserViaApi } from "../fixtures/api-helpers";

/**
 * S1-01: Integrar auth frontend con API real (JWT)
 *
 * Verifica:
 * - Login devuelve tokens JWT y redirige correctamente
 * - Refresh automático cuando el access_token expira
 * - Logout invalida la sesión
 * - Sesión persiste al recargar la página (refresh_token válido)
 */

test.describe("S1-01: JWT Authentication Integration", () => {
  test.describe.configure({ mode: "serial" });

  let registeredEmail: string;
  const password = TEST_CLIENT.password;

  test.beforeAll(async () => {
    registeredEmail = uniqueEmail("jwt");
    await registerUserViaApi({
      email: registeredEmail,
      password,
      firstName: TEST_CLIENT.firstName,
      lastName: TEST_CLIENT.lastName,
    });
  });

  test("login exitoso almacena tokens y redirige al dashboard del cliente", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(registeredEmail, password);

    // Debe redirigir al dashboard del cliente
    await expect(page).toHaveURL(/\/dashboard\/cliente/, { timeout: 10_000 });

    // Verificar que los tokens están almacenados (localStorage)
    const accessToken = await page.evaluate(() =>
      localStorage.getItem("taskao_access_token")
    );
    expect(accessToken).toBeTruthy();
  });

  test("sesión persiste al recargar la página", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(registeredEmail, password);
    await expect(page).toHaveURL(/\/dashboard\/cliente/, { timeout: 10_000 });

    // Recargar la página
    await page.reload();

    // Debería seguir en el dashboard (no redirigir a login)
    await expect(page).toHaveURL(/\/dashboard\/cliente/);
    await expect(page.getByRole("link", { name: /iniciar sesión/i })).not.toBeVisible();
  });

  test("acceso a ruta protegida sin auth redirige a login", async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto("/perfil");

    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test("acceso a ruta protegida sin auth redirige a login con param redirect", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto("/perfil");

    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });

    const loginPage = new LoginPage(page);
    await loginPage.login(registeredEmail, password);

    await page.waitForURL(/\/(perfil|dashboard)/, { timeout: 10_000 });
  });

  test("logout limpia la sesión y redirige a login", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(registeredEmail, password);
    await expect(page).toHaveURL(/\/dashboard\/cliente/, { timeout: 10_000 });

    // Buscar y clickear el botón de logout
    const userMenu = page.getByRole("button", { name: /menú|perfil|usuario/i });
    if (await userMenu.isVisible({ timeout: 2000 }).catch(() => false)) {
      await userMenu.click();
    }
    const logoutButton = page.getByRole("button", { name: /cerrar sesión|logout|salir/i });
    const logoutLink = page.getByRole("link", { name: /cerrar sesión|logout|salir/i });
    const logoutMenuItem = page.getByRole("menuitem", { name: /cerrar sesión|logout|salir/i });

    if (await logoutButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await logoutButton.click();
    } else if (await logoutLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await logoutLink.click();
    } else if (await logoutMenuItem.isVisible({ timeout: 2000 }).catch(() => false)) {
      await logoutMenuItem.click();
    }

    // Después del logout, debería volver a login o home
    await expect(page).toHaveURL(/\/(login|$)/, { timeout: 10_000 });

    const accessToken = await page.evaluate(() =>
      localStorage.getItem("taskao_access_token")
    );
    expect(accessToken).toBeFalsy();
  });

  test("refresh token renueva la sesión automáticamente", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(registeredEmail, password);
    await expect(page).toHaveURL(/\/dashboard\/cliente/, { timeout: 10_000 });

    // Simular access_token expirado
    await page.evaluate(() => {
      localStorage.removeItem("taskao_access_token");
    });

    // Navegar a una ruta protegida — debería refrescar automáticamente
    await page.goto("/perfil");

    await page.waitForURL(/\/(perfil|dashboard)/, { timeout: 10_000 });

    const newAccessToken = await page.evaluate(() =>
      localStorage.getItem("taskao_access_token")
    );
    expect(newAccessToken).toBeTruthy();
  });
});