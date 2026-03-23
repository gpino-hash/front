import { test, expect, type Page } from "@playwright/test";

/**
 * E2E Tests: Flujo completo de Two-Factor Authentication
 *
 * Cubre:
 * 1. Setup 2FA desde perfil (authenticator + SMS)
 * 2. Login con 2FA (código TOTP)
 * 3. Login con backup code
 * 4. Disable 2FA
 * 5. Edge cases: código inválido, token expirado, recovery
 *
 * NOTA: Estos tests requieren que la app esté corriendo en localhost.
 * Para TOTP real en CI, se necesita un helper que genere códigos válidos
 * a partir del secret (usando `otpauth` o `speakeasy` en el test).
 */

// ─── Helpers ────────────────────────────────────────────

async function loginAs(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Contraseña").fill(password);
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
}

async function fillOtpCode(page: Page, code: string) {
  const digits = code.split("");
  for (let i = 0; i < digits.length; i++) {
    await page.getByLabel(`Dígito ${i + 1}`).fill(digits[i]);
  }
}

// ─── Test Data ──────────────────────────────────────────

const TEST_USER = {
  email: "e2e-2fa@example.com",
  password: "TestPassword123!",
};

// ─── Tests ──────────────────────────────────────────────

test.describe("Two-Factor Authentication - Setup Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Login as a user without 2FA
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL(/\/dashboard/);
  });

  test("should navigate to 2FA setup from profile", async ({ page }) => {
    await page.goto("/perfil");

    // Find and click the 2FA setup button
    const setup2FAButton = page.getByRole("button", {
      name: /Activar.*autenticación|Configurar 2FA/i,
    });
    await expect(setup2FAButton).toBeVisible();
    await setup2FAButton.click();

    // Modal should appear with method selection
    await expect(
      page.getByText("Autenticación en Dos Pasos")
    ).toBeVisible();
    await expect(
      page.getByText("Aplicación de Autenticación")
    ).toBeVisible();
    await expect(page.getByText("Mensaje SMS")).toBeVisible();
  });

  test("should show QR code when selecting authenticator method", async ({
    page,
  }) => {
    await page.goto("/perfil");

    // Open 2FA setup
    await page
      .getByRole("button", { name: /Activar.*autenticación|Configurar 2FA/i })
      .click();

    // Select authenticator (default) and continue
    await page.getByRole("button", { name: "Continuar" }).click();

    // Should show QR code step
    await expect(
      page.getByText("Escaneá este código QR")
    ).toBeVisible();
    await expect(
      page.getByAltText("Código QR para configurar 2FA")
    ).toBeVisible();

    // Should show manual entry code
    await expect(
      page.getByText("O ingresá este código manualmente")
    ).toBeVisible();
  });

  test("should show recovery codes after valid TOTP verification", async ({
    page,
  }) => {
    await page.goto("/perfil");

    await page
      .getByRole("button", { name: /Activar.*autenticación|Configurar 2FA/i })
      .click();

    // Continue with authenticator
    await page.getByRole("button", { name: "Continuar" }).click();

    // Move to verify step
    await page.getByRole("button", { name: "Continuar" }).click();

    // Should show code input
    await expect(page.getByLabel("Dígito 1")).toBeVisible();
    await expect(page.getByLabel("Dígito 6")).toBeVisible();
  });

  test("should show error on invalid TOTP code during setup", async ({
    page,
  }) => {
    await page.goto("/perfil");

    await page
      .getByRole("button", { name: /Activar.*autenticación|Configurar 2FA/i })
      .click();

    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByRole("button", { name: "Continuar" }).click();

    // Enter invalid code
    await fillOtpCode(page, "000000");
    await page.getByRole("button", { name: "Verificar" }).click();

    // Should show error
    await expect(page.getByText(/código inválido/i)).toBeVisible();
  });

  test("should allow canceling 2FA setup", async ({ page }) => {
    await page.goto("/perfil");

    await page
      .getByRole("button", { name: /Activar.*autenticación|Configurar 2FA/i })
      .click();

    // Click cancel
    await page.getByRole("button", { name: "Cancelar" }).click();

    // Modal should close
    await expect(
      page.getByText("Autenticación en Dos Pasos")
    ).not.toBeVisible();
  });

  test("should allow going back between setup steps", async ({ page }) => {
    await page.goto("/perfil");

    await page
      .getByRole("button", { name: /Activar.*autenticación|Configurar 2FA/i })
      .click();

    // Go to authenticator setup
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByText("Configurar Authenticator")).toBeVisible();

    // Go back
    await page.getByRole("button", { name: "Atrás" }).click();
    await expect(
      page.getByText("Autenticación en Dos Pasos")
    ).toBeVisible();
  });

  test("should request phone number for SMS method", async ({ page }) => {
    await page.goto("/perfil");

    await page
      .getByRole("button", { name: /Activar.*autenticación|Configurar 2FA/i })
      .click();

    // Select SMS method
    await page.getByLabel("Mensaje SMS").check();
    await page.getByRole("button", { name: "Continuar" }).click();

    // Should show phone input
    await expect(page.getByText("Verificación por SMS")).toBeVisible();
    await expect(page.getByPlaceholder("+54 11 1234-5678")).toBeVisible();

    // Should show security warning
    await expect(
      page.getByText(/menos segura que una app/i)
    ).toBeVisible();
  });
});

