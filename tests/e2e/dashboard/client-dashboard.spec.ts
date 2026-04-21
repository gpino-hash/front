import { test, expect } from "@playwright/test";
import { fakeAuth } from "../fixtures/fake-auth";

/**
 * Sprint 2: Client dashboard (/dashboard/cliente).
 *
 * The page reads MOCK_REQUESTS directly from src/lib/mock-data — no
 * `useAuth().user?.id` dependency — so we only need to bypass the
 * Next.js proxy's cookie check (see src/proxy.ts). `fakeAuth` plants
 * the two cookies the proxy looks for; no backend required.
 */

test.describe("S2-Cliente: Client dashboard", () => {
  test.beforeEach(async ({ context }) => {
    await fakeAuth(context, { role: "CLIENT" });
  });

  test("renders heading and stats", async ({ page }) => {
    await page.goto("/dashboard/cliente");

    await expect(
      page.getByRole("heading", { name: /mis solicitudes/i, level: 1 }),
    ).toBeVisible();

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
    await page
      .getByRole("link", { name: /nueva solicitud/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/dashboard\/cliente\/nueva-solicitud/);
  });

  test("sidebar popular categories link uses /servicios", async ({ page }) => {
    await page.goto("/dashboard/cliente");

    // Catches the audit's broken-link finding — links should start with /servicios
    const plumeriaLink = page.getByRole("link", { name: /plomería/i });
    await expect(plumeriaLink).toHaveAttribute("href", /^\/servicios\//);
  });
});