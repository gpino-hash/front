import { test, expect } from "@playwright/test";

/**
 * Sprint 2: Public provider profile (/proveedores/[id]).
 *
 * Uses mock data; no backend needed. Mock IDs come from
 * marketplace-web/src/lib/mock-data/providers.ts.
 */

const KNOWN_PROVIDER_ID = "p1";

test.describe("Proveedores — Public profile", () => {
  test("renders provider header with name and rating", async ({ page }) => {
    await page.goto(`/proveedores/${KNOWN_PROVIDER_ID}`);

    await expect(page.locator("h1").first()).toBeVisible({ timeout: 10_000 });
    // Rating star icon is rendered as Material Symbol "star"
    await expect(page.locator(".material-symbols-outlined").getByText("star").first()).toBeVisible();
  });

  test("services tab lists at least one service", async ({ page }) => {
    await page.goto(`/proveedores/${KNOWN_PROVIDER_ID}`);

    // The default tab shows services; look for a price (ARS) to confirm
    const priceMatch = page.getByText(/\$\s?[\d.,]+/).first();
    await expect(priceMatch).toBeVisible({ timeout: 10_000 });
  });

  test("reviews tab is accessible", async ({ page }) => {
    await page.goto(`/proveedores/${KNOWN_PROVIDER_ID}`);

    const reviewsTab = page.getByRole("button", { name: /reseñas|reviews/i });
    if (await reviewsTab.count()) {
      await reviewsTab.first().click();
    }

    // either a review count heading or an empty state
    await expect(
      page.getByText(/reseñas|sin reseñas|todavía no/i).first()
    ).toBeVisible({ timeout: 5_000 });
  });

  test("unknown provider shows not-found state", async ({ page }) => {
    await page.goto("/proveedores/no-existe-xyz");

    await expect(
      page.getByText(/no encontrado|no existe|error/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});