import { test, expect } from "@playwright/test";
import { RegisterPage } from "../page-objects/register.page";
import { uniqueEmail, TEST_CLIENT } from "../fixtures/test-data";
import { registerUserViaApi } from "../fixtures/api-helpers";

/**
 * S1-02: Registro de cliente con validación completa
 *
 * Verifica:
 * - Registro exitoso → redirect al dashboard del cliente
 * - Validación: nombre (3+ chars), email único, teléfono, password (8+ chars con letra+número)
 * - Email duplicado → error inline sin revelar info sensible
 * - Auto-login tras registro
 */

test.describe("S1-02: Client Registration", () => {
  test.describe.configure({ mode: "serial" });

  test("registro exitoso redirige al dashboard del cliente autenticado", async ({
    page,
  }) => {
    const registerPage = new RegisterPage(page);
    const email = uniqueEmail("reg-client");

    await registerPage.goto();
    await registerPage.register({
      firstName: TEST_CLIENT.firstName,
      lastName: TEST_CLIENT.lastName,
      email,
      phone: TEST_CLIENT.phone,
      password: TEST_CLIENT.password,
    });

    // Debe redirigir al dashboard del cliente
    await expect(page).toHaveURL(/\/dashboard\/cliente/, { timeout: 15_000 });

    // El usuario debe estar autenticado (token presente)
    const accessToken = await page.evaluate(() =>
      localStorage.getItem("taskao_access_token")
    );
    expect(accessToken).toBeTruthy();
  });

  test("registro con email duplicado muestra error", async ({ page }) => {
    const email = uniqueEmail("dup");

    // Registrar primero vía API para evitar rate limiting
    await registerUserViaApi({
      email,
      password: TEST_CLIENT.password,
      firstName: TEST_CLIENT.firstName,
      lastName: TEST_CLIENT.lastName,
    });

    // Segundo registro vía UI con el mismo email
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register({
      firstName: "Otro",
      lastName: "Usuario",
      email,
      phone: "+5411111222333",
      password: TEST_CLIENT.password,
    });

    // Debe mostrar error (sin revelar si el email existe específicamente)
    await expect(
      page.getByText(/ya existe|ya registrado|error|no se pudo/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test("validación de nombre corto muestra error", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    await registerPage.firstNameInput.fill("A");
    await registerPage.lastNameInput.fill("B");
    await registerPage.emailInput.fill(uniqueEmail());
    await registerPage.phoneInput.fill(TEST_CLIENT.phone);
    await registerPage.passwordInput.fill(TEST_CLIENT.password);
    await registerPage.confirmPasswordInput.fill(TEST_CLIENT.password);
    await registerPage.submit();

    await expect(
      page.getByText(/mínimo|caracteres|corto/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test("validación de contraseña débil muestra error", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    await registerPage.firstNameInput.fill(TEST_CLIENT.firstName);
    await registerPage.lastNameInput.fill(TEST_CLIENT.lastName);
    await registerPage.emailInput.fill(uniqueEmail());
    await registerPage.phoneInput.fill(TEST_CLIENT.phone);
    await registerPage.passwordInput.fill("weak");
    await registerPage.confirmPasswordInput.fill("weak");
    await registerPage.submit();

    await expect(
      page.getByText(/8|caracteres|requisitos|segur/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test("contraseñas que no coinciden muestra error", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    await registerPage.firstNameInput.fill(TEST_CLIENT.firstName);
    await registerPage.lastNameInput.fill(TEST_CLIENT.lastName);
    await registerPage.emailInput.fill(uniqueEmail());
    await registerPage.phoneInput.fill(TEST_CLIENT.phone);
    await registerPage.passwordInput.fill(TEST_CLIENT.password);
    await registerPage.confirmPasswordInput.fill("OtraPass123!");
    await registerPage.submit();

    await expect(
      page.getByText(/coincid|match|igual/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test("usuario auto-logueado puede acceder al perfil tras registro", async ({
    page,
  }) => {
    const registerPage = new RegisterPage(page);
    const email = uniqueEmail("profile-reg");

    await registerPage.goto();
    await registerPage.register({
      firstName: "Perfil",
      lastName: "Test",
      email,
      phone: TEST_CLIENT.phone,
      password: TEST_CLIENT.password,
    });

    await expect(page).toHaveURL(/\/dashboard\/cliente/, { timeout: 15_000 });

    await page.goto("/perfil");
    await expect(page).toHaveURL(/\/perfil/, { timeout: 10_000 });
    await expect(page.getByText("Perfil")).toBeVisible();
  });

  test("link a login funciona desde registro", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });
});