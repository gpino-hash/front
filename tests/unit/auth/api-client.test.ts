import { describe, it, expect, vi, beforeEach } from "vitest";

// We need to test api-client in isolation, so we mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Import after mocking fetch
import {
  apiFetch,
  setTokens,
  clearTokens,
  getAccessToken,
  ApiRequestError,
} from "@/lib/api/api-client";

beforeEach(() => {
  vi.clearAllMocks();
  clearTokens();
  localStorage.clear();
});

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function errorResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ─────────────────────────────────────────────────────────
// TOKEN MANAGEMENT
// ─────────────────────────────────────────────────────────
describe("Token management", () => {
  it("should store tokens in localStorage", () => {
    setTokens("access-abc", "refresh-xyz");

    expect(localStorage.getItem("taskao_access_token")).toBe("access-abc");
    expect(localStorage.getItem("taskao_refresh_token")).toBe("refresh-xyz");
  });

  it("should retrieve access token from memory first", () => {
    setTokens("in-memory", "refresh");

    expect(getAccessToken()).toBe("in-memory");
  });

  it("should clear tokens from localStorage", () => {
    setTokens("access", "refresh");
    clearTokens();

    expect(localStorage.getItem("taskao_access_token")).toBeNull();
    expect(localStorage.getItem("taskao_refresh_token")).toBeNull();
  });

  it("should clear auth cookie on clearTokens", () => {
    // Set a cookie first
    document.cookie = "taskao_auth_token=u1; path=/";
    clearTokens();

    expect(document.cookie).not.toContain("taskao_auth_token");
  });
});

// ─────────────────────────────────────────────────────────
// API FETCH - BASIC
// ─────────────────────────────────────────────────────────
describe("apiFetch()", () => {
  it("should make GET request with correct URL", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ data: "ok" }));

    const result = await apiFetch("/test");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/test"),
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
    expect(result).toEqual({ data: "ok" });
  });

  it("should include Authorization header when token is set", async () => {
    setTokens("my-token", "refresh");
    mockFetch.mockResolvedValueOnce(jsonResponse({ ok: true }));

    await apiFetch("/protected");

    const callHeaders = mockFetch.mock.calls[0][1].headers;
    expect(callHeaders["Authorization"]).toBe("Bearer my-token");
  });

  it("should not include Authorization header when no token", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ ok: true }));

    await apiFetch("/public");

    const callHeaders = mockFetch.mock.calls[0][1].headers;
    expect(callHeaders["Authorization"]).toBeUndefined();
  });

  it("should handle 204 No Content", async () => {
    mockFetch.mockResolvedValueOnce(new Response(null, { status: 204 }));

    const result = await apiFetch("/delete-something");

    expect(result).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────
// ERROR HANDLING
// ─────────────────────────────────────────────────────────
describe("apiFetch() error handling", () => {
  it("should throw ApiRequestError with message from API", async () => {
    mockFetch.mockResolvedValueOnce(
      errorResponse(400, { statusCode: 400, message: "Datos inválidos" })
    );

    await expect(apiFetch("/bad-request")).rejects.toThrow(ApiRequestError);
    await mockFetch.mockResolvedValueOnce(
      errorResponse(400, { statusCode: 400, message: "Datos inválidos" })
    );

    try {
      await apiFetch("/bad-request");
    } catch (e) {
      expect((e as ApiRequestError).message).toBe("Datos inválidos");
      expect((e as ApiRequestError).statusCode).toBe(400);
    }
  });

  it("should handle array error messages", async () => {
    mockFetch.mockResolvedValueOnce(
      errorResponse(400, {
        statusCode: 400,
        message: ["Email inválido", "Contraseña muy corta"],
      })
    );

    try {
      await apiFetch("/validate");
    } catch (e) {
      expect((e as ApiRequestError).message).toBe("Email inválido");
      expect((e as ApiRequestError).details).toEqual([
        "Email inválido",
        "Contraseña muy corta",
      ]);
    }
  });

  it("should show rate limit message on 429", async () => {
    mockFetch.mockResolvedValueOnce(
      errorResponse(429, { statusCode: 429, message: "Too many requests" })
    );

    try {
      await apiFetch("/rate-limited");
    } catch (e) {
      expect((e as ApiRequestError).message).toBe(
        "Demasiados intentos. Esperá unos minutos antes de reintentar."
      );
    }
  });

  it("should show duplicate email message on 409", async () => {
    mockFetch.mockResolvedValueOnce(
      errorResponse(409, { statusCode: 409, message: "Conflict" })
    );

    try {
      await apiFetch("/register");
    } catch (e) {
      expect((e as ApiRequestError).message).toBe(
        "Ya existe una cuenta con este email."
      );
    }
  });
});

// ─────────────────────────────────────────────────────────
// TOKEN REFRESH FLOW
// ─────────────────────────────────────────────────────────
describe("apiFetch() token refresh", () => {
  it("should retry request after refreshing token on 401", async () => {
    setTokens("expired-token", "valid-refresh");

    // First call: 401
    mockFetch.mockResolvedValueOnce(new Response(null, { status: 401 }));
    // Refresh call: success
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        accessToken: "new-access",
        refreshToken: "new-refresh",
        user: { id: "u1", email: "e@e.com", roles: ["CLIENT"] },
      })
    );
    // Retry original call: success
    mockFetch.mockResolvedValueOnce(jsonResponse({ data: "ok" }));

    const result = await apiFetch("/protected-endpoint");

    expect(result).toEqual({ data: "ok" });
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("should redirect to /login when refresh fails", async () => {
    setTokens("expired", "bad-refresh");

    const locationSpy = vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      href: "",
    });

    // First call: 401
    mockFetch.mockResolvedValueOnce(new Response(null, { status: 401 }));
    // Refresh call: 401 (refresh token also expired)
    mockFetch.mockResolvedValueOnce(new Response(null, { status: 401 }));

    await expect(apiFetch("/protected")).rejects.toThrow("Sesión expirada");

    locationSpy.mockRestore();
  });
});