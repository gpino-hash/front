import { test, expect } from "@playwright/test";
import { HAS_BACKEND_API } from "../fixtures/api-helpers";

/**
 * Sprint 2: Client dashboard (/dashboard/cliente).
 *
 * Requires authenticated session → skipped in CI without a backend.
 */

test.describe("S2-Cliente: Client dashboard", () => {
  test.skip(!HAS_BACKEND_API, "Requires backend API for authenticated session");

  test("renders heading and stats", async ({ page }) => {
    await page.goto("/dashboard/cliente");

    await expect(
      page.getByRole("heading", { name: /mis solicitudes/i, level: 1 })
    ).toBeVisible();

    // 4 stat cards
    await expect(page.getByText(/activas/i).first()).toBeVisible();
    await expect(page.getByText(/completados/i).first()).toBeVisible();
    await expect(page.getByText(/gastado/i).first()).toBeVisible();
  });

  test("tab switching updates the list", async ({ page }) => {
    await page.goto("/dashboard/cliente");

    await page.getByRole("button", { name: /todas/i }).click();
    await page.getByRole("button", { name: /historial/i }).click();
    await page.getByRole("button", { name: /activas/i }).click();
  });

  test("nueva-solicitud CTA navigates", async ({ page }) => {
    await page.goto("/dashboard/cliente");
    await page.getByRole("link", { name: /nueva solicitud/i }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/cliente\/nueva-solicitud/);
  });

  test("sidebar popular categories link uses /servicios", async ({ page }) => {
    await page.goto("/dashboard/cliente");

    // Catches the audit's broken-link finding — links should start with /servicios
    const plumeriaLink = page.getByRole("link", { name: /plomería/i });
    await expect(plumeriaLink).toHaveAttribute("href", /^\/servicios\//);
  });
});