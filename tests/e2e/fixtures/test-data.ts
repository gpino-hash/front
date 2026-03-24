/**
 * Datos de prueba para tests E2E de auth.
 * Cada test usa un email único basado en timestamp para evitar colisiones.
 */

export function uniqueEmail(prefix = "e2e") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@test.com`;
}

export const TEST_CLIENT = {
  firstName: "Test",
  lastName: "Cliente",
  email: "e2e-client@test.com",
  phone: "+5411999888777",
  password: "TestPass123!",
} as const;

export const TEST_PROVIDER = {
  firstName: "Test",
  lastName: "Proveedor",
  email: "e2e-provider@test.com",
  phone: "+5411888777666",
  password: "TestPass123!",
  category: "Plomería",
  experience: "5",
  description: "Proveedor de prueba para tests E2E con más de 5 años de experiencia.",
} as const;

export const INVALID_CREDENTIALS = {
  email: "noexiste@test.com",
  password: "WrongPass123!",
} as const;

export const WEAK_PASSWORDS = [
  "short",        // < 8 chars
  "alllowercase1!", // no uppercase
  "ALLUPPERCASE1!", // no lowercase
  "NoNumbers!",    // no number
  "NoSpecial123",  // no special char
] as const;
