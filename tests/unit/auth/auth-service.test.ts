import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "@/lib/auth/auth-service";
import * as apiClient from "@/lib/api/api-client";

// Mock the API client module
vi.mock("@/lib/api/api-client", () => ({
  apiFetch: vi.fn(),
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
  ApiRequestError: class ApiRequestError extends Error {
    statusCode: number;
    details?: string[];
    constructor(statusCode: number, message: string, details?: string[]) {
      super(message);
      this.name = "ApiRequestError";
      this.statusCode = statusCode;
      this.details = details;
    }
  },
}));

const mockApiFetch = vi.mocked(apiClient.apiFetch);
const mockSetTokens = vi.mocked(apiClient.setTokens);
const mockClearTokens = vi.mocked(apiClient.clearTokens);

beforeEach(() => {
  vi.clearAllMocks();
});

// ─────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────
describe("authService.login()", () => {
  const credentials = { email: "test@example.com", password: "Password1!" };

  it("should return success and user on valid login", async () => {
    const tokenResponse = {
      accessToken: "access-123",
      refreshToken: "refresh-456",
      user: { id: "u1", email: "test@example.com", roles: ["CLIENT"] },
    };
    mockApiFetch.mockResolvedValueOnce(tokenResponse);

    const result = await authService.login(credentials);

    expect(result.success).toBe(true);
    expect(result.user).toEqual({
      id: "u1",
      email: "test@example.com",
      roles: ["CLIENT"],
    });
    expect(mockSetTokens).toHaveBeenCalledWith("access-123", "refresh-456");
    expect(mockApiFetch).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  });

  it("should handle 2FA requirement", async () => {
    mockApiFetch.mockResolvedValueOnce({
      requiresTwoFactor: true,
      twoFactorToken: "2fa-token-abc",
    });

    const result = await authService.login(credentials);

    expect(result.success).toBe(false);
    expect(result.requiresTwoFactor).toBe(true);
    expect(result.twoFactorToken).toBe("2fa-token-abc");
    expect(mockSetTokens).not.toHaveBeenCalled();
  });

  it("should return error message on ApiRequestError", async () => {
    mockApiFetch.mockRejectedValueOnce(
      new apiClient.ApiRequestError(401, "Credenciales inválidas")
    );

    const result = await authService.login(credentials);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Credenciales inválidas");
  });

  it("should return connection error on unknown errors", async () => {
    mockApiFetch.mockRejectedValueOnce(new Error("Network failure"));

    const result = await authService.login(credentials);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Error de conexión. Verificá tu internet.");
  });

  it("should set auth cookies with user id and roles", async () => {
    const tokenResponse = {
      accessToken: "a",
      refreshToken: "r",
      user: { id: "u1", email: "e@e.com", roles: ["PROVIDER"] },
    };
    mockApiFetch.mockResolvedValueOnce(tokenResponse);

    await authService.login(credentials);

    // Verify cookies were set (via document.cookie mock)
    expect(document.cookie).toContain("profesio_auth_token=u1");
    expect(document.cookie).toContain('profesio_user_roles=["PROVIDER"]');
  });
});

// ─────────────────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────────────────
describe("authService.register()", () => {
  const registerData = {
    email: "new@example.com",
    password: "StrongP@ss1",
    firstName: "Juan",
    lastName: "Perez",
  };

  it("should register and auto-login on success", async () => {
    // First call: register
    mockApiFetch.mockResolvedValueOnce({ message: "User created" });
    // Second call: login (auto-login)
    mockApiFetch.mockResolvedValueOnce({
      accessToken: "a",
      refreshToken: "r",
      user: { id: "u2", email: "new@example.com", roles: ["CLIENT"] },
    });

    const result = await authService.register(registerData);

    expect(result.success).toBe(true);
    expect(result.user?.email).toBe("new@example.com");
    // Verify register was called with correct payload
    expect(mockApiFetch).toHaveBeenCalledWith("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "new@example.com",
        password: "StrongP@ss1",
        firstName: "Juan",
        lastName: "Perez",
        roles: ["CLIENT"],
      }),
    });
  });

  it("should use provided roles when specified", async () => {
    mockApiFetch.mockResolvedValueOnce({ message: "User created" });
    mockApiFetch.mockResolvedValueOnce({
      accessToken: "a",
      refreshToken: "r",
      user: { id: "u3", email: "pro@example.com", roles: ["PROVIDER"] },
    });

    await authService.register({ ...registerData, roles: ["PROVIDER"] });

    const registerCall = mockApiFetch.mock.calls[0];
    const body = JSON.parse(registerCall[1]!.body as string);
    expect(body.roles).toEqual(["PROVIDER"]);
  });

  it("should return error when registration fails", async () => {
    mockApiFetch.mockRejectedValueOnce(
      new apiClient.ApiRequestError(409, "Ya existe una cuenta con este email.")
    );

    const result = await authService.register(registerData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Ya existe una cuenta con este email.");
  });

  it("should return connection error on network failure", async () => {
    mockApiFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    const result = await authService.register(registerData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Error de conexión. Verificá tu internet.");
  });
});

