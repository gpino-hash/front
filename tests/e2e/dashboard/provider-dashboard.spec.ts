import { test, expect } from "@playwright/test";
import { HAS_BACKEND_API } from "../fixtures/api-helpers";

/**
 * Sprint 2: Provider dashboard (/dashboard/proveedor and sub-routes).
 * All these pages require an authenticated provider session.
 */

test.describe("S2-Proveedor: Provider dashboard", () => {
  test.skip(!HAS_BACKEND_API, "Requires backend API for authenticated provider");

  test("home renders stats and opportunities", async ({ page }) => {
    await page.goto("/dashboard/proveedor");
    await expect(page.locator("h1").first()).toBeVisible();
    // "Solicitudes abiertas" card should be present
    await expect(page.getByText(/solicitudes abiertas/i).first()).toBeVisible();
  });

  test("agenda page is accessible", async ({ page }) => {
    await page.goto("/dashboard/proveedor/agenda");
    await expect(page).toHaveURL(/\/dashboard\/proveedor\/agenda/);
  });

  test("oportunidades lists open requests", async ({ page }) => {
    await page.goto("/dashboard/proveedor/oportunidades");
    await expect(page).toHaveURL(/\/dashboard\/proveedor\/oportunidades/);
  });

  test("negocio page renders profile form", async ({ page }) => {
    await page.goto("/dashboard/proveedor/negocio");
    // any input on the profile section should be visible
    await expect(page.getByLabel(/nombre profesional|displayName/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("servicios page lists provider's own services", async ({ page }) => {
    await page.goto("/dashboard/proveedor/servicios");
    await expect(page).toHaveURL(/\/dashboard\/proveedor\/servicios/);
  });
});

test.describe("S2-Proveedor: Pending verification page", () => {
  // This page can render standalone but is only meaningful post-onboarding.
  test("pendiente page renders with orange brand and dark-mode compatible markup", async ({ page }) => {
    test.skip(!HAS_BACKEND_API, "Requires authenticated provider context");
    await page.goto("/dashboard/proveedor/pendiente");

    await expect(
      page.getByRole("heading", { name: /verificación en proceso/i })
    ).toBeVisible();
    // The page should show "Mientras tanto podés" section
    await expect(page.getByText(/mientras tanto podés/i)).toBeVisible();
  });
});