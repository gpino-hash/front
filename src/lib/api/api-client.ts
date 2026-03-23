import type { TokenResponse, ApiError } from "@/lib/auth/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

let accessToken: string | null = null;
let refreshToken: string | null = null;
let refreshPromise: Promise<TokenResponse> | null = null;

// Token management
export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  if (typeof window !== "undefined") {
    localStorage.setItem("taskao_access_token", access);
    localStorage.setItem("taskao_refresh_token", refresh);
  }
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem("taskao_access_token");
  }
  return accessToken;
}

function getRefreshToken(): string | null {
  if (refreshToken) return refreshToken;
  if (typeof window !== "undefined") {
    refreshToken = localStorage.getItem("taskao_refresh_token");
  }
  return refreshToken;
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("taskao_access_token");
    localStorage.removeItem("taskao_refresh_token");
    // Clear auth cookie used by middleware
    document.cookie = "taskao_auth_token=; path=/; max-age=0";
  }
}

function setAuthCookies(userId: string, roles: string[]) {
  if (typeof document !== "undefined") {
    document.cookie = `taskao_auth_token=${userId}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    document.cookie = `taskao_user_roles=${JSON.stringify(roles)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  }
}

// Refresh token logic with deduplication
async function refreshAccessToken(): Promise<TokenResponse> {
  const token = getRefreshToken();
  if (!token) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    clearTokens();
    throw new Error("Session expired");
  }

  const data: TokenResponse = await response.json();
  setTokens(data.accessToken, data.refreshToken);
  setAuthCookies(data.user.id, data.user.roles);
  return data;
}

// API error class
export class ApiRequestError extends Error {
  statusCode: number;
  details?: string[];

  constructor(statusCode: number, message: string, details?: string[]) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Main fetch wrapper with auto-refresh
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(url, { ...options, headers });

  // If 401, try refreshing token and retry once
  if (response.status === 401 && getRefreshToken()) {
    try {
      // Deduplicate concurrent refresh calls
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken();
      }
      const tokenData = await refreshPromise;
      refreshPromise = null;

      headers["Authorization"] = `Bearer ${tokenData.accessToken}`;
      response = await fetch(url, { ...options, headers });
    } catch {
      refreshPromise = null;
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new ApiRequestError(401, "Sesión expirada. Iniciá sesión nuevamente.");
    }
  }

  // Handle non-OK responses
  if (!response.ok) {
    let errorMessage = "Error del servidor";
    let details: string[] | undefined;

    try {
      const errorData: ApiError = await response.json();
      if (Array.isArray(errorData.message)) {
        errorMessage = errorData.message[0];
        details = errorData.message;
      } else {
        errorMessage = errorData.message;
      }
    } catch {
      // Response wasn't JSON
    }

    // User-friendly messages for common status codes
    if (response.status === 429) {
      errorMessage = "Demasiados intentos. Esperá unos minutos antes de reintentar.";
    } else if (response.status === 409) {
      errorMessage = "Ya existe una cuenta con este email.";
    }

    throw new ApiRequestError(response.status, errorMessage, details);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}