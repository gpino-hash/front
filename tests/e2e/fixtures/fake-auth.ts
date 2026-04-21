import type { BrowserContext, Page } from "@playwright/test";

export type FakeRole = "CLIENT" | "PROVIDER";

export interface FakeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: FakeRole[];
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  hasPassword: boolean;
  phone?: string;
}

const DEFAULT_USER: FakeUser = {
  id: "e2e-user",
  email: "e2e@test.com",
  firstName: "E2E",
  lastName: "User",
  roles: ["CLIENT"],
  emailVerified: true,
  twoFactorEnabled: false,
  hasPassword: true,
  phone: "+5411000000",
};

/**
 * Plants the cookies + localStorage tokens a real login would leave behind
 * and intercepts the two auth endpoints (`/auth/profile` + `/users/:id`)
 * that the AuthProvider polls on mount. No backend required.
 *
 * The Nest-style proxy (`src/proxy.ts`) reads the cookies to gate
 * `/dashboard/*`; the AuthContext reads the profile + details from the
 * intercepted routes to populate `useAuth().user`.
 *
 * Works in tandem with `NEXT_PUBLIC_USE_MOCKS=true` which keeps the rest
 * of the service layer in-memory — so pages backed by
 * `useCatalog`/`useProviderDashboard`/etc. still render without a backend.
 */
export async function fakeAuth(
  ctxOrPage: BrowserContext | Page,
  opts: { role?: FakeRole; user?: Partial<FakeUser> } = {},
) {
  const role = opts.role ?? "CLIENT";
  const user: FakeUser = {
    ...DEFAULT_USER,
    ...opts.user,
    roles: opts.user?.roles ?? [role],
  };

  const context =
    "addCookies" in ctxOrPage ? ctxOrPage : ctxOrPage.context();

  // 1. Cookies read by src/proxy.ts
  await context.addCookies([
    {
      name: "taskao_auth_token",
      value: "e2e-fake-access",
      url: "http://localhost:4200",
    },
    {
      name: "taskao_user_roles",
      value: JSON.stringify(user.roles),
      url: "http://localhost:4200",
    },
    {
      name: "taskao_user_id",
      value: user.id,
      url: "http://localhost:4200",
    },
  ]);

  // 2. localStorage tokens so `hasStoredSession()` returns true
  await context.addInitScript(() => {
    localStorage.setItem("taskao_access_token", "e2e-fake-access");
    localStorage.setItem("taskao_refresh_token", "e2e-fake-refresh");
  });

  // 3. Network mocks for the two endpoints AuthProvider hits on mount
  await context.route(/\/auth\/profile$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: user.id,
        email: user.email,
        roles: user.roles,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        googleId: null,
        hasPassword: user.hasPassword,
      }),
    });
  });

  await context.route(new RegExp(`/users/${user.id}$`), async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        profileImageUrl: null,
      }),
    });
  });
}