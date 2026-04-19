import { describe, it, expect, vi } from "vitest";

// Mock next/server
vi.mock("next/server", () => {
  class MockNextResponse {
    static redirect(url: URL) {
      return { type: "redirect", url: url.toString() };
    }
    static next() {
      return { type: "next" };
    }
  }
  return { NextResponse: MockNextResponse };
});

import { proxy as middleware } from "@/proxy";
import type { NextRequest } from "next/server";

function createMockRequest(
  pathname: string,
  cookies: Record<string, string> = {}
): NextRequest {
  const url = new URL(pathname, "http://localhost:3000");
  return {
    nextUrl: url,
    url: url.toString(),
    cookies: {
      get: (name: string) => {
        const value = cookies[name];
        return value ? { name, value } : undefined;
      },
    },
  } as unknown as NextRequest;
}

// ─────────────────────────────────────────────────────────
// UNAUTHENTICATED USERS
// ─────────────────────────────────────────────────────────
describe("Middleware - Unauthenticated users", () => {
  it("should redirect to /login from /dashboard", () => {
    const request = createMockRequest("/dashboard");
    const response = middleware(request) as any;

    expect(response.type).toBe("redirect");
    expect(response.url).toContain("/login");
    expect(response.url).toContain("redirect=%2Fdashboard");
  });

  it("should redirect to /login from /dashboard/cliente", () => {
    const request = createMockRequest("/dashboard/cliente");
    const response = middleware(request) as any;

    expect(response.type).toBe("redirect");
    expect(response.url).toContain("/login");
  });

  it("should redirect to /login from /dashboard/proveedor", () => {
    const request = createMockRequest("/dashboard/proveedor");
    const response = middleware(request) as any;

    expect(response.type).toBe("redirect");
    expect(response.url).toContain("/login");
  });

  it("should redirect to /login from /perfil", () => {
    const request = createMockRequest("/perfil");
    const response = middleware(request) as any;

    expect(response.type).toBe("redirect");
    expect(response.url).toContain("/login");
  });

  it("should redirect to /login from /nueva-solicitud", () => {
    const request = createMockRequest("/nueva-solicitud");
    const response = middleware(request) as any;

    expect(response.type).toBe("redirect");
    expect(response.url).toContain("/login");
  });

  it("should include redirect param in login URL", () => {
    const request = createMockRequest("/dashboard/cliente/reservas");
    const response = middleware(request) as any;

    expect(response.url).toContain(
      "redirect=%2Fdashboard%2Fcliente%2Freservas"
    );
  });

  it("should allow access to /login without redirect", () => {
    const request = createMockRequest("/login");
    const response = middleware(request) as any;

    expect(response.type).toBe("next");
  });

  it("should allow access to /register", () => {
    const request = createMockRequest("/register");
    const response = middleware(request) as any;

    expect(response.type).toBe("next");
  });

  it("should allow access to /forgot-password", () => {
    const request = createMockRequest("/forgot-password");
    const response = middleware(request) as any;

    expect(response.type).toBe("next");
  });

  it("should allow access to /reset-password", () => {
    const request = createMockRequest("/reset-password");
    const response = middleware(request) as any;

    expect(response.type).toBe("next");
  });

  it("should allow access to /verify-email", () => {
    const request = createMockRequest("/verify-email");
    const response = middleware(request) as any;

    expect(response.type).toBe("next");
  });
});

// ─────────────────────────────────────────────────────────
// AUTHENTICATED USERS — REDIRECT AWAY FROM AUTH PAGES
// ─────────────────────────────────────────────────────────
describe("Middleware - Authenticated users on auth pages", () => {
  it("should redirect CLIENT from /login to /dashboard/cliente", () => {
    const request = createMockRequest("/login", {
      taskao_auth_token: "u1",
      taskao_user_roles: JSON.stringify(["CLIENT"]),
    });
    const response = middleware(request) as any;

    expect(response.type).toBe("redirect");
    expect(response.url).toContain("/dashboard/cliente");
  });

  it("should redirect PROVIDER from /login to /dashboard/proveedor", () => {
    const request = createMockRequest("/login", {
      taskao_auth_token: "u2",
      taskao_user_roles: JSON.stringify(["PROVIDER"]),
    });
    const response = middleware(request) as any;

    expect(response.type).toBe("redirect");
    expect(response.url).toContain("/dashboard/proveedor");
  });

  it("should redirect PROVIDER+CLIENT from /login to /dashboard/proveedor", () => {
    const request = createMockRequest("/login", {
      taskao_auth_token: "u3",
      taskao_user_roles: JSON.stringify(["CLIENT", "PROVIDER"]),
    });
    const response = middleware(request) as any;

    expect(response.type).toBe("redirect");
    expect(response.url).toContain("/dashboard/proveedor");
  });

  it("should redirect authenticated user from /register", () => {
    const request = createMockRequest("/register", {
      taskao_auth_token: "u1",
      taskao_user_roles: JSON.stringify(["CLIENT"]),
    });
    const response = middleware(request) as any;

    expect(response.type).toBe("redirect");
    expect(response.url).toContain("/dashboard/cliente");
  });

  it("should redirect authenticated user from /forgot-password", () => {
    const request = createMockRequest("/forgot-password", {
      taskao_auth_token: "u1",
      taskao_user_roles: JSON.stringify(["CLIENT"]),
    });
    const response = middleware(request) as any;

    expect(response.type).toBe("redirect");
  });

  it("should redirect from /register/provider when authenticated", () => {
    const request = createMockRequest("/register/provider", {
      taskao_auth_token: "u1",
      taskao_user_roles: JSON.stringify(["CLIENT"]),
    });
    const response = middleware(request) as any;

    expect(response.type).toBe("redirect");
  });
});

