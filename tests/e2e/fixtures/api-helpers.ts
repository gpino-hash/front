/**
 * Helpers para interactuar con la API directamente en tests E2E.
 * Evita pasar por la UI para operaciones de setup (registro, login)
 * y evita problemas de rate limiting con múltiples workers.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface ApiTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 5
): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, options);

    if (res.status === 429 && attempt < maxRetries) {
      // Backoff exponencial: 2s, 4s, 8s, 16s, 32s
      const delay = Math.pow(2, attempt + 1) * 1000;
      await new Promise((r) => setTimeout(r, delay));
      continue;
    }

    return res;
  }

  // Nunca debería llegar aquí pero TypeScript lo necesita
  throw new Error("Max retries exceeded");
}

export async function registerUserViaApi(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles?: string[];
}): Promise<{ authUserId: string; email: string }> {
  const res = await fetchWithRetry(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      roles: data.roles || ["CLIENT"],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Register failed (${res.status}): ${body}`);
  }

  return res.json();
}

export async function loginViaApi(
  email: string,
  password: string
): Promise<ApiTokens> {
  const res = await fetchWithRetry(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Login failed (${res.status}): ${body}`);
  }

  return res.json();
}