import { test, expect } from "@playwright/test";

/**
 * Sprint 2: Public services catalog
 *
 * The catalog runs against mocked services by default (MockCatalogService),
 * so these tests don't require a backend.
 */

test.describe("Servicios — Catalog page", () => {
  test("hero renders with search input", async ({ page }) => {
    await page.goto("/servicios");

    await expect(
      page.getByRole("heading", { name: /encontrá el profesional/i })
    ).toBeVisible();
    await expect(
      page.getByPlaceholder(/qué servicio necesitás/i)
    ).toBeVisible();
  });

  test("categories section renders cards", async ({ page }) => {
    await page.goto("/servicios");

    await expect(
      page.getByRole("heading", { name: /categorías/i, level: 2 })
    ).toBeVisible();

    // At least one category card must render (mock provides several)
    await expect(page.locator("a[href^='/servicios/']").first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("search filter narrows category results", async ({ page }) => {
    await page.goto("/servicios");

    // wait for categories to load
    await page.locator("a[href^='/servicios/']").first().waitFor();

    await page.getByPlaceholder(/qué servicio necesitás/i).fill("zzzzz-no-match");

    await expect(
      page.getByText(/no se encontraron categorías/i)
    ).toBeVisible({ timeout: 3000 });
  });

  test("clicking a category navigates to its slug", async ({ page }) => {
    await page.goto("/servicios");

    const firstCat = page.locator("a[href^='/servicios/']").first();
    await firstCat.waitFor();
    await firstCat.click();

    await expect(page).toHaveURL(/\/servicios\/[^/]+/);
  });

  test("featured services section is present", async ({ page }) => {
    await page.goto("/servicios");

    await expect(
      page.getByRole("heading", { name: /destacados|populares|featured/i })
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Servicios — Category detail", () => {
  test("renders category header when slug exists", async ({ page }) => {
    await page.goto("/servicios");
    const firstCat = page.locator("a[href^='/servicios/']").first();
    await firstCat.waitFor();
    const href = await firstCat.getAttribute("href");
    expect(href).toBeTruthy();

    await page.goto(href!);

    // heading + at least one service or empty-state
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 10_000 });
  });

  test("unknown slug shows an error / empty state", async ({ page }) => {
    await page.goto("/servicios/slug-que-no-existe-xyz");

    // Accept either an explicit error message or an empty-list indicator
    const notFound = page.getByText(/no se encontr|sin resultados|no existe|error/i);
    await expect(notFound.first()).toBeVisible({ timeout: 10_000 });
  });
});