// ─────────────────────────────────────────────────────────
// ROLE-BASED ACCESS CONTROL
// ─────────────────────────────────────────────────────────
describe("Middleware - Role-based access", () => {
  it("should allow CLIENT to access /dashboard/cliente", () => {
    const request = createMockRequest("/dashboard/cliente", {
      taskao_auth_token: "u1",
      taskao_user_roles: JSON.stringify(["CLIENT"]),
    });
    const response = middleware(request) as any;

    expect(response.type).toBe("next");
  });

  it("should allow PROVIDER to access /dashboard/proveedor", () => {
    const request = createMockRequest("/dashboard/proveedor", {
      taskao_auth_token: "u2",
      taskao_user_roles: JSON.stringify(["PROVIDER"]),
    });
    const response = middleware(request) as any;

    expect(response.type).toBe("next");
  });

  it("should redirect CLIENT away from /dashboard/proveedor", () => {
    const request = createMockRequest("/dashboard/proveedor", {
      taskao_auth_token: "u1",
      taskao_user_roles: JSON.stringify(["CLIENT"]),
    });
    const response = middleware(request) as any;

    expect(response.type).toBe("redirect");
    expect(response.url).toContain("/dashboard/cliente");
  });

  it("should redirect PROVIDER away from /dashboard/cliente", () => {
    const request = createMockRequest("/dashboard/cliente", {
      taskao_auth_token: "u2",
      taskao_user_roles: JSON.stringify(["PROVIDER"]),
    });
    const response = middleware(request) as any;

    expect(response.type).toBe("redirect");
    expect(response.url).toContain("/dashboard/proveedor");
  });

  it("should allow dual-role user to access /dashboard/cliente", () => {
    const request = createMockRequest("/dashboard/cliente", {
      taskao_auth_token: "u3",
      taskao_user_roles: JSON.stringify(["CLIENT", "PROVIDER"]),
    });
    const response = middleware(request) as any;

    expect(response.type).toBe("next");
  });

  it("should allow dual-role user to access /dashboard/proveedor", () => {
    const request = createMockRequest("/dashboard/proveedor", {
      taskao_auth_token: "u3",
      taskao_user_roles: JSON.stringify(["CLIENT", "PROVIDER"]),
    });
    const response = middleware(request) as any;

    expect(response.type).toBe("next");
  });

  it("should allow ADMIN to access /dashboard (no role restriction on base)", () => {
    const request = createMockRequest("/dashboard", {
      taskao_auth_token: "admin1",
      taskao_user_roles: JSON.stringify(["ADMIN"]),
    });
    const response = middleware(request) as any;

    expect(response.type).toBe("next");
  });
});

// ─────────────────────────────────────────────────────────
// EDGE CASES
// ─────────────────────────────────────────────────────────
describe("Middleware - Edge cases", () => {
  it("should handle authenticated user with no roles cookie", () => {
    const request = createMockRequest("/dashboard/cliente", {
      taskao_auth_token: "u1",
      // no taskao_user_roles cookie
    });
    const response = middleware(request) as any;

    // No roles = no role check, should pass through
    expect(response.type).toBe("next");
  });

  it("should handle nested protected paths", () => {
    const request = createMockRequest("/dashboard/cliente/settings/security");
    const response = middleware(request) as any;

    // Unauthenticated, should redirect
    expect(response.type).toBe("redirect");
    expect(response.url).toContain("/login");
  });
});