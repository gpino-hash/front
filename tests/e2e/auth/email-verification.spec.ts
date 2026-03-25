import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login.page";
import { uniqueEmail, TEST_CLIENT } from "../fixtures/test-data";
import { registerUserViaApi } from "../fixtures/api-helpers";

/**
 * S1-06: Verificación de email
 *
 * Verifica:
 * - Tras registro, usuario puede usar la plataforma sin verificar
 * - Banner persistente de "verificar email" visible
 * - Página /verify-email con token inválido muestra error
 */

test.describe("S1-06: Email Verification", () => {
  test.describe.configure({ mode: "serial" });

  test("usuario sin verificar ve banner de verificación tras login", async ({ page }) => {
    const email = uniqueEmail("verify");
    await registerUserViaApi({
      email,
      password: TEST_CLIENT.password,
      firstName: TEST_CLIENT.firstName,
      lastName: TEST_CLIENT.lastName,
    });

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, TEST_CLIENT.password);
    await expect(page).toHaveURL(/\/dashboard\/cliente/, { timeout: 10_000 });

    // Debe ver banner de verificación
    await expect(
      page.getByText(/verific|email|correo/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test("usuario sin verificar puede navegar por la plataforma", async ({
    page,
  }) => {
    const email = uniqueEmail("nav-unverified");
    await registerUserViaApi({
      email,
      password: TEST_CLIENT.password,
      firstName: TEST_CLIENT.firstName,
      lastName: TEST_CLIENT.lastName,
    });

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, TEST_CLIENT.password);
    await expect(page).toHaveURL(/\/dashboard\/cliente/, { timeout: 10_000 });

    // Debe poder navegar al perfil
    await page.goto("/perfil");
    await expect(page).toHaveURL(/\/perfil/);
  });

  test("verify-email con token inválido muestra error", async ({ page }) => {
    await page.goto("/verify-email?token=invalid-token-xyz");

    await expect(
      page.getByText(/inválido|expirado|error|no válido/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test("verify-email sin token muestra error", async ({ page }) => {
    await page.goto("/verify-email");

    // La página muestra "Link inválido" cuando no hay token
    await expect(
      page.getByText(/inválido|no es válido|link|error/i)
    ).toBeVisible({ timeout: 5000 });
  });
});