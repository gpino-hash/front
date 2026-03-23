import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { AuthProvider, AuthContext } from "@/lib/auth/auth-context";
import { useContext } from "react";
import { authService } from "@/lib/auth/auth-service";

// Mock auth service
vi.mock("@/lib/auth/auth-service", () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getProfile: vi.fn(),
    getUserDetails: vi.fn(),
    hasStoredSession: vi.fn(),
  },
}));

const mockAuthService = vi.mocked(authService);

// Test consumer component
function TestConsumer() {
  const ctx = useContext(AuthContext);
  if (!ctx) return <div>No context</div>;
  return (
    <div>
      <span data-testid="loading">{ctx.isLoading.toString()}</span>
      <span data-testid="authenticated">{ctx.isAuthenticated.toString()}</span>
      <span data-testid="user">{ctx.user ? JSON.stringify(ctx.user) : "null"}</span>
      <button data-testid="login-btn" onClick={() => ctx.login({ email: "a@b.com", password: "123456" })} />
      <button data-testid="logout-btn" onClick={() => ctx.logout()} />
      <button
        data-testid="register-btn"
        onClick={() =>
          ctx.register({
            email: "new@b.com",
            password: "Pass1@bc",
            firstName: "Juan",
            lastName: "Perez",
          })
        }
      />
    </div>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mockAuthService.hasStoredSession.mockReturnValue(false);
  mockAuthService.getProfile.mockResolvedValue(null);
  mockAuthService.getUserDetails.mockResolvedValue(null);
});

// ─────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────
describe("AuthProvider - Initial state", () => {
  it("should start with isLoading=true and resolve to false", async () => {
    // When there's a stored session, isLoading stays true until profile fetch completes
    mockAuthService.hasStoredSession.mockReturnValue(true);
    let resolveProfile: (value: any) => void;
    mockAuthService.getProfile.mockReturnValue(
      new Promise((resolve) => {
        resolveProfile = resolve;
      })
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    // While waiting for profile, isLoading should be true
    expect(screen.getByTestId("loading").textContent).toBe("true");

    // Resolve the profile fetch
    await act(async () => {
      resolveProfile!(null);
    });

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
  });

  it("should set isLoading=false after session check with no stored session", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(screen.getByTestId("authenticated").textContent).toBe("false");
  });

  it("should restore session from stored tokens on mount", async () => {
    mockAuthService.hasStoredSession.mockReturnValue(true);
    mockAuthService.getProfile.mockResolvedValue({
      id: "u1",
      email: "test@e.com",
      roles: ["CLIENT"],
      emailVerified: true,
    });
    mockAuthService.getUserDetails.mockResolvedValue({
      firstName: "Juan",
      lastName: "Perez",
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
      expect(screen.getByTestId("authenticated").textContent).toBe("true");
    });

    const user = JSON.parse(screen.getByTestId("user").textContent!);
    expect(user.email).toBe("test@e.com");
    expect(user.firstName).toBe("Juan");
  });

  it("should logout when stored session is invalid", async () => {
    mockAuthService.hasStoredSession.mockReturnValue(true);
    mockAuthService.getProfile.mockResolvedValue(null); // token invalid

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(screen.getByTestId("authenticated").textContent).toBe("false");
  });
});

// ─────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────
describe("AuthProvider - Login", () => {
  it("should update user state on successful login", async () => {
    mockAuthService.login.mockResolvedValue({
      success: true,
      user: { id: "u1", email: "a@b.com", roles: ["CLIENT"] },
    });
    mockAuthService.getUserDetails.mockResolvedValue({
      firstName: "Test",
      lastName: "User",
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    await act(async () => {
      screen.getByTestId("login-btn").click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("authenticated").textContent).toBe("true");
    });

    const user = JSON.parse(screen.getByTestId("user").textContent!);
    expect(user.firstName).toBe("Test");
  });

  it("should not update state on failed login", async () => {
    mockAuthService.login.mockResolvedValue({
      success: false,
      error: "Credenciales inválidas",
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    await act(async () => {
      screen.getByTestId("login-btn").click();
    });

    expect(screen.getByTestId("authenticated").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("null");
  });
});

// ─────────────────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────────────────
describe("AuthProvider - Register", () => {
  it("should update user state on successful registration", async () => {
    mockAuthService.register.mockResolvedValue({
      success: true,
      user: { id: "u2", email: "new@b.com", roles: ["CLIENT"] },
    });
    mockAuthService.getUserDetails.mockResolvedValue({
      firstName: "Juan",
      lastName: "Perez",
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    await act(async () => {
      screen.getByTestId("register-btn").click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("authenticated").textContent).toBe("true");
    });
  });

  it("should not update state on failed registration", async () => {
    mockAuthService.register.mockResolvedValue({
      success: false,
      error: "Email ya registrado",
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    await act(async () => {
      screen.getByTestId("register-btn").click();
    });

    expect(screen.getByTestId("authenticated").textContent).toBe("false");
  });
});

// ─────────────────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────────────────
describe("AuthProvider - Logout", () => {
  it("should clear user state and call authService.logout", async () => {
    // Start logged in
    mockAuthService.hasStoredSession.mockReturnValue(true);
    mockAuthService.getProfile.mockResolvedValue({
      id: "u1",
      email: "test@e.com",
      roles: ["CLIENT"],
    });
    mockAuthService.getUserDetails.mockResolvedValue({ firstName: "X" });
    mockAuthService.logout.mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("authenticated").textContent).toBe("true");
    });

    await act(async () => {
      screen.getByTestId("logout-btn").click();
    });

    expect(screen.getByTestId("authenticated").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
  });
});