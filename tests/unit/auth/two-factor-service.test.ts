import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "@/lib/auth/auth-service";
import * as apiClient from "@/lib/api/api-client";

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

beforeEach(() => {
  vi.clearAllMocks();
});

// ─────────────────────────────────────────────────────────
// SETUP 2FA
// ─────────────────────────────────────────────────────────
describe("authService.setup2FA()", () => {
  it("should call POST /auth/2fa/setup with method", async () => {
    mockApiFetch.mockResolvedValueOnce({
      secret: "JBSWY3DPEHPK3PXP",
      qrCodeUrl: "data:image/png;base64,...",
      recoveryCodes: ["ABC12345"],
    });

    const result = await authService.setup2FA("authenticator");

    expect(result.success).toBe(true);
    expect(result.secret).toBe("JBSWY3DPEHPK3PXP");
    expect(mockApiFetch).toHaveBeenCalledWith("/auth/2fa/setup", {
      method: "POST",
      body: JSON.stringify({ method: "authenticator" }),
    });
  });

  it("should handle SMS method", async () => {
    mockApiFetch.mockResolvedValueOnce({
      secret: "SECRET",
      qrCodeUrl: "",
      recoveryCodes: [],
    });

    const result = await authService.setup2FA("sms");

    expect(result.success).toBe(true);
    expect(mockApiFetch).toHaveBeenCalledWith("/auth/2fa/setup", {
      method: "POST",
      body: JSON.stringify({ method: "sms" }),
    });
  });

  it("should return error on ApiRequestError", async () => {
    mockApiFetch.mockRejectedValueOnce(
      new apiClient.ApiRequestError(409, "2FA already enabled")
    );

    const result = await authService.setup2FA("authenticator");

    expect(result.success).toBe(false);
    expect(result.error).toBe("2FA already enabled");
  });

  it("should return connection error on unknown errors", async () => {
    mockApiFetch.mockRejectedValueOnce(new Error("Network failure"));

    const result = await authService.setup2FA("authenticator");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Error de conexión.");
  });
});

// ─────────────────────────────────────────────────────────
// VERIFY 2FA SETUP (CONFIRM)
// ─────────────────────────────────────────────────────────
describe("authService.verify2FASetup()", () => {
  it("should call POST /auth/2fa/confirm with code", async () => {
    mockApiFetch.mockResolvedValueOnce({
      recoveryCodes: ["CODE0001", "CODE0002", "CODE0003"],
    });

    const result = await authService.verify2FASetup("123456", "secret-ignored");

    expect(result.success).toBe(true);
    expect(result.recoveryCodes).toEqual(["CODE0001", "CODE0002", "CODE0003"]);
    expect(mockApiFetch).toHaveBeenCalledWith("/auth/2fa/confirm", {
      method: "POST",
      body: JSON.stringify({ code: "123456" }),
    });
  });

  it("should return error on invalid code", async () => {
    mockApiFetch.mockRejectedValueOnce(
      new apiClient.ApiRequestError(400, "Invalid 2FA code")
    );

    const result = await authService.verify2FASetup("999999");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid 2FA code");
  });

  it("should return connection error on unknown errors", async () => {
    mockApiFetch.mockRejectedValueOnce(new Error("Timeout"));

    const result = await authService.verify2FASetup("123456");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Error de conexión.");
  });
});

