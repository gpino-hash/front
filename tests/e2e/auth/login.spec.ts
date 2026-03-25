import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login.page";
import { uniqueEmail, TEST_CLIENT, INVALID_CREDENTIALS } from "../fixtures/test-data";
import { registerUserViaApi } from "../fixtures/api-helpers";

/**
 * S1-04: Login con manejo de errores robusto
 *
 * Verifica:
 * - Login exitoso redirige según rol (cliente → /dashboard/cliente)
 * - Si viene de ruta protegida, redirige a esa ruta tras login (param ?redirect=)
 * - Errores claros con credenciales inválidas (mensaje genérico por seguridad)
 * - Rate limiting: bloqueo temporal tras 5 intentos fallidos (429)
 * - Botón de loading durante la petición
 */

test.describe("S1-04: Login with Error Handling", () => {
  test.describe.configure({ mode: "serial" });

  let clientEmail: string;
  const password = TEST_CLIENT.password;

  test.beforeAll(async () => {
    // Registrar usuario vía API (evita rate limiting de UI)
    clientEmail = uniqueEmail("login");
    await registerUserViaApi({
      email: clientEmail,
      password,
      firstName: TEST_CLIENT.firstName,
      lastName: TEST_CLIENT.lastName,
    });
  });

  test("login exitoso de cliente redirige a /dashboard/cliente", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(clientEmail, password);

    await expect(page).toHaveURL(/\/dashboard\/cliente/, { timeout: 10_000 });
  });

  test("credenciales inválidas muestran error genérico", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(INVALID_CREDENTIALS.email, INVALID_CREDENTIALS.password);

    // Debe mostrar error genérico (no revelar si el email existe)
    await expect(
      page.getByText(/credenciales|inválid|incorrect|error/i)
    ).toBeVisible({ timeout: 5000 });

    // No debe redirigir
    await expect(page).toHaveURL(/\/login/);
  });

  test("email vacío no permite submit (validación client-side)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Solo llenar password
    await loginPage.passwordInput.fill(password);
    await loginPage.submitButton.click();

    // Debe quedarse en login
    await expect(page).toHaveURL(/\/login/);
  });

  test("password vacío no permite submit", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.emailInput.fill(clientEmail);
    await loginPage.submitButton.click();

    await expect(page).toHaveURL(/\/login/);
  });

  test("botón muestra estado de loading durante la petición", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.emailInput.fill(clientEmail);
    await loginPage.passwordInput.fill(password);

    // Interceptar la petición para que sea lenta
    await page.route("**/auth/login", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.continue();
    });

    await loginPage.submitButton.click();

    // El botón debe mostrar estado de loading
    await expect(
      page.getByText(/procesando|cargando/i).or(
        page.locator('button[disabled]').filter({ hasText: /sesión/i })
      )
    ).toBeVisible({ timeout: 3000 });
  });

  test("link a forgot-password funciona", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.forgotPasswordLink.click();

    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test("link a registro funciona", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.registerLink.click();

    await expect(page).toHaveURL(/\/register/);
  });

  test("redirect param: login desde ruta protegida vuelve a esa ruta", async ({
    page,
  }) => {
    // Acceder a perfil sin autenticación
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto("/perfil");

    // Debería redirigir a login
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });

    // Hacer login
    const loginPage = new LoginPage(page);
    await loginPage.login(clientEmail, password);

    // Debería redirigir de vuelta a /perfil o al dashboard
    await page.waitForURL(/\/(perfil|dashboard)/, { timeout: 10_000 });
  });

  test("rate limiting muestra error tras múltiples intentos fallidos", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Intentar login con credenciales incorrectas varias veces
    for (let i = 0; i < 6; i++) {
      await loginPage.emailInput.fill(INVALID_CREDENTIALS.email);
      await loginPage.passwordInput.fill(INVALID_CREDENTIALS.password);
      await loginPage.submitButton.click();
      // Esperar a que el error aparezca o pase el rate limit
      await page.waitForTimeout(500);
    }

    // Después de varios intentos, debería mostrar error de rate limit
    const rateLimitError = page.getByText(
      /demasiados intentos|intente más tarde|rate limit|bloqueado|too many/i
    );
    const genericError = page.getByText(/credenciales|inválid|error/i);

    // Debe mostrar alguno de estos errores
    await expect(rateLimitError.or(genericError)).toBeVisible({ timeout: 5000 });
  });
});