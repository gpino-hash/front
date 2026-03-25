import { type FullConfig } from "@playwright/test";

/**
 * Global Setup: registra usuarios de test antes de ejecutar la suite.
 * Se ejecuta UNA SOLA VEZ, evitando rate limiting en el registro.
 *
 * Los usuarios registrados se guardan como variables de entorno
 * para que los tests los reutilicen.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Emails fijos para evitar colisiones
const E2E_CLIENT_EMAIL = `e2e-client-${Date.now()}@test.com`;
const E2E_PROVIDER_EMAIL = `e2e-provider-${Date.now()}@test.com`;

async function globalSetup(config: FullConfig) {
  // Registrar usuario cliente directamente via API
  try {
    const clientRes = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: E2E_CLIENT_EMAIL,
        password: "TestPass123!",
        firstName: "E2E",
        lastName: "Client",
        roles: ["CLIENT"],
      }),
    });

    if (!clientRes.ok && clientRes.status !== 409) {
      console.warn(`Client registration returned ${clientRes.status}: ${await clientRes.text()}`);
    }
  } catch (e) {
    console.warn("Could not register client via API, tests may create users inline:", e);
  }

  // Guardar credenciales como env vars para los tests
  process.env.E2E_CLIENT_EMAIL = E2E_CLIENT_EMAIL;
  process.env.E2E_PROVIDER_EMAIL = E2E_PROVIDER_EMAIL;
  process.env.E2E_PASSWORD = "TestPass123!";
}

export default globalSetup;