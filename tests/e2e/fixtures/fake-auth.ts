import type { BrowserContext, Page } from "@playwright/test";

/**
 * Sets the minimum auth cookies required to bypass the Next.js proxy
 * (see src/proxy.ts) without needing a real backend.
 *
 * Works with the mocked service layer (NEXT_PUBLIC_USE_MOCKS=true) and
 * with pages whose data is sourced from `src/lib/mock-data` directly.
 *
 * Does NOT log the user into the Auth context — callers that depend on
 * `useAuth().user` will still see `null` and must skip with HAS_BACKEND_API.
 */
export async function fakeAuth(
  ctxOrPage: BrowserContext | Page,
  opts: { role?: "CLIENT" | "PROVIDER"; token?: string; userId?: string } = {},
) {
  const role = opts.role ?? "CLIENT";
  const token = opts.token ?? "e2e-fake-token";
  const userId = opts.userId ?? "e2e-fake-user";

  const context =
    "addCookies" in ctxOrPage ? ctxOrPage : ctxOrPage.context();

  await context.addCookies([
    {
      name: "taskao_auth_token",
      value: token,
      url: "http://localhost:4200",
    },
    {
      name: "taskao_user_roles",
      value: JSON.stringify([role]),
      url: "http://localhost:4200",
    },
    {
      name: "taskao_user_id",
      value: userId,
      url: "http://localhost:4200",
    },
  ]);
}