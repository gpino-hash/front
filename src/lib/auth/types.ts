// Auth roles matching backend enum
export type AuthRole = "CLIENT" | "PROVIDER" | "ADMIN" | "SUPER_ADMIN";

// OAuth providers
export type OAuthProvider = "google";

// User as returned by auth endpoints
export interface AuthUser {
  id: string;
  email: string;
  roles: AuthRole[];
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  // OAuth fields
  googleId?: string;
  hasPassword?: boolean;
  // Profile fields (from /users/:id)
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  status?: "ACTIVE" | "SUSPENDED" | "BANNED" | "DELETED";
  createdAt?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles?: AuthRole[];
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
  requiresTwoFactor?: boolean;
  twoFactorToken?: string;
}

// API response types
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    roles: AuthRole[];
  };
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

// 2FA types
export type TwoFactorMethod = "authenticator" | "sms";

export interface TwoFactorSetupResponse {
  secret: string;
  qrCodeUrl: string;
  recoveryCodes: string[];
}

export interface TwoFactorVerifyResult {
  success: boolean;
  error?: string;
  recoveryCodes?: string[];
}

export interface TwoFactorLoginResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

// OAuth types
export interface OAuthCallbackResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
  isNewUser?: boolean;
}