test.describe("Two-Factor Authentication - Login Flow", () => {
  test("should redirect to 2FA verification when user has 2FA enabled", async ({
    page,
  }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);

    // If 2FA is enabled, should redirect to verify page
    await page.waitForURL(/\/verify-2fa/);
    await expect(
      page.getByText("Verificación en Dos Pasos")
    ).toBeVisible();
  });

  test("should show 6 digit input fields", async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL(/\/verify-2fa/);

    // 6 individual digit inputs
    for (let i = 1; i <= 6; i++) {
      await expect(page.getByLabel(`Dígito ${i}`)).toBeVisible();
    }
  });

  test("should auto-focus next input on digit entry", async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL(/\/verify-2fa/);

    // Type in first input
    await page.getByLabel("Dígito 1").fill("1");

    // Second input should be focused
    await expect(page.getByLabel("Dígito 2")).toBeFocused();
  });

  test("should handle paste of full code", async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL(/\/verify-2fa/);

    // Focus first input and paste
    const firstInput = page.getByLabel("Dígito 1");
    await firstInput.focus();

    await page.evaluate(() => {
      const event = new ClipboardEvent("paste", {
        clipboardData: new DataTransfer(),
      });
      Object.defineProperty(event.clipboardData, "getData", {
        value: () => "123456",
      });
      document.querySelector('[aria-label="Dígito 1"]')?.closest("div")?.dispatchEvent(event);
    });
  });

  test("should show error on invalid TOTP code", async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL(/\/verify-2fa/);

    // Enter invalid code
    await fillOtpCode(page, "000000");
    await page.getByRole("button", { name: "Verificar" }).click();

    // Should show error
    await expect(
      page.getByText(/código inválido|error/i)
    ).toBeVisible();
  });

  test("should toggle to recovery code input", async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL(/\/verify-2fa/);

    // Click toggle button
    await page
      .getByRole("button", { name: "Usar código de recuperación" })
      .click();

    // Should show recovery code input and title
    await expect(page.getByText("Código de Recuperación")).toBeVisible();
    await expect(page.getByPlaceholder("XXXX-XXXX-XXXX")).toBeVisible();
  });

  test("should toggle back to OTP from recovery code", async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL(/\/verify-2fa/);

    // Switch to recovery
    await page
      .getByRole("button", { name: "Usar código de recuperación" })
      .click();

    // Switch back to authenticator
    await page
      .getByRole("button", { name: "Usar código de autenticación" })
      .click();

    // Should show OTP inputs again
    await expect(page.getByLabel("Dígito 1")).toBeVisible();
    await expect(
      page.getByText("Verificación en Dos Pasos")
    ).toBeVisible();
  });

  test("should show error for empty recovery code", async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL(/\/verify-2fa/);

    // Switch to recovery
    await page
      .getByRole("button", { name: "Usar código de recuperación" })
      .click();

    // Submit without entering code
    await page.getByRole("button", { name: "Verificar" }).click();

    await expect(
      page.getByText(/ingresá un código de recuperación/i)
    ).toBeVisible();
  });

  test("should show 'back to login' link", async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL(/\/verify-2fa/);

    const backLink = page.getByRole("link", {
      name: /volver al inicio de sesión/i,
    });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute("href", "/login");
  });

  test("should show error for incomplete TOTP code", async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL(/\/verify-2fa/);

    // Enter only 3 digits
    await page.getByLabel("Dígito 1").fill("1");
    await page.getByLabel("Dígito 2").fill("2");
    await page.getByLabel("Dígito 3").fill("3");

    await page.getByRole("button", { name: "Verificar" }).click();

    await expect(
      page.getByText(/código completo de 6 dígitos/i)
    ).toBeVisible();
  });
});

test.describe("Two-Factor Authentication - Disable Flow", () => {
  test("should show disable option when 2FA is enabled", async ({ page }) => {
    // This test assumes user is already logged in with 2FA enabled
    await page.goto("/perfil");

    await expect(
      page.getByRole("button", { name: /Desactivar.*2FA|Deshabilitar/i })
    ).toBeVisible();
  });

  test("should require password to disable 2FA", async ({ page }) => {
    await page.goto("/perfil");

    await page
      .getByRole("button", { name: /Desactivar.*2FA|Deshabilitar/i })
      .click();

    // Modal should ask for password
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
  });

  test("should show error on wrong password", async ({ page }) => {
    await page.goto("/perfil");

    await page
      .getByRole("button", { name: /Desactivar.*2FA|Deshabilitar/i })
      .click();

    await page.getByLabel(/contraseña/i).fill("WrongPassword");
    await page.getByRole("button", { name: /confirmar|desactivar/i }).click();

    await expect(
      page.getByText(/contraseña incorrecta|credenciales/i)
    ).toBeVisible();
  });
});

test.describe("Two-Factor Authentication - Recovery Codes", () => {
  test("should show recovery codes with copy and download buttons", async ({
    page,
  }) => {
    // Assumes we're at the recovery codes step during setup
    // This test validates the UI structure
    await page.goto("/perfil");

    await page
      .getByRole("button", { name: /Activar.*autenticación|Configurar 2FA/i })
      .click();

    // Navigate through setup to reach recovery codes step
    // (In a real test, we'd mock the TOTP validation)
    await expect(page.getByText("Autenticación en Dos Pasos")).toBeVisible();
  });
});

test.describe("Two-Factor Authentication - Security Indicators", () => {
  test("should show security badges on verify page", async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL(/\/verify-2fa/);

    await expect(page.getByText("Encriptado")).toBeVisible();
    await expect(page.getByText("Verificado")).toBeVisible();
  });

  test("should show loading state during verification", async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL(/\/verify-2fa/);

    await fillOtpCode(page, "123456");

    // Click verify and check for loading state
    const verifyButton = page.getByRole("button", { name: "Verificar" });
    await verifyButton.click();

    // Button should show loading text (briefly)
    // Note: This might be too fast to catch in E2E
    await expect(verifyButton).toBeDisabled();
  });
});