// ─────────────────────────────────────────────────────────
// VERIFY 2FA LOGIN
// ─────────────────────────────────────────────────────────
describe("authService.verify2FALogin()", () => {
  it("should verify 2FA and set tokens on success", async () => {
    const tokenResponse = {
      accessToken: "access-jwt",
      refreshToken: "refresh-jwt",
      user: { id: "u1", email: "test@example.com", roles: ["CLIENT"] },
    };
    mockApiFetch.mockResolvedValueOnce(tokenResponse);

    const result = await authService.verify2FALogin("2fa-token", "123456");

    expect(result.success).toBe(true);
    expect(result.user).toEqual({
      id: "u1",
      email: "test@example.com",
      roles: ["CLIENT"],
    });
    expect(mockSetTokens).toHaveBeenCalledWith("access-jwt", "refresh-jwt");
    expect(mockApiFetch).toHaveBeenCalledWith("/auth/2fa/verify", {
      method: "POST",
      body: JSON.stringify({ twoFactorToken: "2fa-token", totpCode: "123456" }),
    });
  });

  it("should set auth cookies on successful verification", async () => {
    mockApiFetch.mockResolvedValueOnce({
      accessToken: "a",
      refreshToken: "r",
      user: { id: "u1", email: "e@e.com", roles: ["PROVIDER"] },
    });

    await authService.verify2FALogin("token", "123456");

    expect(document.cookie).toContain("taskao_auth_token=u1");
    expect(document.cookie).toContain('taskao_user_roles=["PROVIDER"]');
  });

  it("should return error on invalid code", async () => {
    mockApiFetch.mockRejectedValueOnce(
      new apiClient.ApiRequestError(401, "Invalid 2FA code")
    );

    const result = await authService.verify2FALogin("token", "999999");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid 2FA code");
    expect(mockSetTokens).not.toHaveBeenCalled();
  });

  it("should return specific error on expired token", async () => {
    mockApiFetch.mockRejectedValueOnce(
      new apiClient.ApiRequestError(401, "Token expired")
    );

    const result = await authService.verify2FALogin("expired-token", "123456");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Token expired");
  });

  it("should return fallback error on unknown errors", async () => {
    mockApiFetch.mockRejectedValueOnce(new Error("Network down"));

    const result = await authService.verify2FALogin("token", "123456");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Código inválido o expirado.");
  });
});

// ─────────────────────────────────────────────────────────
// DISABLE 2FA
// ─────────────────────────────────────────────────────────
describe("authService.disable2FA()", () => {
  it("should call POST /auth/2fa/disable with password", async () => {
    mockApiFetch.mockResolvedValueOnce({ message: "2FA disabled" });

    const result = await authService.disable2FA("MyPassword123");

    expect(result.success).toBe(true);
    expect(mockApiFetch).toHaveBeenCalledWith("/auth/2fa/disable", {
      method: "POST",
      body: JSON.stringify({ password: "MyPassword123" }),
    });
  });

  it("should return error on wrong password", async () => {
    mockApiFetch.mockRejectedValueOnce(
      new apiClient.ApiRequestError(401, "Invalid credentials")
    );

    const result = await authService.disable2FA("WrongPassword");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid credentials");
  });

  it("should return error when 2FA is not enabled", async () => {
    mockApiFetch.mockRejectedValueOnce(
      new apiClient.ApiRequestError(400, "2FA not enabled")
    );

    const result = await authService.disable2FA("Password123");

    expect(result.success).toBe(false);
    expect(result.error).toBe("2FA not enabled");
  });

  it("should return connection error on unknown errors", async () => {
    mockApiFetch.mockRejectedValueOnce(new Error("Connection refused"));

    const result = await authService.disable2FA("password");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Error de conexión.");
  });
});

// ─────────────────────────────────────────────────────────
// SEND SMS 2FA CODE
// ─────────────────────────────────────────────────────────
describe("authService.sendSms2FACode()", () => {
  it("should call POST /auth/2fa/send-sms with phone", async () => {
    mockApiFetch.mockResolvedValueOnce({ message: "SMS sent" });

    const result = await authService.sendSms2FACode("+5411123456789");

    expect(result.success).toBe(true);
    expect(mockApiFetch).toHaveBeenCalledWith("/auth/2fa/send-sms", {
      method: "POST",
      body: JSON.stringify({ phone: "+5411123456789" }),
    });
  });

  it("should return error on API failure", async () => {
    mockApiFetch.mockRejectedValueOnce(
      new apiClient.ApiRequestError(429, "Too many requests")
    );

    const result = await authService.sendSms2FACode("+5411123456789");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Too many requests");
  });

  it("should return connection error on unknown errors", async () => {
    mockApiFetch.mockRejectedValueOnce(new Error("Network"));

    const result = await authService.sendSms2FACode("+5411123456789");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Error de conexión.");
  });
});
