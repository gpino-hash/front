import { test, expect } from "@playwright/test";
import { HAS_BACKEND_API } from "../fixtures/api-helpers";

/**
 * Sprint 2: Provider onboarding wizard (/perfil/onboarding).
 *
 * 5-step flow: Personal → Services → WorkZones → Availability → Documents.
 * Requires authenticated user; skipped in CI without backend.
 */

test.describe("S2-Onboarding: Provider onboarding wizard", () => {
  test.skip(!HAS_BACKEND_API, "Requires backend API for authenticated session");

  test("loads step 1 with personal data form", async ({ page }) => {
    await page.goto("/perfil/onboarding");

    // Step indicator visible
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });

    // Personal data form fields
    await expect(page.getByLabel(/nombre profesional|displayName/i).first()).toBeVisible();
  });

  test("step indicator shows 5 steps", async ({ page }) => {
    await page.goto("/perfil/onboarding");

    // At least the step numbers 1..5 should be present as circles/labels
    for (const n of [1, 2, 3, 4, 5]) {
      await expect(page.getByText(String(n)).first()).toBeVisible({ timeout: 5_000 });
    }
  });

  test("step 1 validates required fields before advancing", async ({ page }) => {
    await page.goto("/perfil/onboarding");

    const nextBtn = page.getByRole("button", { name: /siguiente|continuar/i }).first();
    await nextBtn.click();

    // Should surface at least one validation error
    await expect(
      page.getByRole("alert").first().or(page.locator(".text-red-500").first())
    ).toBeVisible({ timeout: 5_000 });
  });
});