// ─────────────────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────────────────
describe("authService.logout()", () => {
  it("should clear tokens and cookies", async () => {
    await authService.logout();

    expect(mockClearTokens).toHaveBeenCalled();
    // Cookies cleared via document.cookie with max-age=0
    expect(document.cookie).not.toContain("profesio_auth_token");
    expect(document.cookie).not.toContain("profesio_user_roles");
  });
});

// ─────────────────────────────────────────────────────────
// GET PROFILE
// ─────────────────────────────────────────────────────────
describe("authService.getProfile()", () => {
  it("should return user profile on success", async () => {
    const profileData = {
      id: "u1",
      email: "test@example.com",
      roles: ["CLIENT"] as const,
      emailVerified: true,
      twoFactorEnabled: false,
    };
    mockApiFetch.mockResolvedValueOnce(profileData);

    const profile = await authService.getProfile();

    expect(profile).toEqual({
      id: "u1",
      email: "test@example.com",
      roles: ["CLIENT"],
      emailVerified: true,
      twoFactorEnabled: false,
    });
    expect(mockApiFetch).toHaveBeenCalledWith("/auth/profile");
  });

  it("should return null on error", async () => {
    mockApiFetch.mockRejectedValueOnce(new Error("Unauthorized"));

    const profile = await authService.getProfile();

    expect(profile).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────
// GET USER DETAILS
// ─────────────────────────────────────────────────────────
describe("authService.getUserDetails()", () => {
  it("should return user details", async () => {
    mockApiFetch.mockResolvedValueOnce({
      id: "u1",
      firstName: "Juan",
      lastName: "Perez",
      phone: "+5411123456",
      avatarUrl: null,
      status: "ACTIVE",
      createdAt: "2025-01-01T00:00:00Z",
    });

    const details = await authService.getUserDetails("u1");

    expect(details).toEqual({
      firstName: "Juan",
      lastName: "Perez",
      phone: "+5411123456",
      avatarUrl: undefined,
      status: "ACTIVE",
      createdAt: "2025-01-01T00:00:00Z",
    });
    expect(mockApiFetch).toHaveBeenCalledWith("/users/u1");
  });

  it("should convert null phone/avatar to undefined", async () => {
    mockApiFetch.mockResolvedValueOnce({
      id: "u1",
      firstName: "A",
      lastName: "B",
      phone: null,
      avatarUrl: null,
      status: "ACTIVE",
      createdAt: "2025-01-01",
    });

    const details = await authService.getUserDetails("u1");

    expect(details?.phone).toBeUndefined();
    expect(details?.avatarUrl).toBeUndefined();
  });

  it("should return null on error", async () => {
    mockApiFetch.mockRejectedValueOnce(new Error("Not found"));

    const details = await authService.getUserDetails("nonexistent");

    expect(details).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────
// FORGOT PASSWORD
// ─────────────────────────────────────────────────────────
describe("authService.forgotPassword()", () => {
  it("should return success on valid request", async () => {
    mockApiFetch.mockResolvedValueOnce({ message: "Email sent" });

    const result = await authService.forgotPassword("test@example.com");

    expect(result.success).toBe(true);
    expect(mockApiFetch).toHaveBeenCalledWith("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com" }),
    });
  });

  it("should return error on API failure", async () => {
    mockApiFetch.mockRejectedValueOnce(
      new apiClient.ApiRequestError(500, "Error interno")
    );

    const result = await authService.forgotPassword("test@example.com");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Error interno");
  });

  it("should return connection error on network failure", async () => {
    mockApiFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await authService.forgotPassword("test@example.com");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Error de conexión.");
  });
});

// ─────────────────────────────────────────────────────────
// RESET PASSWORD
// ─────────────────────────────────────────────────────────
describe("authService.resetPassword()", () => {
  it("should return success with valid token and password", async () => {
    mockApiFetch.mockResolvedValueOnce({ message: "Password reset" });

    const result = await authService.resetPassword("valid-token", "NewP@ss1");

    expect(result.success).toBe(true);
    expect(mockApiFetch).toHaveBeenCalledWith("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token: "valid-token", newPassword: "NewP@ss1" }),
    });
  });

  it("should return error for expired token", async () => {
    mockApiFetch.mockRejectedValueOnce(
      new apiClient.ApiRequestError(400, "Token expirado")
    );

    const result = await authService.resetPassword("expired-token", "NewP@ss1");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Token expirado");
  });
});

// ─────────────────────────────────────────────────────────
// VERIFY EMAIL
// ─────────────────────────────────────────────────────────
describe("authService.verifyEmail()", () => {
  it("should return success with valid token", async () => {
    mockApiFetch.mockResolvedValueOnce({ message: "Email verified" });

    const result = await authService.verifyEmail("valid-token");

    expect(result.success).toBe(true);
    expect(mockApiFetch).toHaveBeenCalledWith("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token: "valid-token" }),
    });
  });

  it("should return error for invalid token", async () => {
    mockApiFetch.mockRejectedValueOnce(
      new apiClient.ApiRequestError(400, "Token inválido")
    );

    const result = await authService.verifyEmail("bad-token");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Token inválido");
  });
});

// ─────────────────────────────────────────────────────────
// CHANGE PASSWORD
// ─────────────────────────────────────────────────────────
describe("authService.changePassword()", () => {
  it("should return success when passwords are valid", async () => {
    mockApiFetch.mockResolvedValueOnce({ message: "Password changed" });

    const result = await authService.changePassword("OldP@ss1", "NewP@ss2");

    expect(result.success).toBe(true);
    expect(mockApiFetch).toHaveBeenCalledWith("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword: "OldP@ss1", newPassword: "NewP@ss2" }),
    });
  });

  it("should return error when current password is wrong", async () => {
    mockApiFetch.mockRejectedValueOnce(
      new apiClient.ApiRequestError(401, "Contraseña actual incorrecta")
    );

    const result = await authService.changePassword("WrongP@ss", "NewP@ss2");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Contraseña actual incorrecta");
  });
});

// ─────────────────────────────────────────────────────────
// UPDATE PROFILE
// ─────────────────────────────────────────────────────────
describe("authService.updateProfile()", () => {
  it("should send PUT request with profile data", async () => {
    mockApiFetch.mockResolvedValueOnce(undefined);

    const result = await authService.updateProfile("u1", {
      firstName: "Carlos",
      lastName: "Garcia",
    });

    expect(result.success).toBe(true);
    expect(mockApiFetch).toHaveBeenCalledWith("/users/u1", {
      method: "PUT",
      body: JSON.stringify({ firstName: "Carlos", lastName: "Garcia" }),
    });
  });

  it("should return error on failure", async () => {
    mockApiFetch.mockRejectedValueOnce(
      new apiClient.ApiRequestError(500, "Error del servidor")
    );

    const result = await authService.updateProfile("u1", { firstName: "X" });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Error del servidor");
  });
});

// ─────────────────────────────────────────────────────────
// HAS STORED SESSION
// ─────────────────────────────────────────────────────────
describe("authService.hasStoredSession()", () => {
  it("should return true when access token exists in localStorage", () => {
    localStorage.setItem("profesio_access_token", "some-token");

    expect(authService.hasStoredSession()).toBe(true);
  });

  it("should return false when no access token in localStorage", () => {
    expect(authService.hasStoredSession()).toBe(false);
  });
});
