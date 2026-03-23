"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService } from "./auth-service";
import type {
  AuthUser,
  AuthState,
  LoginCredentials,
  RegisterData,
  AuthResult,
} from "./types";

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    async function restoreSession() {
      if (!authService.hasStoredSession()) {
        setIsLoading(false);
        return;
      }

      const profile = await authService.getProfile();
      if (profile) {
        // Fetch additional user details
        const details = await authService.getUserDetails(profile.id);
        setUser({ ...profile, ...details });
      } else {
        // Token invalid, clear everything
        await authService.logout();
      }
      setIsLoading(false);
    }

    restoreSession();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResult> => {
    const result = await authService.login(credentials);
    if (result.success && result.user) {
      // Fetch full profile details
      const details = await authService.getUserDetails(result.user.id);
      const fullUser = { ...result.user, ...details };
      setUser(fullUser);
      return { ...result, user: fullUser };
    }
    return result;
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<AuthResult> => {
    const result = await authService.register(data);
    if (result.success && result.user) {
      const details = await authService.getUserDetails(result.user.id);
      const fullUser = { ...result.user, ...details };
      setUser(fullUser);
      return { ...result, user: fullUser };
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!authService.hasStoredSession()) return;
    const profile = await authService.getProfile();
    if (profile) {
      const details = await authService.getUserDetails(profile.id);
      setUser({ ...profile, ...details });
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, isLoading, login, register, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}