import { describe, it, expect } from "vitest";
import * as z from "zod";

// ─────────────────────────────────────────────────────────
// Re-create schemas from the source pages (they're not exported)
// ─────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email({ message: "Email invalido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

const registerSchema = z
  .object({
    firstName: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    lastName: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
    email: z.string().email({ message: "Email invalido" }),
    phone: z.string().min(8, { message: "Telefono invalido" }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
      .regex(/[a-z]/, { message: "Debe contener al menos una minúscula" })
      .regex(/[A-Z]/, { message: "Debe contener al menos una mayúscula" })
      .regex(/[0-9]/, { message: "Debe contener al menos un número" })
      .regex(/[@$!%*?&]/, { message: "Debe contener al menos un carácter especial (@$!%*?&)" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

const forgotSchema = z.object({
  email: z.string().email({ message: "Email invalido" }),
});

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Mín. 8 caracteres" })
      .regex(/[a-z]/, { message: "Debe contener minúscula" })
      .regex(/[A-Z]/, { message: "Debe contener mayúscula" })
      .regex(/[0-9]/, { message: "Debe contener número" })
      .regex(/[@$!%*?&]/, { message: "Debe contener especial (@$!%*?&)" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// ─────────────────────────────────────────────────────────
// LOGIN SCHEMA
// ─────────────────────────────────────────────────────────
describe("loginSchema", () => {
  it("should accept valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "123456",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty email", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "123456",
    });
    expect(result.success).toBe(false);
  });

  it("should reject password shorter than 6 chars", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("should accept password with exactly 6 chars", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("should reject missing fields", () => {
    expect(loginSchema.safeParse({}).success).toBe(false);
    expect(loginSchema.safeParse({ email: "a@b.com" }).success).toBe(false);
    expect(loginSchema.safeParse({ password: "123456" }).success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
// REGISTER SCHEMA
// ─────────────────────────────────────────────────────────
describe("registerSchema", () => {
  const validData = {
    firstName: "Juan",
    lastName: "Perez",
    email: "juan@example.com",
    phone: "11234567",
    password: "StrongP@ss1",
    confirmPassword: "StrongP@ss1",
  };

  it("should accept valid registration data", () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  // Name validations
  it("should reject firstName shorter than 2 chars", () => {
    const result = registerSchema.safeParse({ ...validData, firstName: "J" });
    expect(result.success).toBe(false);
  });

  it("should reject lastName shorter than 2 chars", () => {
    const result = registerSchema.safeParse({ ...validData, lastName: "P" });
    expect(result.success).toBe(false);
  });

  it("should accept 2-char names", () => {
    const result = registerSchema.safeParse({
      ...validData,
      firstName: "Jo",
      lastName: "Pe",
    });
    expect(result.success).toBe(true);
  });

  // Email
  it("should reject invalid email format", () => {
    const result = registerSchema.safeParse({ ...validData, email: "invalid" });
    expect(result.success).toBe(false);
  });

  // Phone
  it("should reject phone shorter than 8 chars", () => {
    const result = registerSchema.safeParse({ ...validData, phone: "1234567" });
    expect(result.success).toBe(false);
  });

  it("should accept phone with exactly 8 chars", () => {
    const result = registerSchema.safeParse({ ...validData, phone: "12345678" });
    expect(result.success).toBe(true);
  });

  // Password strength
  it("should reject password shorter than 8 chars", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "Sh@rt1",
      confirmPassword: "Sh@rt1",
    });
    expect(result.success).toBe(false);
  });

  it("should reject password without lowercase", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "STRONG@P1",
      confirmPassword: "STRONG@P1",
    });
    expect(result.success).toBe(false);
  });

  it("should reject password without uppercase", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "strong@p1",
      confirmPassword: "strong@p1",
    });
    expect(result.success).toBe(false);
  });

  it("should reject password without number", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "Strong@Pass",
      confirmPassword: "Strong@Pass",
    });
    expect(result.success).toBe(false);
  });

  it("should reject password without special character", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "StrongPass1",
      confirmPassword: "StrongPass1",
    });
    expect(result.success).toBe(false);
  });

  it("should accept valid special characters @$!%*?&", () => {
    const specials = ["@", "$", "!", "%", "*", "?", "&"];
    for (const char of specials) {
      const pw = `Abcdefg1${char}`;
      const result = registerSchema.safeParse({
        ...validData,
        password: pw,
        confirmPassword: pw,
      });
      expect(result.success).toBe(true);
    }
  });

  // Confirm password
  it("should reject mismatched passwords", () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: "DifferentP@ss1",
    });
    expect(result.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
// FORGOT PASSWORD SCHEMA
// ─────────────────────────────────────────────────────────
describe("forgotSchema", () => {
  it("should accept valid email", () => {
    expect(forgotSchema.safeParse({ email: "a@b.com" }).success).toBe(true);
  });

  it("should reject invalid email", () => {
    expect(forgotSchema.safeParse({ email: "not-email" }).success).toBe(false);
  });

  it("should reject empty email", () => {
    expect(forgotSchema.safeParse({ email: "" }).success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
// RESET PASSWORD SCHEMA
// ─────────────────────────────────────────────────────────
describe("resetSchema", () => {
  const validReset = {
    password: "NewStr0ng@",
    confirmPassword: "NewStr0ng@",
  };

  it("should accept valid reset data", () => {
    expect(resetSchema.safeParse(validReset).success).toBe(true);
  });

  it("should reject password without lowercase", () => {
    expect(
      resetSchema.safeParse({
        password: "NEWSTR0NG@",
        confirmPassword: "NEWSTR0NG@",
      }).success
    ).toBe(false);
  });

  it("should reject password without uppercase", () => {
    expect(
      resetSchema.safeParse({
        password: "newstr0ng@",
        confirmPassword: "newstr0ng@",
      }).success
    ).toBe(false);
  });

  it("should reject password without number", () => {
    expect(
      resetSchema.safeParse({
        password: "NewStrong@",
        confirmPassword: "NewStrong@",
      }).success
    ).toBe(false);
  });

  it("should reject password without special char", () => {
    expect(
      resetSchema.safeParse({
        password: "NewStr0ng",
        confirmPassword: "NewStr0ng",
      }).success
    ).toBe(false);
  });

  it("should reject mismatched passwords", () => {
    expect(
      resetSchema.safeParse({
        password: "NewStr0ng@",
        confirmPassword: "Different1@",
      }).success
    ).toBe(false);
  });

  it("should reject password shorter than 8 chars", () => {
    expect(
      resetSchema.safeParse({
        password: "Ab1@xyz",
        confirmPassword: "Ab1@xyz",
      }).success
    ).toBe(false);
  });
});