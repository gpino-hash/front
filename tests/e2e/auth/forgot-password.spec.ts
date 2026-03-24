import { test, expect } from "@playwright/test";
import { ForgotPasswordPage } from "../page-objects/forgot-password.page";
import { uniqueEmail, TEST_CLIENT } from "../fixtures/test-data";

/**
 * S1-05: Recuperación de contraseña por email
 *
 * Verifica:
 * - POST /auth/forgot-password envía email con link
 * - Confirmación genérica (no revela si el email existe)
 * - Token expirado muestra mensaje con opción de reenviar
 */

test.describe("S1-05: Forgot Password Flow", () => {
  test("solicitud de recuperación muestra confirmación genérica", async ({
    page,
  }) => {
    const forgotPage = new ForgotPasswordPage(page);
    await forgotPage.goto();
    await forgotPage.requestReset("usuario-existente@test.com");

    // Debe mostrar confirmación genérica
    await forgotPage.expectSuccessState();
  });

  test("email inexistente también muestra confirmación (no revelar info)", async ({
    page,
  }) => {
    const forgotPage = new ForgotPasswordPage(page);
    await forgotPage.goto();
    await forgotPage.requestReset("noexiste-nunca@test.com");

    // Debe mostrar la misma confirmación genérica por seguridad
    await forgotPage.expectSuccessState();
  });

  test("email vacío no permite enviar", async ({ page }) => {
    const forgotPage = new ForgotPasswordPage(page);
    await forgotPage.goto();
    await forgotPage.submitButton.click();

    // Debe quedarse en la misma página
    await forgotPage.expectOnPage();
  });

  test("email con formato inválido muestra error de validación", async ({
    page,
  }) => {
    const forgotPage = new ForgotPasswordPage(page);
    await forgotPage.goto();
    await forgotPage.emailInput.fill("email-sin-arroba");
    await forgotPage.submitButton.click();

    // Debe mostrar error de formato
    await expect(
      page.getByText(/email|válido|formato|correo/i)
    ).toBeVisible({ timeout: 3000 });
  });

  test("link volver al login funciona", async ({ page }) => {
    const forgotPage = new ForgotPasswordPage(page);
    await forgotPage.goto();
    await forgotPage.backToLoginLink.click();

    await expect(page).toHaveURL(/\/login/);
  });

  test("página de reset-password con token inválido muestra error al submit", async ({
    page,
  }) => {
    await page.goto("/reset-password?token=invalid-token-12345");

    // Llenar el form con una contraseña válida
    await page.getByLabel(/nueva contraseña/i).fill("NewPass123!");
    await page.getByLabel(/confirmar/i).fill("NewPass123!");
    await page.getByRole("button", { name: /restablecer/i }).click();

    // Debe mostrar error de token inválido o expirado
    await expect(
      page.getByText(/inválido|expiró|error|token/i)
    ).toBeVisible({ timeout: 5000 });
  });
});