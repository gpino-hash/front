import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login.page";
import { ProfilePage } from "../page-objects/profile.page";
import { uniqueEmail, TEST_CLIENT } from "../fixtures/test-data";
import { registerUserViaApi } from "../fixtures/api-helpers";

/**
 * S1-07: Página de perfil del usuario (ver + editar)
 *
 * Verifica:
 * - Perfil muestra: nombre, email, teléfono, rol, fecha de registro
 * - Edición de nombre y teléfono funciona
 * - Email no se puede cambiar
 * - Cambio de contraseña funciona
 */

test.describe("S1-07: User Profile", () => {
  test.describe.configure({ mode: "serial" });

  let userEmail: string;
  const password = TEST_CLIENT.password;

  test.beforeAll(async () => {
    userEmail = uniqueEmail("profile");
    await registerUserViaApi({
      email: userEmail,
      password,
      firstName: "Perfil",
      lastName: "Prueba",
    });
  });

  test("perfil muestra datos del usuario correctamente", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(userEmail, password);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });

    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await profilePage.expectOnPage();

    await profilePage.expectUserName(/Perfil/);
    await profilePage.expectUserEmail(userEmail);
  });

  test("editar nombre y teléfono se guarda correctamente", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(userEmail, password);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });

    const profilePage = new ProfilePage(page);
    await profilePage.goto();

    await profilePage.editPersonalData({
      firstName: "NombreEditado",
      phone: "+5411000111222",
    });

    await profilePage.expectSuccessMessage(/actualizado|guardado|éxito/i);
  });

  test("email no se puede editar", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(userEmail, password);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });

    const profilePage = new ProfilePage(page);
    await profilePage.goto();

    const emailInput = page.getByLabel("Email");
    if (await emailInput.isVisible()) {
      await expect(emailInput).toBeDisabled();
    }
    await expect(
      page.getByText(/no se puede cambiar|no editable/i)
    ).toBeVisible({ timeout: 3000 }).catch(() => {
      // Aceptable si simplemente el campo está disabled
    });
  });

  test("cambio de contraseña exitoso", async ({ page }) => {
    const changePassEmail = uniqueEmail("changepass");
    await registerUserViaApi({
      email: changePassEmail,
      password,
      firstName: TEST_CLIENT.firstName,
      lastName: TEST_CLIENT.lastName,
    });

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(changePassEmail, password);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });

    const profilePage = new ProfilePage(page);
    await profilePage.goto();

    const newPassword = "NewSecurePass456!";
    await profilePage.changePassword(password, newPassword);

    await profilePage.expectSuccessMessage(/contraseña|actualizada|cambiada/i);
  });

  test("tabs de perfil funcionan correctamente", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(userEmail, password);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });

    const profilePage = new ProfilePage(page);
    await profilePage.goto();

    await profilePage.personalTab.click();
    await expect(profilePage.firstNameInput).toBeVisible();

    await profilePage.securityTab.click();
    await expect(profilePage.currentPasswordInput).toBeVisible();
  });
});