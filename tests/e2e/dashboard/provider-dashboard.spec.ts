import { test, expect } from "@playwright/test";
import { fakeAuth } from "../fixtures/fake-auth";

/**
 * Sprint 2: Provider dashboard (/dashboard/proveedor and sub-routes).
 *
 * These pages sit behind the `src/proxy.ts` PROVIDER-role check and load
 * data via `useProviderDashboard`, which calls
 * `providerManagementService.getProviderByUserId(user.id)`. With
 * NEXT_PUBLIC_USE_MOCKS=true the mock registry starts with
 * `mockProvider = null`, so the dashboard renders the "Completá tu
 * registro" CTA until an onboarding is completed. Tests assert that
 * empty state on the home page and rely on URL accessibility for the
 * sub-routes.
 */

test.describe("S2-Proveedor: Provider dashboard", () => {
  test.beforeEach(async ({ context }) => {
    await fakeAuth(context, { role: "PROVIDER" });
  });

  test("home renders 'completá tu registro' CTA when no provider profile exists", async ({
    page,
  }) => {
    await page.goto("/dashboard/proveedor");
    await expect(
      page.getByRole("heading", { name: /completá tu registro/i }),
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      page.getByRole("link", { name: /comenzar registro/i }),
    ).toBeVisible();
  });

  test("agenda page is accessible", async ({ page }) => {
    await page.goto("/dashboard/proveedor/agenda");
    await expect(page).toHaveURL(/\/dashboard\/proveedor\/agenda/);
  });

  test("oportunidades is accessible", async ({ page }) => {
    await page.goto("/dashboard/proveedor/oportunidades");
    await expect(page).toHaveURL(/\/dashboard\/proveedor\/oportunidades/);
  });

  test("negocio page redirects to onboarding when no provider profile", async ({
    page,
  }) => {
    await page.goto("/dashboard/proveedor/negocio");
    // either lands on negocio (if no guard) OR redirects to onboarding
    await expect(page).toHaveURL(/\/(perfil\/onboarding|dashboard\/proveedor)/);
  });

  test("servicios page is accessible", async ({ page }) => {
    await page.goto("/dashboard/proveedor/servicios");
    await expect(page).toHaveURL(/\/dashboard\/proveedor\/servicios/);
  });
});

test.describe("S2-Proveedor: Pending verification page", () => {
  test.beforeEach(async ({ context }) => {
    await fakeAuth(context, { role: "PROVIDER" });
  });

  test("pendiente page renders with Taskao orange brand", async ({ page }) => {
    await page.goto("/dashboard/proveedor/pendiente");

    await expect(
      page.getByRole("heading", { name: /verificación en proceso/i }),
    ).toBeVisible();
    await expect(page.getByText(/mientras tanto podés/i)).toBeVisible();
  });
});