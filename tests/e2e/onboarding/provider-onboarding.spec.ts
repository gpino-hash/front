import { test, expect } from "@playwright/test";
import { fakeAuth } from "../fixtures/fake-auth";

/**
 * Sprint 2: Provider onboarding wizard (/perfil/onboarding).
 *
 * 5-step flow: Personal → Services → WorkZones → Availability → Documents.
 * The route is proxy-protected (src/proxy.ts) but the form itself does
 * not read `useAuth().user`, so fakeAuth is enough to reach it.
 */

test.describe("S2-Onboarding: Provider onboarding wizard", () => {
  test.beforeEach(async ({ context }) => {
    await fakeAuth(context, { role: "PROVIDER" });
  });

  test("loads step 1 with personal data form", async ({ page }) => {
    await page.goto("/perfil/onboarding");

    await expect(
      page.getByRole("heading", { name: /registrate como proveedor/i }),
    ).toBeVisible({ timeout: 10_000 });

    await expect(
      page.getByRole("heading", { name: /datos personales/i }),
    ).toBeVisible();

    await expect(page.getByLabel(/nombre profesional/i)).toBeVisible();
  });

  test("step indicator shows the 5 configured steps", async ({ page }) => {
    await page.goto("/perfil/onboarding");

    // The indicator renders numbered circles 1..5
    for (const n of [1, 2, 3, 4, 5]) {
      await expect(page.getByText(String(n), { exact: true }).first()).toBeVisible({
        timeout: 5_000,
      });
    }
  });

  test("step 1 rejects an empty submit with validation error", async ({ page }) => {
    await page.goto("/perfil/onboarding");

    await page.getByLabel(/nombre profesional/i).fill("");
    await page
      .getByRole("button", { name: /siguiente|continuar/i })
      .first()
      .click();

    // Form-level error surfaces either as role=alert or a red helper text
    await expect(
      page
        .getByText(/mínimo|requerido|obligatorio/i)
        .or(page.locator("[role='alert']"))
        .first(),
    ).toBeVisible({ timeout: 5_000 });
  });

});