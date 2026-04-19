import { apiFetch, setTokens, clearTokens, ApiRequestError } from "@/lib/api/api-client";
import type {
  AuthUser,
  LoginCredentials,
  RegisterData,
  AuthResult,
  TokenResponse,
  TwoFactorMethod,
  TwoFactorSetupResponse,
  TwoFactorVerifyResult,
  TwoFactorLoginResult,
} from "./types";

function setAuthCookies(userId: string, roles: string[]) {
  if (typeof document !== "undefined") {
    document.cookie = `taskao_auth_token=${userId}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    document.cookie = `taskao_user_roles=${JSON.stringify(roles)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  }
}

function clearAuthCookies() {
  if (typeof document !== "undefined") {
    document.cookie = "taskao_auth_token=; path=/; max-age=0";
    document.cookie = "taskao_user_roles=; path=/; max-age=0";
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const data = await apiFetch<TokenResponse | { requiresTwoFactor: true; twoFactorToken: string }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(credentials),
        }
      );

      // 2FA required
      if ("requiresTwoFactor" in data) {
        return {
          success: false,
          requiresTwoFactor: true,
          twoFactorToken: data.twoFactorToken,
        };
      }

      // Normal login
      setTokens(data.accessToken, data.refreshToken);
      setAuthCookies(data.user.id, data.user.roles);

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        roles: data.user.roles,
      };

      return { success: true, user };
    } catch (error) {
      if (error instanceof ApiRequestError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Error de conexión. Verificá tu internet." };
    }
  },

  async register(data: RegisterData): Promise<AuthResult> {
    try {
      await apiFetch<{ message: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          roles: data.roles || ["CLIENT"],
        }),
      });

      // Auto-login after registration
      return await authService.login({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      if (error instanceof ApiRequestError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Error de conexión. Verificá tu internet." };
    }
  },

  async logout(): Promise<void> {
    clearTokens();
    clearAuthCookies();
  },

  async getProfile(): Promise<AuthUser | null> {
    try {
      const profile = await apiFetch<{
        id: string;
        email: string;
        roles: AuthUser["roles"];
        emailVerified: boolean;
        twoFactorEnabled: boolean;
        googleId: string | null;
        hasPassword: boolean;
      }>("/auth/profile");

      return {
        id: profile.id,
        email: profile.email,
        roles: profile.roles,
        emailVerified: profile.emailVerified,
        twoFactorEnabled: profile.twoFactorEnabled,
        googleId: profile.googleId || undefined,
        hasPassword: profile.hasPassword,
      };
    } catch {
      return null;
    }
  },

  async getUserDetails(userId: string): Promise<Partial<AuthUser> | null> {
    try {
      const user = await apiFetch<{
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        status: string;
        createdAt: string;
      }>(`/users/${userId}`);

      return {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || undefined,
        avatarUrl: user.avatarUrl || undefined,
        status: user.status as AuthUser["status"],
        createdAt: user.createdAt,
      };
    } catch {
      return null;
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiFetch<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      return { success: true };
    } catch (error) {
      if (error instanceof ApiRequestError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Error de conexión." };
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiFetch<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
      });
      return { success: true };
    } catch (error) {
      if (error instanceof ApiRequestError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Error de conexión." };
    }
  },

  async verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiFetch<{ message: string }>("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      return { success: true };
    } catch (error) {
      if (error instanceof ApiRequestError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Error de conexión." };
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiFetch<{ message: string }>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return { success: true };
    } catch (error) {
      if (error instanceof ApiRequestError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Error de conexión." };
    }
  },

  async updateProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      await apiFetch(`/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return { success: true };
    } catch (error) {
      if (error instanceof ApiRequestError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Error de conexión." };
    }
  },

  // --- Two-Factor Authentication ---

  async setup2FA(method: TwoFactorMethod): Promise<TwoFactorSetupResponse & { success: boolean; error?: string }> {
    try {
      const data = await apiFetch<TwoFactorSetupResponse>("/auth/2fa/setup", {
        method: "POST",
        body: JSON.stringify({ method }),
      });
      return { ...data, success: true };
    } catch (error) {
      if (error instanceof ApiRequestError) {
        return { success: false, error: error.message, secret: "", qrCodeUrl: "", recoveryCodes: [] };
      }
      return { success: false, error: "Error de conexión.", secret: "", qrCodeUrl: "", recoveryCodes: [] };
    }
  },

  async verify2FASetup(code: string): Promise<TwoFactorVerifyResult> {
    try {
      const data = await apiFetch<{ recoveryCodes: string[] }>("/auth/2fa/confirm", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      return { success: true, recoveryCodes: data.recoveryCodes };
    } catch (error) {
      if (error instanceof ApiRequestError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Error de conexión." };
    }
  },

  async verify2FALogin(token: string, code: string): Promise<TwoFactorLoginResult> {
    try {
      const data = await apiFetch<TokenResponse>("/auth/2fa/verify", {
        method: "POST",
        body: JSON.stringify({ twoFactorToken: token, totpCode: code }),
      });

      setTokens(data.accessToken, data.refreshToken);
      setAuthCookies(data.user.id, data.user.roles);

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        roles: data.user.roles,
      };

      return { success: true, user };
    } catch (error) {
      if (error instanceof ApiRequestError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Código inválido o expirado." };
    }
  },

  async disable2FA(password: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiFetch("/auth/2fa/disable", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      return { success: true };
    } catch (error) {
      if (error instanceof ApiRequestError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Error de conexión." };
    }
  },

  async sendSms2FACode(phone: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiFetch("/auth/2fa/send-sms", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });
      return { success: true };
    } catch (error) {
      if (error instanceof ApiRequestError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Error de conexión." };
    }
  },

  // --- OAuth ---

  /** URL del backend que inicia el flujo OAuth con Google (redirect a Google consent) */
  getGoogleAuthUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    return `${baseUrl}/auth/google`;
  },

  /**
   * Almacena tokens recibidos del backend OAuth redirect.
   * El backend redirige a /auth/google/callback?accessToken=...&refreshToken=...&isNewUser=...
   */
  storeOAuthTokens(accessToken: string, refreshToken: string) {
    setTokens(accessToken, refreshToken);
  },

  /**
   * Setea las cookies de sesión después de un login OAuth exitoso.
   * Debe llamarse después de obtener el profile del usuario.
   */
  setSessionCookies(userId: string, roles: string[]) {
    setAuthCookies(userId, roles);
  },

  /**
   * Vincular Google: redirige al mismo endpoint OAuth.
   * Si el usuario ya tiene sesión y el email coincide, el backend vincula automáticamente.
   */
  getGoogleLinkUrl(): string {
    return this.getGoogleAuthUrl();
  },

  /** Desvincular Google de la cuenta (requiere tener password configurada — el backend lo valida) */
  async unlinkGoogle(): Promise<{ success: boolean; error?: string }> {
    try {
      await apiFetch<{ message: string }>("/auth/google/unlink", {
        method: "DELETE",
      });
      return { success: true };
    } catch (error) {
      if (error instanceof ApiRequestError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Error de conexión." };
    }
  },

  // Check if there's a stored session (for initial load)
  hasStoredSession(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("taskao_access_token");
  },
};